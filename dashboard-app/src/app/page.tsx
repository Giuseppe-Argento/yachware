'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { setDevices, updateDeviceState } from '../store/devicesSlice';
import ThemeToggle from '@/components/ThemeToggle';
import SortableDeviceList from '@/components/SortableDeviceList';
import Sensor from '@/components/Sensor';

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const devices = useSelector((state: RootState) => state.devices.devices);
  const [deviceOrder, setDeviceOrder] = useState<number[]>([]);
  const [groupBy, setGroupBy] = useState<'none' | 'location' | 'type'>('none');
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    // Fetch initial device data from API
    fetch('/api/devices')
      .then((res) => res.json())
      .then((data) => {
        dispatch(setDevices(data));
        setDeviceOrder(data.map((device) => device.id));
      });
    
    // Set up WebSocket connection for real-time updates
    const socket = new WebSocket("ws://localhost:4000"); 
    socket.onopen = () => {
      console.log("Connected to WebSocket Server");
    };

    socket.onmessage = (event) => {
      const updatedDevice = JSON.parse(event.data);
      // Update the state with the device update received via WebSocket
      dispatch(updateDeviceState({ id: updatedDevice.id, newState: updatedDevice.currentState }));
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("Disconnected from WebSocket Server");
    };

    // Clean up WebSocket on component unmount
    return () => {
      socket.close();
    };
  }, [dispatch]);
  
  const socket = new WebSocket("ws://localhost:4000");
  socket.onopen = () => socket.send(JSON.stringify({ test: "data updated" }));
  socket.onmessage = (event) => console.log("WebSocket Received:", event.data);

  
  const toggleDevice = async (id: number, newState: string) => {
    const device = devices.find((d) => d.id === id);
    if (!device) return;

    dispatch(updateDeviceState({ id, newState }));

    try {
      const response = await fetch('/api/devices', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, newState }),
      });

      if (!response.ok) throw new Error('Failed to update device state');
    } catch (error) {
      console.error(error);
      alert('Failed to update device state.');
      dispatch(updateDeviceState({ id, newState: device.currentState }));
    }
  };

  const updateDeviceSetting = async (id: number, setting: string, value: any) => {
    const device = devices.find((d) => d.id === id);
    if (!device) return;

    dispatch(updateDeviceState({ id, [setting]: value }));

    try {
      const response = await fetch('/api/devices', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, [setting]: value }),
      });

      if (!response.ok) throw new Error('Failed to update device setting');
    } catch (error) {
      console.error(error);
      alert('Failed to update device setting.');
    }
  };

  const groupedDevices = () => {
    if (groupBy === 'location') {
      return devices.reduce((acc, device) => {
        acc[device.location] = acc[device.location] || [];
        acc[device.location].push(device);
        return acc;
      }, {} as Record<string, typeof devices>);
    }
    if (groupBy === 'type') {
      return devices.reduce((acc, device) => {
        acc[device.type] = acc[device.type] || [];
        acc[device.type].push(device);
        return acc;
      }, {} as Record<string, typeof devices>);
    }
    return { '': devices };
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <div className="flex-grow p-6 bg-gray-50 dark:bg-gray-900 dark:text-white w-full md:ml-64 min-h-screen overflow-auto">
        <ThemeToggle />
        <h1 className="text-2xl sm:text-3xl md:text-3xl font-bold text-center mb-8" data-testid="cypress-title">Smart Home</h1>
        <Sensor/>
        <div className="flex justify-center gap-4 mb-6">
          <button
            className={`px-4 py-2 rounded ${groupBy === 'none' ? 'bg-blue-600 text-white shadow-md dark:bg-blue-500'
              : 'bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-600'}`}
            onClick={() => setGroupBy('none')}
          >
            All Devices
          </button>
          <button
            className={`px-4 py-2 rounded ${groupBy === 'location' ? 'bg-blue-600 text-white shadow-md dark:bg-blue-500'
              : 'bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-600'}`}
            onClick={() => setGroupBy('location')}
          >
            Group by Location
          </button>
          <button
            className={`px-4 py-2 rounded ${groupBy === 'type' ? 'bg-blue-600 text-white shadow-md dark:bg-blue-500'
              : 'bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-600'}`}
            onClick={() => setGroupBy('type')}
          >
            Group by Type
          </button>
        </div>

        {Object.entries(groupedDevices()).map(([group, devices]) => (
          <div key={group} className="mb-6">
            <h2 className="text-xl font-bold mb-4">{group}</h2>
            <SortableDeviceList
              devices={devices}
              deviceOrder={deviceOrder}
              setDeviceOrder={setDeviceOrder}
              toggleDevice={toggleDevice}
              updateDeviceSetting={updateDeviceSetting}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

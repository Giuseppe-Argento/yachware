'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function Analytics() {
  const [devices, setDevices] = useState([]);
  const [analyticsData, setAnalyticsData] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedType, setSelectedType] = useState('');

  // Fetch all devices from API
  const fetchDevices = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/devices');
      const data = await response.json();
      setDevices(data);
    } catch (error) {
      console.error('Failed to fetch devices:', error);
    }
  };

  // Fetch analytics data based on selected filters
  const fetchAnalyticsData = async () => {
    try {
      let query = new URLSearchParams();
      if (selectedDevice) query.append('name', selectedDevice);
      if (selectedLocation) query.append('location', selectedLocation);
      if (selectedType) query.append('type', selectedType);

      const response = await fetch(`http://localhost:3000/api/analytics?${query.toString()}`);
      const data = await response.json();

      if (Array.isArray(data)) {
        // Format timestamps correctly
        const formattedData = data.map((entry) => ({
          ...entry,
          timestamp: new Date().toLocaleTimeString(),
        }));

        setAnalyticsData(formattedData);
      } else {
        console.error("Invalid analytics response:", data);
        setAnalyticsData([]);
      }
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
    }
  };

  useEffect(() => {
    fetchDevices(); // Load devices on mount
    fetchAnalyticsData(); // Fetch initial analytics data

    // Refresh analytics every 10 seconds
    const interval = setInterval(() => {
      fetchAnalyticsData();
    }, 10000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [selectedDevice, selectedLocation, selectedType]);

  return (
    <div className="w-full mx-auto p-4 bg-white shadow-lg">
      {/* Filters Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg mb-6">
        <h2 className="text-xl font-bold mb-4 text-gray-700 dark:text-gray-300">Filter Analytics</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Device Name Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Device Name</label>
            <select
              value={selectedDevice}
              onChange={(e) => setSelectedDevice(e.target.value)}
              className="mt-1 p-3 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              {devices.map((device) => (
                <option key={device.id} value={device.name}>{device.name}</option>
              ))}
            </select>
          </div>

          {/* Device Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Device Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="mt-1 p-3 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              {[...new Set(devices.map((d) => d.type))].map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Location Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Location</label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="mt-1 p-3 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              {[...new Set(devices.map((d) => d.location))].map((location) => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Analytics Chart */}
      <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-gray-700 dark:text-gray-300">Real-Time Analytics</h2>

        {analyticsData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={analyticsData}>
              <XAxis dataKey="timestamp" stroke="#8884d8" />
              <YAxis stroke="#8884d8" />
              <Tooltip contentStyle={{ backgroundColor: '#333', color: '#fff' }} />
              <Legend />
              <Line type="monotone" dataKey="temperature" stroke="#FF5733" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="humidity" stroke="#33FF57" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="brightness" stroke="#3380FF" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="volume" stroke="#F3C623" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-gray-500">No analytics data available.</p>
        )}
      </div>
    </div>
  );
}
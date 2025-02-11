"use client";

import { useEffect, useState } from "react";
import { SignalIcon, SunIcon } from "@heroicons/react/24/outline";
import { ClockIcon, MoonIcon, ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

interface SensorData {
  temperature: number;
  humidity: number;
  timestamp: string;
}

const Sensor = () => {
  const [data, setData] = useState<SensorData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:4000");

    ws.onopen = () => console.log("Connected to WebSocket");
    
    ws.onmessage = (event) => {
      try {
        const parsedData: SensorData = JSON.parse(event.data);
        setData(parsedData);
      } catch (err) {
        setError("Error parsing WebSocket data");
      }
    };

    ws.onerror = () => {
      setError("WebSocket error occurred");
    };

    ws.onclose = () => console.log("WebSocket disconnected");

    return () => ws.close();
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <div className="w-[100%] sm:w-[50%] mx-auto mt-5 shadow-lg border rounded-xl p-4 bg-white dark:bg-gray-800 dark:text-white mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Live Sensor Data</h2>
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-full bg-gray-200 dark:bg-gray-700">
          {isOpen ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
        </button>
      </div>
      {isOpen && (
        <>
          {error ? (
            <div className="p-3 mb-2 text-red-700 bg-red-100 border border-red-400 rounded dark:bg-red-900 dark:text-red-300">
              {error}
            </div>
          ) : data ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <SunIcon style={{width:'24px'}} className="text-red-500 text-lg" />
                <p className="text-lg">Temperature: <span className="font-semibold">{data.temperature}°C</span></p>
              </div>
              <div className="flex items-center gap-2">
                <SignalIcon style={{width:'24px'}} className="text-blue-500 text-lg" />
                <p className="text-lg">Humidity: <span className="font-semibold">{data.humidity}%</span></p>
              </div>
              <div className="flex items-center text-gray-500 text-sm gap-1 dark:text-gray-400">
                <ClockIcon className="w-4 h-4" />
                <p>{data.timestamp}</p>
              </div>
            </div>
          ) : (
            <p className="text-center">Loading sensor data...</p>
          )}
        </>
      )}
    </div>
  );
};

export default Sensor;

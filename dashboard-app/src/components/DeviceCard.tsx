import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';

import {
  LightBulbIcon,
  CameraIcon,
  SpeakerWaveIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';

const DeviceIcon = ({ type, isActive }) => {
  const iconClasses = `w-16 h-16 mb-4 transition-colors ${isActive ? "opacity-100" : "opacity-40 text-gray-400"
    }`;

  switch (type) {
    case 'Light':
      return <LightBulbIcon className={`${iconClasses} ${isActive ? "text-yellow-500" : ""}`} />;
    case 'Thermostat':
      return <AdjustmentsHorizontalIcon className={`${iconClasses} ${isActive ? "text-red-500" : ""}`} />;
    case 'Security Camera':
      return <CameraIcon className={`${iconClasses} ${isActive ? "text-gray-500 dark:text-gray-100" : ""}`} />;
    case 'Smart Speaker':
      return <SpeakerWaveIcon className={`${iconClasses} ${isActive ? "text-blue-500" : ""}`} />;
    default:
      return null;
  }
};


const DeviceCard = ({ device, toggleDevice, updateDeviceSetting }) => {
  const [brightness, setBrightness] = useState(Number(device.brightness) || 0);
  const [temperature, setTemperature] = useState(Number(device.temperature) || 20);
  const [volume, setVolume] = useState(Number(device.volume) || 50);

  // Ref to track if initial values have been set
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!isInitialized.current) {
      setBrightness(device.brightness ?? 0);
      setTemperature(parseInt(device.temperature) || 20);
      setVolume(
        device.volume !== undefined && !isNaN(parseInt(device.volume))
          ? parseInt(device.volume)
          : 50
      );

      isInitialized.current = true;
    }
  }, [device]);


  const handleToggle = () => {
    const isActive = device.currentState !== 'off' && device.currentState !== 'inactive';
    const newState = isActive ? 'off' : 'on';

    toggleDevice(device.id, newState, {
      brightness: isActive ? 0 : brightness,
      temperature: isActive ? 0 : temperature,
      volume: isActive ? 0 : volume,
    });
  };

  return (
    <Card data-testid="cypress-list" className="hover:shadow-lg transition-shadow h-full">
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-xl font-semibold">{device.name}</CardTitle>
        <Badge>{device.type}</Badge>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <DeviceIcon type={device.type} isActive={device.currentState !== 'off' && device.currentState !== 'inactive'} />
        <p className="text-gray-600 mb-3 dark:text-gray-100">Location: {device.location}</p>
        {/* <p className="text-gray-600 mb-4">Status: {device.currentState}</p> */}

        {/* Prevent dragging when interacting with Switch */}
        <Switch
          data-testid={`device-toggle-${device.id}`}
          checked={device.currentState !== 'off' && device.currentState !== 'inactive'}
          onCheckedChange={handleToggle}
          onPointerDown={(e) => e.stopPropagation()} // ⛔ Prevent dragging when toggling
        />

        {/* Light Brightness Control */}
        {device.type === 'Light' && device.currentState !== 'off' && (
          <div className="flex flex-col items-center w-full mt-2">
            <p className="text-gray-500 dark:text-gray-100">Brightness: {brightness}%</p>
            <Slider
              value={[brightness]}
              onValueChange={(value) => setBrightness(value[0])}
              onValueCommit={(value) => updateDeviceSetting(device.id, 'brightness', value[0])}
              min={0}
              max={100}
              step={1}
              className="w-2/3"
              onPointerDown={(e) => e.stopPropagation()} // ⛔ Prevent dragging when using slider
            />
          </div>
        )}

        {/* Thermostat Temperature Control */}
        {device.type === 'Thermostat' && device.currentState !== 'off' && (
          <div className="flex flex-col items-center w-full mt-2">
            <p className="text-gray-500 dark:text-gray-100">Temperature: {temperature}°C</p>
            <Slider
              value={[temperature]}
              onValueChange={(value) => setTemperature(value[0])}
              onValueCommit={(value) => updateDeviceSetting(device.id, 'temperature', `${value[0]}°C`)}
              min={10}
              max={30}
              step={1}
              className="w-2/3"
              onPointerDown={(e) => e.stopPropagation()} // ⛔ Prevent dragging when using slider
            />
          </div>
        )}

        {/* Smart Speaker Volume Control */}
        {device.type === 'Smart Speaker' && device.currentState !== 'off' && (
          <div className="flex flex-col items-center w-full mt-2">
            <p className="text-gray-500 dark:text-gray-100">Volume: {volume}%</p>
            <Slider
              value={[volume]}
              onValueChange={(value) => {
                setVolume(Math.max(0, value[0]));
              }}
              onValueCommit={(value) => updateDeviceSetting(device.id, 'volume', value[0])}
              min={0}
              max={100}
              step={5}
              className="w-2/3"
              onPointerDown={(e) => e.stopPropagation()} // ⛔ Prevent dragging when using slider
            />
          </div>
        )}

        {/* Security Camera Toggle */}
        {device.type === 'Security Camera' && (
          <button
            onClick={handleToggle}
            className="btn mt-2"
            onPointerDown={(e) => e.stopPropagation()} // ⛔ Prevent dragging when clicking button
          >
          </button>
        )}
      </CardContent>
    </Card>
  );
};

export default DeviceCard;

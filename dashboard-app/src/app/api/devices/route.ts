import { NextRequest, NextResponse } from 'next/server';
import { broadcastUpdate } from '../../../../lib/wsServer'; // Ensure this path is correct
import fs from 'fs';
import path from 'path';
import { faker } from '@faker-js/faker';

const FILE_PATH = path.join(process.cwd(), 'devices.json');

interface Device {
  id: number;
  name: string;
  type: string;
  location: string;
  currentState: string;
  temperature: string;
  humidity: string;
  brightness?: number;
  volume?: number;
}

const deviceTypes = [
  { type: 'Light', states: ['on', 'off'], brightness: { min: 0, max: 100 }, names: ['Philips Hue', 'LIFX Mini', 'TP-Link Kasa', 'Sengled Smart LED', 'Nanoleaf A19'] },
  { type: 'Thermostat', states: ['20°C', '22°C', '24°C'], names: ['Nest Thermostat', 'ecobee SmartThermostat', 'Honeywell T9'] },
  { type: 'Security Camera', states: ['active', 'inactive'], names: ['Arlo Pro', 'Ring Stick Up Cam', 'Google Nest Cam'] },
  { type: 'Smart Speaker', states: ['30% volume', '50% volume', '70% volume'], names: ['Amazon Echo', 'Google Nest Audio', 'Apple HomePod Mini'] },
];

const locations = ['Kitchen', 'Living Room', 'Bedroom', 'Bathroom', 'Garage', 'Office'];

// Generate Fake Devices
const generateFakeDevices = (count = 10): Device[] => {
  return Array.from({ length: count }).map((_, index) => {
    const deviceType = faker.helpers.arrayElement(deviceTypes);
    const location = faker.helpers.arrayElement(locations);

    const device: Device = {
      id: index + 1,
      name: faker.helpers.arrayElement(deviceType.names),
      type: deviceType.type,
      location,
      currentState: faker.helpers.arrayElement(deviceType.states),
      temperature: faker.number.float({ min: 18, max: 30, fractionDigits: 1 }) + '°C',
      humidity: faker.number.float({ min: 30, max: 70, fractionDigits: 1 }) + '%',
    };

    if (device.type === 'Light' && deviceType.brightness) {
      device.brightness = faker.number.int({ min: deviceType.brightness.min, max: deviceType.brightness.max });
    }

    if (device.type === 'Smart Speaker') {
      device.volume = faker.number.int({ min: 10, max: 100 });
    }

    return device;
  });
};

// Add CORS headers to allow cross-origin requests
const addCORSHeaders = (res: NextResponse) => {
  res.headers.set('Access-Control-Allow-Origin', '*'); // Allow all origins (you can replace '*' with specific domains for security)
  res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return res;
};

export async function GET(req: NextRequest) {
  const res = NextResponse.json(await loadDevicesData(), { status: 200 });

  // Add CORS headers
  return addCORSHeaders(res);
}

interface PutRequestBody {
  id: number;
  newState?: string;
  brightness?: number;
  temperature?: number;
  volume?: number;
}

export async function PUT(req: NextRequest) {
  try {
    const { id, newState, brightness, temperature, volume }: PutRequestBody = await req.json();
    let devices = await loadDevicesData();

    const deviceIndex = devices.findIndex((device) => device.id === id);
    if (deviceIndex === -1) {
      return NextResponse.json({ error: 'Device not found' }, { status: 404 });
    }

    const updatedDevice = { ...devices[deviceIndex] };
    if (newState) updatedDevice.currentState = newState;
    if (brightness !== undefined) updatedDevice.brightness = brightness;
    if (volume !== undefined) updatedDevice.volume = volume;
    if (temperature !== undefined) updatedDevice.temperature = `${temperature}°C`;

    devices[deviceIndex] = updatedDevice;
    await saveDevicesData(devices);

    // 🔥 Send real-time update to WebSocket clients
    broadcastUpdate(updatedDevice);

    const res = NextResponse.json(updatedDevice, { status: 200 });

    // Add CORS headers
    return addCORSHeaders(res);
  } catch (error) {
    console.error('Error processing PUT request:', error);
    const res = NextResponse.json({ error: 'Invalid request' }, { status: 400 });

    // Add CORS headers
    return addCORSHeaders(res);
  }
}

// Handle pre-flight OPTIONS request for CORS (required for PUT, POST)
export async function OPTIONS(req: NextRequest) {
  const res = NextResponse.next();

  // Add CORS headers for OPTIONS pre-flight requests
  return addCORSHeaders(res);
}

// Load devices from JSON file or generate fake data
async function loadDevicesData(): Promise<Device[]> {
  try {
    if (fs.existsSync(FILE_PATH)) {
      const rawData = await fs.promises.readFile(FILE_PATH, 'utf8');
      return JSON.parse(rawData);
    } else {
      const newDevices = generateFakeDevices(10);
      await saveDevicesData(newDevices);
      return newDevices;
    }
  } catch (error) {
    console.error('Error loading device data:', error);
    return [];
  }
}

// Save devices to JSON file
async function saveDevicesData(data: Device[]) {
  try {
    await fs.promises.writeFile(FILE_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving device data:', error);
  }
}


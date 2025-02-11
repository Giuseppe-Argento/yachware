import fs from 'fs';
import path from 'path';
import { faker } from '@faker-js/faker';
import { NextRequest, NextResponse } from 'next/server';

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

// Load devices from JSON file
const loadDevicesData = async (): Promise<Device[]> => {
  try {
    if (fs.existsSync(FILE_PATH)) {
      const rawData = await fs.promises.readFile(FILE_PATH, 'utf8');
      return JSON.parse(rawData);
    }
  } catch (error) {
    console.error('Error loading device data:', error);
  }
  return [];
};

// Generate realistic fake analytics data matching devices.json structure
const generateFakeDeviceData = (device: Device): Device => {
  return {
    ...device,
    temperature: faker.number.float({ min: 18, max: 30, fractionDigits: 1 }) + '°C',
    humidity: faker.number.float({ min: 30, max: 70, fractionDigits: 1 }) + '%',
    brightness: device.brightness !== undefined ? faker.number.int({ min: 0, max: 100 }) : undefined,
    volume: device.volume !== undefined ? faker.number.int({ min: 10, max: 100 }) : undefined,
  };
};

// GET /api/analytics?name=Google Nest Cam&location=Garage
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  const name = url.searchParams.get('name');
  const type = url.searchParams.get('type');
  const location = url.searchParams.get('location');

  const devices = await loadDevicesData();

  // Filter devices based on query params
  let filteredDevices = devices;
  if (id) filteredDevices = filteredDevices.filter((d) => d.id === parseInt(id));
  if (name) filteredDevices = filteredDevices.filter((d) => d.name.toLowerCase() === name.toLowerCase());
  if (type) filteredDevices = filteredDevices.filter((d) => d.type.toLowerCase() === type.toLowerCase());
  if (location) filteredDevices = filteredDevices.filter((d) => d.location.toLowerCase() === location.toLowerCase());

  if (filteredDevices.length === 0) {
    return new Response(JSON.stringify({ error: 'No matching devices found' }), { status: 404 });
  }

  // Generate fake analytics data for the filtered devices
  const analyticsData = filteredDevices.map(generateFakeDeviceData);

  return new Response(JSON.stringify(analyticsData), {
    status: 200,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Allow all origins
        'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
  });
}

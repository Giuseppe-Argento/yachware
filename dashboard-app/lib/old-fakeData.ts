// lib/fakeData.ts
import { faker } from '@faker-js/faker';

export interface Device {
  id: number;
  type: string;
  name: string;
  currentState: string;
  location: string;
}

const deviceTypes = [
  { type: 'Light', states: ['on', 'off'] },
  { type: 'Thermostat', states: ['20°C', '22°C', '24°C'] },
  { type: 'Security Camera', states: ['active', 'inactive'] },
  { type: 'Smart Speaker', states: ['30% volume', '50% volume', '70% volume'] },
];

export function generateFakeDevices(count = 10): Device[] {
  return Array.from({ length: count }).map((_, index) => {
    const deviceType = faker.helpers.arrayElement(deviceTypes);
    return {
      id: index + 1,
      type: deviceType.type,
      name: faker.commerce.productName(),
      currentState: faker.helpers.arrayElement(deviceType.states),
      location: faker.helpers.arrayElement(['Living Room', 'Kitchen', 'Bedroom', 'Garage']),
    };
  });
}
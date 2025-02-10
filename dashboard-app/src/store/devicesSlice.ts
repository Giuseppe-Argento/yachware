import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Device {
  id: number;
  type: string;
  name: string;
  currentState: string;
  location: string;
  icon: string;
  brightness?: number;
  volume?: number;
  temperature?: number;
}

interface DevicesState {
  devices: Device[];
}

const initialState: DevicesState = {
  devices: [],
};

const devicesSlice = createSlice({
  name: 'devices',
  initialState,
  reducers: {
    setDevices: (state, action: PayloadAction<Device[]>) => {
      state.devices = Array.isArray(action.payload) ? action.payload : [];
    },
    updateDeviceState: (state, action: PayloadAction<{ id: number; newState?: string; brightness?: number; volume?: number; temperature?: number }>) => {
      const { id, newState, brightness, volume, temperature } = action.payload;
      const device = state.devices.find((d) => d.id === id);
      if (device) {
        if (newState !== undefined) device.currentState = newState;
        if (brightness !== undefined) device.brightness = brightness;
        if (volume !== undefined) device.volume = volume;
        if (temperature !== undefined) device.temperature = temperature;
      }
    },
  },
});

export const { setDevices, updateDeviceState } = devicesSlice.actions;
export default devicesSlice.reducer;
// store/index.ts

import { configureStore } from '@reduxjs/toolkit';
import devicesReducer from './devicesSlice';
import websocketReducer from './websocketSlice';

const store = configureStore({
  reducer: {
    devices: devicesReducer,
    websocket: websocketReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

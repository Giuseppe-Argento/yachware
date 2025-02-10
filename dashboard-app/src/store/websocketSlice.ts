// store/websocketSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WebSocketState {
  socket: WebSocket | null;
}

const initialState: WebSocketState = {
  socket: null,
};

const websocketSlice = createSlice({
  name: 'websocket',
  initialState,
  reducers: {
    setSocket: (state, action: PayloadAction<WebSocket | null>) => {
      state.socket = action.payload;
    },
    closeSocket: (state) => {
      if (state.socket) {
        state.socket.close();
      }
      state.socket = null;
    },
  },
});

export const { setSocket, closeSocket } = websocketSlice.actions;
export default websocketSlice.reducer;

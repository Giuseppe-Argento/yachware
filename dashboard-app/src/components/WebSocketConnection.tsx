// components/WebSocketConnection.tsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSocket, closeSocket } from '../store/websocketSlice';
import { RootState, AppDispatch } from '../store';

const WebSocketConnection = () => {
  const dispatch = useDispatch<AppDispatch>();
  const socket = useSelector((state: RootState) => state.websocket.socket);

  useEffect(() => {
    const newSocket = new WebSocket('ws://localhost:4000'); 
    dispatch(setSocket(newSocket));

    newSocket.onopen = () => {
      console.log('WebSocket connected');
    };

    newSocket.onmessage = (event) => {
      console.log('Received message:', event);
    };

    newSocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    newSocket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    // Cleanup function: Close WebSocket on component unmount
    return () => {
      dispatch(closeSocket()); // This will close the WebSocket if the component is unmounted
    };
  }, [dispatch]);

  return (
    <div>
      <h3>WebSocket Status: {socket ? 'Connected' : 'Disconnected'}</h3>
    </div>
  );
};

export default WebSocketConnection;

// src/hooks/useWebSocket.ts (mock implementation)
import { useEffect, useState, useRef } from 'react';

interface PriceData {
  coin: string;
  price: number;
  timestamp: number;
}

interface WebSocketHook {
  prices: PriceData[];
  connect: () => void;
  disconnect: () => void;
}

export const useWebSocket = (): WebSocketHook => {
  const [prices, setPrices] = useState<PriceData[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const connect = () => {
    console.log('Simulating WebSocket connection for price updates...');

    intervalRef.current = setInterval(() => {
      const newPrices: PriceData[] = [];
      const bitcoinPrice = 20000 + Math.random() * 2000;
      newPrices.push({
        coin: 'bitcoin',
        price: bitcoinPrice,
        timestamp: Date.now(),
      });
      const ethereumPrice = 1500 + Math.random() * 200;
      newPrices.push({
        coin: 'ethereum',
        price: ethereumPrice,
        timestamp: Date.now(),
      });
      const bnbPrice = 300 + Math.random() * 50;
      newPrices.push({
        coin: 'binancecoin',
        price: bnbPrice,
        timestamp: Date.now(),
      });

      setPrices((prevPrices) => [...prevPrices, ...newPrices].slice(-100));
    }, 10000);
  };

  const disconnect = () => {
    console.log('Disconnecting simulated WebSocket...');
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  return { prices, connect, disconnect };
};
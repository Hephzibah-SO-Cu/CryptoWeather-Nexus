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

    // Simulate price updates every 10 seconds
    intervalRef.current = setInterval(() => {
      const newPrices: PriceData[] = [];

      // Simulate Bitcoin price (fluctuate between $20,000 and $22,000)
      const bitcoinPrice = 20000 + Math.random() * 2000;
      newPrices.push({
        coin: 'bitcoin',
        price: bitcoinPrice,
        timestamp: Date.now(),
      });

      // Simulate Ethereum price (fluctuate between $1,500 and $1,700)
      const ethereumPrice = 1500 + Math.random() * 200;
      newPrices.push({
        coin: 'ethereum',
        price: ethereumPrice,
        timestamp: Date.now(),
      });

      setPrices((prevPrices) => [...prevPrices, ...newPrices].slice(-100)); // Keep last 100 updates
    }, 10000); // Update every 10 seconds
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
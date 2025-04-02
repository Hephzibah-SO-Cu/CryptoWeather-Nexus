import { useEffect, useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchWeather } from '../redux/slices/weatherSlice';
import { fetchCrypto } from '../redux/slices/cryptoSlice';
import { fetchNews } from '../redux/slices/newsSlice';
import { setFavorites } from '../redux/slices/favoritesSlice';
import { addNotification, removeNotification } from '../redux/slices/notificationSlice';
import Layout from '../components/Layout/Layout';
import WeatherCard from '../components/Weather/WeatherCard';
import CryptoCard from '../components/Crypto/CryptoCard';
import NewsItem from '../components/News/NewsItem';
import { useWebSocket } from '../hooks/useWebSocket';
import { toast } from 'react-toastify';

export default function Home() {
  const dispatch = useAppDispatch();
  const { data: weatherData, loading: weatherLoading, error: weatherError } = useAppSelector((state) => state.weather);
  const { data: cryptoData, loading: cryptoLoading, error: cryptoError } = useAppSelector((state) => state.crypto);
  const { data: newsData, loading: newsLoading, error: newsError } = useAppSelector((state) => state.news);
  const { cities: favoriteCities, cryptos: favoriteCryptos } = useAppSelector((state) => state.favorites);
  const { notifications } = useAppSelector((state) => state.notifications);
  const [retryCrypto, setRetryCrypto] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { prices, connect, disconnect } = useWebSocket();

  const fetchData = useCallback(() => {
    ['new york', 'london', 'tokyo'].forEach((city) => {
      dispatch(fetchWeather(city));
    });
    dispatch(fetchCrypto(['bitcoin', 'ethereum', 'binancecoin']));
    dispatch(fetchNews());
  }, [dispatch]);

  useEffect(() => {
    setIsClient(true);
    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, [fetchData]);

  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      const parsed = JSON.parse(savedFavorites);
      dispatch(setFavorites({ cities: parsed.cities || [], cryptos: parsed.cryptos || [] }));
    }
  }, [dispatch]);

  // WebSocket connection
  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  // Calculate price changes and dispatch notifications
  useEffect(() => {
    const priceMap: { [key: string]: { price: number; timestamp: number }[] } = {
      bitcoin: [],
      ethereum: [],
    };

    prices.forEach((priceData) => {
      priceMap[priceData.coin].push({
        price: priceData.price,
        timestamp: priceData.timestamp,
      });
    });

    const checkPriceChange = (coin: string) => {
      const coinPrices = priceMap[coin].slice(-2); // Last two prices
      if (coinPrices.length < 2) return;

      const [olderPrice, newerPrice] = coinPrices;
      const timeDiff = (newerPrice.timestamp - olderPrice.timestamp) / (1000 * 60); // Minutes
      if (timeDiff > 5) return; // Only check within 5 minutes

      const priceChange = ((newerPrice.price - olderPrice.price) / olderPrice.price) * 100;
      if (Math.abs(priceChange) > 5) {
        const message = `${coin.charAt(0).toUpperCase() + coin.slice(1)} price changed by ${priceChange.toFixed(2)}% in the last ${timeDiff.toFixed(1)} minutes!`;
        dispatch(
          addNotification({
            id: `${coin}-${Date.now()}`,
            type: 'price_alert',
            message,
          })
        );
      }
    };

    checkPriceChange('bitcoin');
    checkPriceChange('ethereum');
  }, [prices, dispatch]);

  // Display notifications as toasts
  useEffect(() => {
    notifications.forEach((notification: any) => {
      toast[notification.type === 'price_alert' ? 'info' : 'warning'](
        notification.message,
        {
          toastId: notification.id,
          onClose: () => dispatch(removeNotification(notification.id)),
        }
      );
    });
  }, [notifications, dispatch]);

  // Simulate weather alerts
  useEffect(() => {
    const interval = setInterval(() => {
      const cities = ['new york', 'london', 'tokyo'];
      const randomCity = cities[Math.floor(Math.random() * cities.length)];
      const message = `Storm warning in ${randomCity.charAt(0).toUpperCase() + randomCity.slice(1)}!`;
      dispatch(
        addNotification({
          id: `weather-${Date.now()}`,
          type: 'weather_alert',
          message,
        })
      );
    }, 2 * 60 * 1000); // Every 2 minutes for testing

    return () => clearInterval(interval);
  }, [dispatch]);

  const handleRetryCrypto = () => {
    setRetryCrypto(true);
    dispatch(fetchCrypto(['bitcoin', 'ethereum', 'binancecoin']));
  };

  const handleManualRefresh = () => {
    fetchData();
  };

  if (!isClient) {
    return null;
  }

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button
          onClick={handleManualRefresh}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Refresh Data
        </button>
      </div>

      {(favoriteCities.length > 0 || favoriteCryptos.length > 0) && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Favorites</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              {favoriteCities.map((city) => (
                weatherData[city] && <WeatherCard key={city} city={city} data={weatherData[city]} />
              ))}
            </div>
            <div className="space-y-4">
              {favoriteCryptos.map((cryptoId) => {
                const crypto = cryptoData.find((c) => c.id === cryptoId);
                return crypto && <CryptoCard key={cryptoId} data={crypto} />;
              })}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Weather</h2>
          {weatherLoading && <p className="text-gray-500">Loading weather...</p>}
          {weatherError && <p className="text-red-500">Error: {weatherError}</p>}
          {!weatherLoading && !weatherError && Object.keys(weatherData).length === 0 && (
            <p className="text-gray-500">No weather data available.</p>
          )}
          {Object.keys(weatherData).map((city) => (
            <WeatherCard key={city} city={city} data={weatherData[city]} />
          ))}
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Cryptocurrency</h2>
          {cryptoLoading && <p className="text-gray-500">Loading crypto...</p>}
          {cryptoError && (
            <div>
              <p className="text-red-500">Error: {cryptoError}</p>
              <button
                onClick={handleRetryCrypto}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Retry
              </button>
            </div>
          )}
          {!cryptoLoading && !cryptoError && cryptoData.length === 0 && (
            <p className="text-gray-500">No crypto data available.</p>
          )}
          {cryptoData.map((crypto) => (
            <CryptoCard key={crypto.id} data={crypto} />
          ))}
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">News</h2>
          {newsLoading && <p className="text-gray-500">Loading news...</p>}
          {newsError && <p className="text-red-500">Error: {newsError}</p>}
          {!newsLoading && !newsError && newsData.length === 0 && (
            <p className="text-gray-500">No news available.</p>
          )}
          {newsData.map((article, index) => (
            <NewsItem key={index} article={article} />
          ))}
        </div>
      </div>
    </Layout>
  );
}
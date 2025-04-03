// src/pages/index.tsx
import { useEffect, useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchWeather } from '../redux/slices/weatherSlice';
import { fetchCrypto } from '../redux/slices/cryptoSlice';
import { fetchNews } from '../redux/slices/newsSlice';
import { setFavorites } from '../redux/slices/favoritesSlice';
import { addNotification, removeNotification } from '../redux/slices/notificationSlice';
import { Notification } from '../redux/slices/notificationSlice'; // Import the Notification type
import Layout from '../components/Layout/Layout';
import WeatherCard from '../components/Weather/WeatherCard';
import CryptoCard from '../components/Crypto/CryptoCard';
import NewsItem from '../components/News/NewsItem';
import { useWebSocket } from '../hooks/useWebSocket';
import { toast, ToastContainer } from 'react-toastify';

export default function Home() {
  const dispatch = useAppDispatch();
  const { data: weatherData, loading: weatherLoading, error: weatherError } = useAppSelector((state) => state.weather);
  const { data: cryptoData, loading: cryptoLoading, error: cryptoError } = useAppSelector((state) => state.crypto);
  const { data: newsData, loading: newsLoading, error: newsError } = useAppSelector((state) => state.news);
  const { cities: favoriteCities, cryptos: favoriteCryptos } = useAppSelector((state) => state.favorites);
  const { notifications } = useAppSelector((state) => state.notifications);
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
      binancecoin: [], // Match CoinGecko ID
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
        const message = `Alert: ${coin.charAt(0).toUpperCase() + coin.slice(1)} price changed by ${priceChange.toFixed(2)}% in the last ${timeDiff.toFixed(1)} minutes.`;
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
    checkPriceChange('binancecoin');
  }, [prices, dispatch]);

  // Display notifications as toasts
  useEffect(() => {
    notifications.forEach((notification: Notification) => {
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
      const message = `Alert: Storm warning in ${randomCity.charAt(0).toUpperCase() + randomCity.slice(1)}!`;
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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ToastContainer aria-label="Notifications" role="alert" />
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 space-y-4 sm:space-y-0">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">Dashboard</h1>
          <button
            onClick={handleManualRefresh}
            className="btn px-3 sm:px-4 py-1 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm sm:text-base"
            aria-label="Refresh dashboard data"
          >
            Refresh Data
          </button>
        </div>

        {(favoriteCities.length > 0 || favoriteCryptos.length > 0) && (
          <section className="mb --

8 sm:mb-12" aria-labelledby="favorites-heading">
            <h2 id="favorites-heading" className="text-xl sm:text-2xl font-semibold text-gray-700 mb-4 sm:mb-6">
              Favorites
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              <div role="list" className="space-y-4 sm:space-y-6">
                {favoriteCities.map((city) => (
                  weatherData[city] && (
                    <div key={city} role="listitem">
                      <WeatherCard city={city} data={weatherData[city]} className="card" />
                    </div>
                  )
                ))}
              </div>
              <div role="list" className="space-y-4 sm:space-y-6">
                {favoriteCryptos.map((cryptoId) => {
                  const crypto = cryptoData.find((c) => c.id === cryptoId);
                  return (
                    crypto && (
                      <div key={cryptoId} role="listitem">
                        <CryptoCard data={crypto} className="card" />
                      </div>
                    )
                  );
                })}
              </div>
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <section aria-labelledby="weather-heading" className="p-4 sm:p-6 bg-gray-50 rounded-lg">
            <h2 id="weather-heading" className="text-xl sm:text-2xl font-semibold text-gray-700">
              Weather
            </h2>
            {weatherLoading && <p className="text-gray-500 text-sm sm:text-base">Loading weather...</p>}
            {weatherError && <p className="text-red-500 text-sm sm:text-base">Error: {weatherError}</p>}
            {!weatherLoading && !weatherError && Object.keys(weatherData).length === 0 && (
              <p className="text-gray-500 text-sm sm:text-base">No weather data available.</p>
            )}
            <div role="list" className="space-y-4 sm:space-y-6">
              {Object.keys(weatherData).map((city) => (
                <div key={city} role="listitem">
                  <WeatherCard city={city} data={weatherData[city]} className="card" />
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="crypto-heading" className="p-4 sm:p-6 bg-gray-50 rounded-lg">
            <h2 id="crypto-heading" className="text-xl sm:text-2xl font-semibold text-gray-700">
              Cryptocurrency
            </h2>
            {cryptoLoading && <p className="text-gray-500 text-sm sm:text-base">Loading crypto...</p>}
            {cryptoError && (
              <div>
                <p className="text-red-500 text-sm sm:text-base">Error: {cryptoError}</p>
                <button
                  onClick={handleRetryCrypto}
                  className="btn mt-2 px-3 sm:px-4 py-1 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm sm:text-base"
                  aria-label="Retry loading cryptocurrency data"
                >
                  Retry
                </button>
              </div>
            )}
            {!cryptoLoading && !cryptoError && cryptoData.length === 0 && (
              <p className="text-gray-500 text-sm sm:text-base">No crypto data available.</p>
            )}
            <div role="list" className="space-y-4 sm:space-y-6">
              {cryptoData.map((crypto) => (
                <div key={crypto.id} role="listitem">
                  <CryptoCard data={crypto} className="card" />
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="news-heading" className="p-4 sm:p-6 bg-gray-50 rounded-lg">
            <h2 id="news-heading" className="text-xl sm:text-2xl font-semibold text-gray-700">
              News
            </h2>
            {newsLoading && <p className="text-gray-500 text-sm sm:text-base">Loading news...</p>}
            {newsError && <p className="text-red-500 text-sm sm:text-base">Error: {newsError}</p>}
            {!newsLoading && !newsError && newsData.length === 0 && (
              <p className="text-gray-500 text-sm sm:text-base">No news available.</p>
            )}
            <div role="list" className="space-y-4 sm:space-y-6">
              {newsData.map((article, index) => (
                <div key={index} role="listitem">
                  <NewsItem article={article} className="card" />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}
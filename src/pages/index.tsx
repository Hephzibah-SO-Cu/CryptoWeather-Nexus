import { useEffect, useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchWeather } from '../redux/slices/weatherSlice';
import { fetchCrypto } from '../redux/slices/cryptoSlice';
import { fetchNews } from '../redux/slices/newsSlice';
import { setFavorites } from '../redux/slices/favoritesSlice';
import Layout from '../components/Layout/Layout';
import WeatherCard from '../components/Weather/WeatherCard';
import CryptoCard from '../components/Crypto/CryptoCard';
import NewsItem from '../components/News/NewsItem';

export default function Home() {
  const dispatch = useAppDispatch();
  const { data: weatherData, loading: weatherLoading, error: weatherError } = useAppSelector((state) => state.weather);
  const { data: cryptoData, loading: cryptoLoading, error: cryptoError } = useAppSelector((state) => state.crypto);
  const { data: newsData, loading: newsLoading, error: newsError } = useAppSelector((state) => state.news);
  const { cities: favoriteCities, cryptos: favoriteCryptos } = useAppSelector((state) => state.favorites);
  const [retryCrypto, setRetryCrypto] = useState(false);
  const [isClient, setIsClient] = useState(false);

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
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchWeather } from '../redux/slices/weatherSlice';
import { fetchCrypto } from '../redux/slices/cryptoSlice';
import { fetchNews } from '../redux/slices/newsSlice';
import Layout from '../components/Layout/Layout';
import WeatherCard from '../components/Weather/WeatherCard';
import CryptoCard from '../components/Crypto/CryptoCard';
import NewsItem from '../components/News/NewsItem';

export default function Home() {
  const dispatch = useAppDispatch();
  const { data: weatherData, loading: weatherLoading, error: weatherError } = useAppSelector((state) => state.weather);
  const { data: cryptoData, loading: cryptoLoading, error: cryptoError } = useAppSelector((state) => state.crypto);
  const { data: newsData, loading: newsLoading, error: newsError } = useAppSelector((state) => state.news);

  useEffect(() => {
    // Fetch weather data for New York, London, Tokyo
    ['new york', 'london', 'tokyo'].forEach((city) => {
      dispatch(fetchWeather(city));
    });

    // Fetch crypto data for Bitcoin, Ethereum, BNB
    dispatch(fetchCrypto(['bitcoin', 'ethereum', 'binancecoin']));

    // Fetch crypto news
    dispatch(fetchNews());
  }, [dispatch]);

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Weather Section */}
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

        {/* Cryptocurrency Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Cryptocurrency</h2>
          {cryptoLoading && <p className="text-gray-500">Loading crypto...</p>}
          {cryptoError && <p className="text-red-500">Error: {cryptoError}</p>}
          {!cryptoLoading && !cryptoError && cryptoData.length === 0 && (
            <p className="text-gray-500">No crypto data available.</p>
          )}
          {cryptoData.map((crypto) => (
            <CryptoCard key={crypto.id} data={crypto} />
          ))}
        </div>

        {/* News Section */}
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
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchWeather } from '../redux/slices/weatherSlice';
import { fetchCrypto } from '../redux/slices/cryptoSlice';
import { fetchNews } from '../redux/slices/newsSlice';
import Layout from '../components/Layout/Layout';

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
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white shadow rounded">
          <h2 className="text-xl font-semibold">Weather</h2>
          {weatherLoading && <p>Loading weather...</p>}
          {weatherError && <p>Error: {weatherError}</p>}
          {Object.keys(weatherData).map((city) => (
            <div key={city}>
              <h3>{city}</h3>
              <p>Temperature: {weatherData[city]?.main?.temp}°C</p>
              <p>Humidity: {weatherData[city]?.main?.humidity}%</p>
              <p>Conditions: {weatherData[city]?.weather[0]?.description}</p>
            </div>
          ))}
        </div>
        <div className="p-4 bg-white shadow rounded">
          <h2 className="text-xl font-semibold">Cryptocurrency</h2>
          {cryptoLoading && <p>Loading crypto...</p>}
          {cryptoError && <p>Error: {cryptoError}</p>}
          {cryptoData.map((crypto) => (
            <div key={crypto.id}>
              <h3>{crypto.name}</h3>
              <p>Price: ${crypto.current_price}</p>
              <p>24h Change: {crypto.price_change_percentage_24h.toFixed(2)}%</p>
              <p>Market Cap: ${crypto.market_cap}</p>
            </div>
          ))}
        </div>
        <div className="p-4 bg-white shadow rounded">
          <h2 className="text-xl font-semibold">News</h2>
          {newsLoading && <p>Loading news...</p>}
          {newsError && <p>Error: {newsError}</p>}
          {newsData.map((article, index) => (
            <div key={index} className="mb-2">
              <a href={article.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {article.title}
              </a>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
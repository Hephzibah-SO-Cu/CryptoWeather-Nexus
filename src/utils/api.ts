import axios from 'axios';

// Weather API (OpenWeatherMap)
export const fetchWeatherData = async (city: string) => {
  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const response = await axios.get(url);
  return response.data;
};

// Crypto API (CoinGecko)
export const fetchCryptoData = async (ids: string[]) => {
  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids.join(',')}&order=market_cap_desc&per_page=3&page=1&sparkline=false`;
  const response = await axios.get(url);
  return response.data;
};

// News API (NewsData.io)
export const fetchCryptoNews = async () => {
  const apiKey = process.env.NEXT_PUBLIC_NEWSDATA_API_KEY;
  const url = `https://newsdata.io/api/1/news?apikey=${apiKey}&q=cryptocurrency&language=en`;
  const response = await axios.get(url);
  return response.data.results.slice(0, 5); // Get top 5 headlines
};
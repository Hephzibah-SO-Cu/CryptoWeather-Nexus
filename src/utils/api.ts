import axios from 'axios';

// Weather API (OpenWeatherMap)
export const fetchWeatherData = async (city: string) => {
  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const response = await axios.get(url);
  return response.data;
};

export const fetchHistoricalWeatherData = async () => {
  const historicalData = [];
  const currentDate = new Date();
  for (let i = 0; i < 5; i++) {
    const date = new Date(currentDate);
    date.setDate(currentDate.getDate() - i);
    historicalData.push({
      date: date.toISOString().split('T')[0],
      temp: Math.random() * (25 - 15) + 15,
      description: ['clear sky', 'few clouds', 'rain', 'thunderstorm'][Math.floor(Math.random() * 4)],
    });
  }
  return historicalData;
};

// Crypto API (CoinGecko) - Use proxy
export const fetchCryptoData = async (ids: string[]) => {
  const url = `/api/coingecko/coins/markets?vs_currency=usd&ids=${ids.join(',')}&order=market_cap_desc&per_page=3&page=1&sparkline=false`;
  const response = await axios.get(url);
  return response.data;
};

export const fetchCryptoDetail = async (id: string) => {
  // Mock data for production
  const cryptoId = id;
  const capitalizedName = cryptoId.charAt(0).toUpperCase() + cryptoId.slice(1);
  const imageUrl = `https://example.com/${cryptoId}.png`;

  return {
    id: cryptoId,
    name: capitalizedName,
    image: { large: imageUrl },
    market_data: {
      current_price: { usd: Math.random() * 50000 + 1000 },
      price_change_percentage_24h: Math.random() * 10 - 5,
      market_cap: { usd: Math.random() * 1000000000000 },
      total_volume: { usd: Math.random() * 1000000000 },
      total_supply: Math.random() * 1000000,
      circulating_supply: Math.random() * 900000,
    },
  };
};

export const fetchCryptoHistoricalData = async (id: string) => {
  // Mock data for production
  const historicalData = [];
  const currentDate = new Date();
  for (let i = 0; i < 7; i++) {
    const date = new Date(currentDate);
    date.setDate(currentDate.getDate() - i);
    historicalData.push([date.getTime(), Math.random() * 50000 + 1000]);
  }
  return historicalData;
};

// News API (NewsData.io) - Use proxy
export const fetchCryptoNews = async () => {
  const url = `/api/newsdata`;
  const response = await axios.get(url);
  return response.data;
};
// Weather Data (OpenWeatherMap)
export interface WeatherData {
  main: {
    temp: number;
    humidity: number;
  };
  weather: Array<{
    description: string;
    icon: string;
  }>;
  name: string;
}

// Mock Historical Weather Data
export interface HistoricalWeatherData {
  date: string;
  temp: number;
  description: string;
}

// Crypto Data (CoinGecko)
export interface CryptoData {
  id: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  image: string;
}

// Crypto Detail Data (CoinGecko)
export interface CryptoDetail {
  id: string;
  name: string;
  image: { large: string };
  market_data: {
    current_price: { usd: number };
    price_change_percentage_24h: number;
    market_cap: { usd: number };
    total_volume: { usd: number };
    total_supply: number;
    circulating_supply: number;
  };
}

// Crypto Historical Price Data (CoinGecko)
export type HistoricalPriceData = Array<[number, number]>; // [timestamp, price]

// News Data (NewsData.io)
export interface NewsArticle {
  title: string;
  url: string;
  description: string;
  source: string;
  pubDate: string;
}
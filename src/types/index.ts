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
  
  // Crypto Data (CoinGecko)
  export interface CryptoData {
    id: string;
    name: string;
    current_price: number;
    price_change_percentage_24h: number;
    market_cap: number;
    image: string;
  }
  
  // News Data (NewsData.io)
  export interface NewsArticle {
    title: string;
    link: string;
    description: string;
    pubDate: string;
  }
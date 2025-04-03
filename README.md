# CryptoWeather Nexus

CryptoWeather Nexus is a multi-page dashboard that combines weather data, cryptocurrency information, and real-time notifications. Built with Next.js, React, Redux, Tailwind CSS, and WebSocket, this app provides a responsive and interactive user experience.

## Live URL
The app is deployed on Vercel: [https://cryptoweather-nexus-busayo.vercel.app/](https://cryptoweather-nexus-busayo.vercel.app/)

## Features
- **Dashboard**: Displays weather data for New York, London, and Tokyo; cryptocurrency data for Bitcoin, Ethereum, and BNB; and the top five crypto-related news headlines.
- **Detail Pages**:
  - **City Details** (`/city/[cityName]`): Shows current weather (with icon) and historical weather data (mocked) for each city.
  - **Crypto Details** (`/crypto/[cryptoId]`): Shows current metrics and historical price data (mocked) for each cryptocurrency.
- **Favorites**: Users can favorite cities and cryptos, which are persisted in localStorage and displayed in a dedicated "Favorites" section on the dashboard.
- **Real-Time Notifications**: Uses CoinCap WebSocket for live price updates and simulates weather alerts, displayed as toast notifications.
- **Responsive Design**: Built with Tailwind CSS, ensuring the app is fully responsive across mobile, tablet, and desktop devices.
- **Data Refresh**: Automatically refreshes weather and crypto data every 60 seconds.
- **Error Handling**: Displays fallback UI for API failures (e.g., "No data available" messages).

## Tech Stack
- **Framework**: Next.js 15.2.4 (file-based routing)
- **Frontend**: React (hooks)
- **State Management**: Redux with Redux Thunk
- **Styling**: Tailwind CSS
- **APIs**:
  - Weather: OpenWeatherMap
  - Crypto: CoinGecko (via proxy)
  - News: NewsData.io (via proxy)
  - WebSocket: CoinCap
- **Deployment**: Vercel

## Setup Instructions
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/<Hephzibah-SO-Cu>/cryptoweather-nexus.git
   cd cryptoweather-nexus

2. **Install Dependencies**:
    ```bash
    npm install

3. **Set Up Environment Variables**:

  Create a .env.local file in the root directory.
  Add the following API keys (replace with you own):
  - NEXT_PUBLIC_OPENWEATHERMAP_API_KEY=your_openweathermap_api_key
  - NEWSDATA_API_KEY=your_newsdata_api_key
  - NEXT_PUBLIC_COINGECKO_API_URL=https://api.coingecko.com/api/v3
  - NEXT_PUBLIC_WEBSOCKET_URL=wss://ws.coincap.io/prices?assets=bitcoin,ethereum,binance-coin

    Note: CoinGecko and NewsData.io APIs are accessed via proxy routes (/api/coingecko/[...path] and /api/newsdata), so their API keys are managed server-side (set in Vercel’s environment variables for production).

4. **Run the Development Server**:
    ```bash
    npm run dev

Open http://localhost:3000 in your browser.

5. **Build and Run in Production Mode**:
    ```bash
    npm run build
    npm start

## Usage Instructions
- **Dashboard:** View weather, crypto, and news data on the homepage.
- **Favorites:** Click the heart icon on a city or crypto card to add/remove it from favorites. Favorited items appear in the "Favorites" section.
- **Detail Pages:** Click on a city or crypto name to view detailed data (e.g., /city/new-york, /crypto/bitcoin).
- **Notifications:** Watch for toast notifications about significant price changes or weather alerts.
- **Refresh Data:** Click the "Refresh Data" button to manually refresh the dashboard, or wait for the automatic 60-second refresh.


## Design Decisions
- **Next.js and SSR:** Used Next.js with getServerSideProps for server-side rendering of detail pages, ensuring SEO-friendly deep links and fast initial loads.
- **Redux for State Management:** Chose Redux to manage global state (weather, crypto, news, favorites, notifications) for consistency and scalability.
- **Tailwind CSS:** Used for rapid styling with a utility-first approach, ensuring a responsive and consistent design system.
- **API Proxies:** Implemented API proxies (/api/coingecko/[...path], /api/newsdata) to securely manage API keys in production and avoid CORS issues.
- **Mock Data:** Mocked historical weather and crypto data in production (fetchCryptoDetail, fetchCryptoHistoricalData, fetchHistoricalWeatherData) due to API limitations.
- **WebSocket:** Used CoinCap WebSocket for real-time price updates, with simulated weather alerts for simplicity.


## Challenges Faced and Resolutions
- **Image Loading Issues:** Next.js Image component required external hostnames to be configured in next.config.js. Resolved by adding images.remotePatterns for openweathermap.org, assets.coingecko.com, and coin-images.coingecko.com.
- **Crypto Icons on Detail Pages:** Initially, all crypto detail pages showed the Bitcoin icon due to hardcoded mock data. Fixed by mapping crypto IDs to their respective icon URLs in fetchCryptoDetail.
- **Spacing Between Cards:** Misunderstood the spacing requirement initially; fixed by moving space-y classes to the correct container in index.tsx.
- **GitHub/Vercel Sync:** Vercel deployed an older commit (fd05442) instead of the latest one. Resolved by confirming the Production Branch was set to main and redeploying.
- **API Key Security:** Used environment variables and API proxies to securely manage API keys, avoiding exposure in the frontend.
- **API Limitations and Mocked Data:** Faced challenges with API rate limits and lack of historical data access (e.g., OpenWeatherMap’s free tier doesn’t provide historical weather data, and CoinGecko’s free tier has rate limits). Resolved by mocking historical data (fetchCryptoDetail, fetchCryptoHistoricalData, fetchHistoricalWeatherData) to ensure functionality while staying within API constraints.

## Project Structure
cryptoweather-nexus/
├── src/
│   ├── components/
│   │   ├── Crypto/CryptoCard.tsx
│   │   ├── Dashboard/
│   │   ├── Layout/Layout.tsx
│   │   ├── News/NewsItem.tsx
│   │   ├── Notifications/
│   │   ├── Weather/WeatherCard.tsx
│   ├── hooks/
│   │   ├── useWebSocket.ts
│   ├── pages/
│   │   ├── api/
│   │   │   ├── coingecko/[...path].ts
│   │   │   ├── hello.ts
│   │   │   ├── newsdata.ts
│   │   ├── city/
│   │   │   ├── [cityName].tsx
│   │   ├── crypto/
│   │   │   ├── [cryptoId].tsx
│   │   ├── index.tsx
│   │   ├── _app.tsx
│   │   ├── _document.tsx
│   ├── redux/
│   │   ├── slices/
│   │   │   ├── cryptoSlice.ts
│   │   │   ├── favoritesSlice.ts
│   │   │   ├── newsSlice.ts
│   │   │   ├── notificationSlice.ts
│   │   │   ├── weatherSlice.ts
│   │   ├── hooks.ts
│   │   ├── store.ts
│   ├── styles/
│   │   ├── globals.css
│   ├── types/
│   │   ├── index.ts
│   ├── utils/
│   │   ├── api.ts
├── public/
├── .env.local
├── next.config.js
├── package.json
├── README.md

## License
This project is licensed under the MIT License.

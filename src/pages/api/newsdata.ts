import type { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosError } from 'axios';
import { NewsArticle } from '../../types';

let cache: { data: NewsArticle[]; timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // Cache for 5 minutes

const mockNewsData: NewsArticle[] = [
  {
    title: "Bitcoin Surges to New Highs Amid Market Rally",
    description: "Bitcoin has reached a new all-time high as investors pour into the crypto market.",
    url: "https://example.com/news/bitcoin-surges",
    source: "CryptoNews",
    pubDate: "2025-04-02T10:00:00Z",
  },
  {
    title: "Ethereum Upgrade Boosts Transaction Speed",
    description: "The latest Ethereum upgrade has significantly improved transaction speeds.",
    url: "https://example.com/news/ethereum-upgrade",
    source: "TechBit",
    pubDate: "2025-04-02T09:30:00Z",
  },
  {
    title: "BNB Gains Traction in DeFi Space",
    description: "Binance Coin is seeing increased adoption in decentralized finance applications.",
    url: "https://example.com/news/bnb-defi",
    source: "FinanceDaily",
    pubDate: "2025-04-02T08:45:00Z",
  },
  {
    title: "Crypto Market Faces Regulatory Scrutiny",
    description: "Regulators are increasing oversight of the cryptocurrency market.",
    url: "https://example.com/news/crypto-regulation",
    source: "GlobalNews",
    pubDate: "2025-04-02T07:15:00Z",
  },
  {
    title: "New Crypto Wallet Enhances Security",
    description: "A new wallet promises to improve security for crypto investors.",
    url: "https://example.com/news/crypto-wallet",
    source: "SecurityTimes",
    pubDate: "2025-04-02T06:00:00Z",
  },
];

// Define the expected structure of a NewsData.io article
interface NewsDataArticle {
  title: string;
  description: string | null;
  link: string;
  source_id: string;
  pubDate: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const now = Date.now();
  if (cache && now - cache.timestamp < CACHE_DURATION) {
    return res.status(200).json(cache.data);
  }

  try {
    const apiKey = process.env.NEWSDATA_API_KEY;
    if (!apiKey) {
      throw new Error('NewsData.io API key is missing in environment variables');
    }
    const url = `https://newsdata.io/api/1/news?apikey=${apiKey}&q=cryptocurrency&language=en`;
    const response = await axios.get(url);
    const data = response.data.results || [];
    const filteredData = data.slice(0, 5).map((article: NewsDataArticle) => ({
      title: article.title,
      description: article.description || 'No description available.',
      url: article.link,
      source: article.source_id,
      pubDate: article.pubDate,
    }));

    cache = {
      data: filteredData,
      timestamp: now,
    };

    res.status(200).json(filteredData);
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error('Error fetching news from NewsData.io:', error.message, error.response?.status, error.response?.data);
    } else if (error instanceof Error) {
      console.error('Error fetching news from NewsData.io:', error.message);
    } else {
      console.error('Unexpected error fetching news from NewsData.io:', error);
    }
    cache = {
      data: mockNewsData,
      timestamp: now,
    };
    res.status(200).json(mockNewsData);
  }
}
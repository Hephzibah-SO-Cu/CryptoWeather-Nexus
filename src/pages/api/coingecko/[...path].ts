import type { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosError } from 'axios';

// Define a type for the cache entries
interface CacheEntry {
  data: unknown; // Use unknown since the API response can vary
  timestamp: number;
}

const cache: { [key: string]: CacheEntry } = {};
const CACHE_DURATION = 5 * 60 * 1000; // Cache for 5 minutes

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { path } = req.query;
  const pathString = Array.isArray(path) ? path.join('/') : path || '';
  const queryString = req.url?.split('?')[1] ? `?${req.url.split('?')[1]}` : '';
  const baseUrl = process.env.NEXT_PUBLIC_COINGECKO_API_URL || 'https://api.coingecko.com/api/v3';
  const url = `${baseUrl}/${pathString}${queryString}`;
  const cacheKey = `${pathString}${queryString}`;

  console.log(`Fetching from CoinGecko: ${url}`);

  const cachedResponse = cache[cacheKey];
  const now = Date.now();
  if (cachedResponse && now - cachedResponse.timestamp < CACHE_DURATION) {
    console.log(`Returning cached response for ${cacheKey}`);
    return res.status(200).json(cachedResponse.data);
  }

  try {
    const response = await axios.get(url);
    cache[cacheKey] = {
      data: response.data,
      timestamp: now,
    };
    console.log(`Successfully fetched data for ${cacheKey}`);
    res.status(200).json(response.data);
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error(`Error fetching from CoinGecko for ${cacheKey}:`, error.message, error.response?.status, error.response?.data);
      if (error.response?.status === 429) {
        if (cachedResponse) {
          console.log(`Rate limit hit, returning cached response for ${cacheKey}`);
          return res.status(200).json(cachedResponse.data);
        }
        res.status(429).json({ error: 'Rate limit exceeded for CoinGecko API. Please try again later.' });
      } else {
        res.status(500).json({ error: `Failed to fetch data from CoinGecko: ${error.message}` });
      }
    } else {
      console.error(`Unexpected error fetching from CoinGecko for ${cacheKey}:`, error);
      res.status(500).json({ error: 'An unexpected error occurred while fetching data from CoinGecko.' });
    }
  }
}
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

// Simple in-memory cache (for development)
let cachedNews: any = null;
let lastFetchTime: number = 0;
const CACHE_DURATION = 60 * 1000; // Cache for 60 seconds

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const now = Date.now();

  // Return cached data if it's still valid
  if (cachedNews && now - lastFetchTime < CACHE_DURATION) {
    return res.status(200).json(cachedNews);
  }

  try {
    const apiKey = process.env.NEXT_PUBLIC_NEWSDATA_API_KEY;
    const url = `https://newsdata.io/api/1/news?apikey=${apiKey}&q=cryptocurrency&language=en`;
    const response = await axios.get(url);

    // Cache the response
    cachedNews = response.data.results.slice(0, 5);
    lastFetchTime = now;

    res.status(200).json(cachedNews);
  } catch (error: any) {
    if (error.response?.status === 429) {
      // If rate limit is hit, return cached data if available
      if (cachedNews) {
        return res.status(200).json(cachedNews);
      }
      res.status(429).json({ error: 'Rate limit exceeded for news data. Please try again later.' });
    } else {
      res.status(500).json({ error: 'Failed to fetch news data' });
    }
  }
}
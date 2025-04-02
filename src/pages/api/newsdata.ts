import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

let cache: { data: any; timestamp: number } | null = null;
const CACHE_DURATION = 5* 60 * 1000; // Cache for 5 minutes

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
    const filteredData = data.slice(0, 5).map((article: any) => ({
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
  } catch (error: any) {
    console.error('Error fetching news from NewsData.io:', error.message, error.response?.status, error.response?.data);
    res.status(500).json({ error: `Failed to fetch news: ${error.message}` });
  }
}
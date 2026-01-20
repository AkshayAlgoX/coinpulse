'use server';

import qs from 'query-string';
import type { CoinGeckoErrorBody, QueryParams } from '@/types';

const BASE_URL = process.env.COINGECKO_BASE_URL;
const API_KEY = process.env.COINGECKO_API_KEY;

if (!BASE_URL) throw new Error('Could not get base url');
if (!API_KEY) throw new Error('Could not get api key');

export async function fetcher<T>(
  endpoint: string,
  params?: QueryParams,
  revalidate = 60,
): Promise<T> {
  const url = qs.stringifyUrl(
    {
      url: `${BASE_URL}/${endpoint}`,
      query: params,
    },
    { skipEmptyString: true, skipNull: true },
  );

  const response = await fetch(url, {
    headers: {
      'x-cg-demo-api-key': API_KEY,
      'Content-Type': 'application/json',
    } as Record<string, string>,
    next: { revalidate },
  });
  if (!response.ok) {
    const errorBody: CoinGeckoErrorBody = await response
      .json()
      .catch(() => ({}));

    throw new Error(
      `API Error: ${response.status}: ${errorBody.error || response.statusText} `,
    );
  }
  return response.json();
}

export async function searchCoins(query: string) {
  const trimmedQuery = query.trim();
  if (!trimmedQuery || trimmedQuery.length < 2) return [];

  try {
    // 1. Search for coins (Get IDs)
    // Using fetcher to handle base URL, API key and common error handling
    const searchData = await fetcher<any>('search', { query: trimmedQuery }, 0);

    // Validate response payload
    if (!searchData || !searchData.coins) {
      return [];
    }

    // Take top 8 results
    const topCoins = searchData.coins.slice(0, 8);
    const ids = topCoins.map((c: any) => c.id).join(',');

    if (!ids) return [];

    // 2. Get Price Data for these coins (so we can show green/red change)
    const marketData = await fetcher<any[]>(
      'coins/markets',
      {
        vs_currency: 'usd',
        ids,
        price_change_percentage: '24h',
      },
      0,
    );

    if (!Array.isArray(marketData)) {
      return [];
    }

    return marketData;
  } catch (error) {
    console.error('Search Error:', error);
    return [];
  }
}

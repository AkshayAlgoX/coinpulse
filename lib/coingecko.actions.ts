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
  if (!query || query.length < 2) return [];

  try {
    // 1. Search for coins (Get IDs)
    const searchUrl = `https://api.coingecko.com/api/v3/search?query=${query}`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();

    // Take top 8 results
    const topCoins = searchData.coins?.slice(0, 8) || [];
    const ids = topCoins.map((c: any) => c.id).join(',');

    if (!ids) return [];

    // 2. Get Price Data for these coins (so we can show green/red change)
    const marketUrl = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&price_change_percentage=24h`;
    const marketRes = await fetch(marketUrl);
    const marketData = await marketRes.json();

    return marketData;
  } catch (error) {
    console.error('Search Error:', error);
    return [];
  }
}

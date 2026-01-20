'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCoinGeckoWebSocket } from '@/hooks/useCoinGeckoWebSocket';
import CandlestickChart from '@/components/CandlestickChart';
import Converter from '@/components/Converter';
import DataTable from '@/components/DataTable';
import { formatCurrency } from '@/lib/utils';
import { ArrowUpRight, TrendingUp, TrendingDown } from 'lucide-react';
import type { CoinDetailsData, OHLCData } from '@/types';

// --- MOCK DATA FOR VISUAL COMPLETENESS (Matches Reference Image) ---
const MOCK_ORDER_BOOK = {
  bids: [
    { price: 91150.2, amount: 0.45, total: 41017 },
    { price: 91145.5, amount: 1.2, total: 109374 },
    { price: 91140.0, amount: 0.15, total: 13671 },
    { price: 91135.8, amount: 0.8, total: 72908 },
    { price: 91130.1, amount: 2.1, total: 191373 },
  ],
  asks: [
    { price: 91160.0, amount: 0.33, total: 30082 },
    { price: 91165.5, amount: 0.9, total: 82049 },
    { price: 91170.2, amount: 0.12, total: 10940 },
    { price: 91175.0, amount: 1.5, total: 136762 },
    { price: 91180.9, amount: 0.5, total: 45590 },
  ],
};

const MOCK_SIMILAR_COINS = [
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    price: 91230,
    change: 2.4,
    image: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    price: 3200,
    change: -1.2,
    image: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
  },
  {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    price: 140,
    change: 5.4,
    image: 'https://assets.coingecko.com/coins/images/4128/small/solana.png',
  },
];

const LiveDataWrapper = ({ coinId, poolId, coin, coinOHLCData }: any) => {
  const [liveInterval, setLiveInterval] = useState<'1s' | '1m'>('1s');
  const [isMounted, setIsMounted] = useState(false);
  const { trades, ohlcv, price } = useCoinGeckoWebSocket({
    coinId,
    poolId,
    liveInterval,
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // SAFEGUARDS: Ensure we always have valid data to render
  const currentPrice = price?.usd ?? coin.market_data?.current_price?.usd ?? 0;
  const priceChange =
    price?.usd_24h_change ?? coin.market_data?.price_change_percentage_24h ?? 0;
  const isPositive = priceChange >= 0;
  const marketCap = coin.market_data?.market_cap?.usd ?? 0;

  // Render a loading state until client-side hydration is complete
  if (!isMounted) return <div className="min-h-screen bg-[#0B0E11]" />;

  const tradeColumns = [
    {
      header: 'Price',
      cell: (t: any) => (
        <span className={t.type === 'buy' ? 'text-green-400' : 'text-red-400'}>
          {formatCurrency(t.price)}
        </span>
      ),
    },
    {
      header: 'Amount',
      cell: (t: any) => (
        <span className="text-gray-400">{t.amount.toFixed(4)}</span>
      ),
    },
    {
      header: 'Time',
      cell: (t: any) => (
        <span className="text-xs text-gray-500">
          {new Date(t.time).toLocaleTimeString()}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-10">
      {/* HEADER SECTION */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div className="flex items-center gap-4">
          <Image
            src={coin.image.large}
            alt={coin.name}
            width={64}
            height={64}
            className="rounded-full"
            unoptimized
          />
          <div>
            <h1 className="flex items-center gap-3 text-3xl font-bold text-white">
              {coin.name}
              <span className="rounded border border-gray-700 bg-gray-800 px-2 py-1 font-mono text-xs text-gray-400 uppercase">
                {coin.symbol}
              </span>
            </h1>
            <div className="mt-1 flex items-center gap-3">
              {/* CRITICAL FIX: suppressHydrationWarning added below */}
              <span
                className="text-4xl font-bold text-white"
                suppressHydrationWarning
              >
                {formatCurrency(currentPrice)}
              </span>
              <span
                className={`flex items-center gap-1 rounded px-2 py-0.5 text-lg font-medium ${isPositive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}
                suppressHydrationWarning
              >
                {isPositive ? (
                  <TrendingUp size={16} />
                ) : (
                  <TrendingDown size={16} />
                )}
                {priceChange.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-8 text-sm">
          <div>
            <p className="mb-1 text-gray-500">Market Cap Rank</p>
            <p className="font-bold text-gray-200">#{coin.market_cap_rank}</p>
          </div>
          <div>
            <p className="mb-1 text-gray-500">Market Cap</p>
            <p className="font-bold text-gray-200" suppressHydrationWarning>
              {formatCurrency(marketCap)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* LEFT COLUMN */}
        <div className="space-y-6 lg:col-span-2">
          <div className="relative overflow-hidden rounded-2xl border border-gray-800 bg-[#15191E] p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-200">
                Trend Overview
              </h3>
            </div>
            <div className="h-[400px] w-full">
              <CandlestickChart
                coinId={coinId}
                data={coinOHLCData}
                liveOhlcv={ohlcv}
                mode="live"
                liveInterval={liveInterval}
                setLiveInterval={setLiveInterval}
                height={400}
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6 lg:col-span-1">
          {/* CONVERTER */}
          <Converter
            symbol={coin.symbol}
            icon={coin.image.small}
            priceList={coin.market_data.current_price}
          />

          {/* RECENT TRADES */}
          <div className="rounded-2xl border border-gray-800 bg-[#15191E] p-6">
            <h3 className="mb-4 font-bold text-gray-200">Recent Trades</h3>
            <DataTable
              columns={tradeColumns}
              data={trades}
              rowKey={(t) => t.time + Math.random()}
              tableClassName="text-sm"
            />
            {trades.length === 0 && (
              <p className="animate-pulse py-6 text-center text-xs text-gray-500">
                Waiting for live trades...
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveDataWrapper;

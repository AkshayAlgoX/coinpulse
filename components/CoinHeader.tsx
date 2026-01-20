'use client';

import React from 'react';
import Image from 'next/image';
import { formatCurrency, formatPercentage } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface CoinHeaderProps {
  name: string;
  image: string;
  livePrice: number;
  livePriceChangePercentage24h: number;
  priceChangePercentage30d: number;
  priceChange24h: number;
}

const CoinHeader = ({
  name,
  image,
  livePrice,
  livePriceChangePercentage24h,
  priceChangePercentage30d,
  priceChange24h,
}: CoinHeaderProps) => {
  const isPositive24h = livePriceChangePercentage24h > 0;
  const isPositive30d = priceChangePercentage30d > 0;

  return (
    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16">
          <Image
            src={image}
            alt={name}
            fill
            className="rounded-full object-contain"
            unoptimized
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold">{name}</h1>
          <div className="mt-1 flex items-center gap-3">
            <span className="text-4xl font-bold">
              {formatCurrency(livePrice)}
            </span>
            <div
              className={`flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-bold ${
                isPositive24h
                  ? 'bg-green-500/20 text-green-500'
                  : 'bg-red-500/20 text-red-500'
              }`}
            >
              {isPositive24h ? (
                <TrendingUp size={16} />
              ) : (
                <TrendingDown size={16} />
              )}
              {formatPercentage(livePriceChangePercentage24h)}
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        <div>
          <p className="mb-1 text-sm text-gray-400">24h Change</p>
          <p
            className={`text-lg font-bold ${isPositive24h ? 'text-green-500' : 'text-red-500'}`}
          >
            {isPositive24h ? '+' : ''}
            {formatCurrency(priceChange24h)}
          </p>
        </div>
        <div>
          <p className="mb-1 text-sm text-gray-400">30d Change</p>
          <p
            className={`text-lg font-bold ${isPositive30d ? 'text-green-500' : 'text-red-500'}`}
          >
            {formatPercentage(priceChangePercentage30d)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CoinHeader;

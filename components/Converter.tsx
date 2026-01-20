'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowRightLeft } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ConverterProps {
  symbol: string;
  icon: string;
  priceList: Record<string, number>;
}

const Converter = ({ symbol, icon, priceList }: ConverterProps) => {
  const [amount, setAmount] = useState('1');
  const [currency, setCurrency] = useState('usd');
  const [isInverted, setIsInverted] = useState(false); // false = Coin to USD, true = USD to Coin

  const rates: Record<string, number> = {
    usd: priceList?.usd || 0,
    eur: (priceList?.usd || 0) * 0.92,
    gbp: (priceList?.usd || 0) * 0.79,
    jpy: (priceList?.usd || 0) * 150,
    inr: (priceList?.usd || 0) * 83,
  };

  const rate = rates[currency] || 0;
  const numAmount = parseFloat(amount) || 0;

  // Logic: If inverted, we divide (USD / Rate). If normal, we multiply (Coin * Rate).
  const result = isInverted
    ? rate > 0
      ? numAmount / rate
      : 0
    : numAmount * rate;

  const displayResult =
    result === 0 ? '' : isInverted ? result.toFixed(6) : result.toFixed(2);

  return (
    <div className="rounded-2xl border border-gray-800 bg-[#15191E] p-6 shadow-xl">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-bold tracking-wider text-gray-200 uppercase">
          {symbol} CONVERTER
        </h3>
      </div>

      <div className="space-y-3">
        {/* TOP INPUT */}
        <div className="group flex items-center justify-between rounded-xl border border-gray-800 bg-[#0B0E11] p-4 transition-colors focus-within:border-blue-500/50">
          <input
            type="number"
            value={isInverted ? displayResult : amount}
            onChange={(e) => !isInverted && setAmount(e.target.value)}
            readOnly={isInverted}
            className="w-full bg-transparent text-2xl font-bold text-white outline-none placeholder:text-gray-700"
            placeholder="0"
          />
          <div className="flex shrink-0 items-center gap-2 rounded-lg border border-gray-700 bg-gray-800 py-1.5 pr-4 pl-2">
            {isInverted ? (
              // If inverted, top shows Currency Selector
              <CurrencySelect currency={currency} setCurrency={setCurrency} />
            ) : (
              // If normal, top shows Coin Label
              <>
                <Image
                  src={icon}
                  alt={symbol}
                  width={20}
                  height={20}
                  className="rounded-full"
                  unoptimized
                />
                <span className="text-sm font-bold text-white uppercase">
                  {symbol}
                </span>
              </>
            )}
          </div>
        </div>

        {/* SWAP BUTTON */}
        <div className="relative z-10 -my-6 flex justify-center">
          <button
            onClick={() => setIsInverted(!isInverted)}
            className="rounded-full border-4 border-[#15191E] bg-blue-600 p-3 text-white shadow-lg transition-all hover:scale-110 hover:bg-blue-500 active:scale-95"
          >
            <ArrowRightLeft size={18} />
          </button>
        </div>

        {/* BOTTOM INPUT */}
        <div className="group flex items-center justify-between rounded-xl border border-gray-800 bg-[#0B0E11] p-4 transition-colors focus-within:border-blue-500/50">
          <input
            type="number"
            value={isInverted ? amount : displayResult}
            onChange={(e) => isInverted && setAmount(e.target.value)}
            readOnly={!isInverted}
            className="w-full bg-transparent text-2xl font-bold text-white outline-none placeholder:text-gray-700"
            placeholder="0"
          />
          <div className="flex shrink-0 items-center gap-2 rounded-lg border border-gray-700 bg-gray-800 py-1.5 pr-4 pl-2">
            {isInverted ? (
              // If inverted, bottom shows Coin Label
              <>
                <Image
                  src={icon}
                  alt={symbol}
                  width={20}
                  height={20}
                  className="rounded-full"
                  unoptimized
                />
                <span className="text-sm font-bold text-white uppercase">
                  {symbol}
                </span>
              </>
            ) : (
              // If normal, bottom shows Currency Selector
              <CurrencySelect currency={currency} setCurrency={setCurrency} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Component for the Dropdown
const CurrencySelect = ({ currency, setCurrency }: any) => (
  <Select value={currency} onValueChange={setCurrency}>
    <SelectTrigger className="h-auto gap-2 border-none bg-transparent p-0 text-white shadow-none focus:ring-0">
      <SelectValue />
    </SelectTrigger>
    <SelectContent className="border-gray-800 bg-gray-900 text-white">
      {['usd', 'eur', 'gbp', 'jpy', 'inr'].map((c) => (
        <SelectItem
          key={c}
          value={c}
          className="cursor-pointer font-bold uppercase hover:bg-gray-800"
        >
          {c.toUpperCase()}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

export default Converter;

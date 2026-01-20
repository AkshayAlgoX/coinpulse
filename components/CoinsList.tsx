'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn, formatPercentage, formatCurrency } from '@/lib/utils';
import DataTable from '@/components/DataTable';
import CoinsPagination from '@/components/CoinsPagination';
import type { CoinMarketData, DataTableColumn } from '@/types';

interface CoinsListProps {
  coinsData: CoinMarketData[];
  currentPage: number;
  estimatedTotalPages: number;
  hasMorePages: boolean;
}

const CoinsList = ({
  coinsData,
  currentPage,
  estimatedTotalPages,
  hasMorePages,
}: CoinsListProps) => {
  const router = useRouter();

  const columns: DataTableColumn<CoinMarketData>[] = [
    {
      header: 'Rank',
      cellClassName: 'rank-cell',
      cell: (coin) => (
        <span className="font-mono text-gray-400">
          #{coin.market_cap_rank ?? '-'}
        </span>
      ),
    },
    {
      header: 'Token',
      cellClassName: 'token-cell',
      cell: (coin) => {
        const isValidImage =
          coin.image &&
          coin.image.startsWith('http') &&
          coin.image !== 'missing_large.png';
        return (
          <div className="token-info">
            {isValidImage ? (
              <Image
                src={coin.image}
                alt={coin.name}
                width={36}
                height={36}
                unoptimized
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-300 text-[10px] font-bold text-gray-600">
                {coin.symbol[0].toUpperCase()}
              </div>
            )}
            <p>
              {coin.name} ({coin.symbol.toUpperCase()})
            </p>
          </div>
        );
      },
    },
    {
      header: 'Price',
      cellClassName: 'price-cell',
      cell: (coin) => formatCurrency(coin.current_price),
    },
    {
      header: '24h Change',
      cellClassName: 'change-cell',
      cell: (coin) => {
        const isTrendingUp = coin.price_change_percentage_24h > 0;
        return (
          <span
            className={cn('change-value', {
              'text-green-600': isTrendingUp,
              'text-red-500': !isTrendingUp,
            })}
          >
            {isTrendingUp && '+'}
            {formatPercentage(coin.price_change_percentage_24h)}
          </span>
        );
      },
    },
    {
      header: 'Market Cap',
      cellClassName: 'market-cap-cell',
      cell: (coin) => formatCurrency(coin.market_cap),
    },
  ];

  return (
    <div className="content">
      <h4>All Coins</h4>

      <DataTable
        tableClassName="coins-table"
        columns={columns}
        data={coinsData}
        rowKey={(coin: CoinMarketData) => coin.id}
        onRowClick={(coin) => router.push(`/coins/${coin.id}`)}
      />

      <CoinsPagination
        currentPage={currentPage}
        totalPages={estimatedTotalPages}
        hasMorePages={hasMorePages}
      />
    </div>
  );
};

export default CoinsList;

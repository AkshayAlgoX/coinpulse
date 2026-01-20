'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { cn, formatCurrency, formatPercentage } from '@/lib/utils';
import { TrendingDown, TrendingUp } from 'lucide-react';
import DataTable from '@/components/DataTable';
import type { TrendingCoin, DataTableColumn } from '@/types';

interface TrendingCoinsListProps {
  coins: TrendingCoin[];
}

const TrendingCoinsList = ({ coins }: TrendingCoinsListProps) => {
  const router = useRouter();

  const columns: DataTableColumn<TrendingCoin>[] = [
    {
      header: 'Name',
      cellClassName: 'name-cell',
      cell: (coin) => {
        const item = coin.item;
        return (
          <div className="flex items-center gap-3">
            <Image
              src={item.large}
              alt={item.name}
              width={36}
              height={36}
              unoptimized
            />
            <p className="font-medium text-white">{item.name}</p>
          </div>
        );
      },
    },
    {
      header: 'Price',
      cellClassName: 'price-cell',
      cell: (coin) => formatCurrency(coin.item.data.price),
    },
    {
      header: '24h Change',
      cellClassName: 'change-cell',
      cell: (coin) => {
        const item = coin.item;
        const change = item.data.price_change_percentage_24h.usd;
        const isTrendingUp = change > 0;

        return (
          <div
            className={cn(
              'price-change',
              isTrendingUp ? 'text-green-500' : 'text-red-500',
            )}
          >
            <p className="flex items-center gap-1">
              {formatPercentage(item.data.price_change_percentage_24h.usd)}
              {isTrendingUp ? (
                <TrendingUp width={16} height={16} />
              ) : (
                <TrendingDown width={16} height={16} />
              )}
            </p>
          </div>
        );
      },
    },
  ];

  return (
    <DataTable
      data={coins}
      columns={columns}
      rowKey={(coin) => coin.item.id}
      tableClassName="trending-coins-table"
      headerCellClassName="py-3!"
      bodyCellClassName="py-2!"
      onRowClick={(coin) => router.push(`/coins/${coin.item.id}`)}
    />
  );
};

export default TrendingCoinsList;

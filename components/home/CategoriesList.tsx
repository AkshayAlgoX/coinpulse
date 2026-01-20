'use client';

import Image from 'next/image';
import { cn, formatCurrency, formatPercentage } from '@/lib/utils';
import { TrendingDown, TrendingUp } from 'lucide-react';
import DataTable from '@/components/DataTable';
import type { Category, DataTableColumn } from '@/types';

interface CategoriesListProps {
  categories: Category[];
}

const CategoriesList = ({ categories }: CategoriesListProps) => {
  const columns: DataTableColumn<Category>[] = [
    {
      header: 'Category',
      cellClassName: 'category-cell',
      cell: (category) => category.name,
    },
    {
      header: 'Top Gainers',
      cellClassName: 'top-gainers-cell',
      cell: (category) =>
        category.top_3_coins.map((coin) => (
          <Image
            src={coin}
            alt={coin}
            key={coin}
            width={28}
            height={28}
            unoptimized
          />
        )),
    },
    {
      header: '24h Change',
      cellClassName: 'change-header-cell',
      cell: (category) => {
        const isTrendingUp = category.market_cap_change_24h > 0;

        return (
          <div
            className={cn(
              'change-cell',
              isTrendingUp ? 'text-green-500' : 'text-red-500',
            )}
          >
            <p className="flex items-center gap-1">
              {formatPercentage(category.market_cap_change_24h)}
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
    {
      header: 'Market Cap',
      cellClassName: 'market-cap-cell',
      cell: (category) => formatCurrency(category.market_cap),
    },
    {
      header: '24h Volume',
      cellClassName: 'volume-cell',
      cell: (category) => formatCurrency(category.volume_24h),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={categories}
      rowKey={(_, index) => index}
      tableClassName="mt-3"
    />
  );
};

export default CategoriesList;

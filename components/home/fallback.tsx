'use client';

import React from 'react';
import DataTable from '@/components/DataTable';
import type { DataTableColumn } from '@/types';

export const CoinOverviewFallback = () => {
  return (
    <div id="coin-overview-fallback">
      <div className="header pt-2">
        <div className="header-image bg-dark-400 animate-pulse" />
        <div className="info">
          <div className="header-line-sm bg-dark-400 animate-pulse rounded-md" />
          <div className="header-line-lg bg-dark-400 animate-pulse rounded-md" />
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="period-button-skeleton bg-dark-400 animate-pulse"
          />
        ))}
      </div>
      <div className="chart mt-4">
        <div className="chart-skeleton bg-dark-400 animate-pulse" />
      </div>
    </div>
  );
};

export const TrendingCoinsFallback = () => {
  const columns: DataTableColumn<{ id: number }>[] = [
    {
      header: 'Name',
      cell: () => (
        <div className="name-link">
          <div className="name-image bg-dark-400 animate-pulse" />
          <div className="name-line bg-dark-400 animate-pulse rounded-md" />
        </div>
      ),
    },
    {
      header: 'Price',
      cell: () => (
        <div className="price-cell">
          <div className="price-line bg-dark-400 animate-pulse rounded-md" />
        </div>
      ),
    },
    {
      header: '24h Change',
      cell: () => (
        <div className="change-cell">
          <div className="price-change">
            <div className="change-icon bg-dark-400 animate-pulse" />
            <div className="change-line bg-dark-400 animate-pulse rounded-md" />
          </div>
        </div>
      ),
    },
  ];

  const data = [...Array(6)].map((_, i) => ({ id: i }));

  return (
    <div id="trending-coins-fallback">
      <h4>Trending Coins</h4>
      <DataTable
        data={data}
        columns={columns}
        rowKey={(item) => item.id}
        tableClassName="trending-coins-table"
        headerCellClassName="py-3!"
        bodyCellClassName="py-2!"
      />
    </div>
  );
};

export const CategoriesFallback = () => {
  const columns: DataTableColumn<{ id: number }>[] = [
    {
      header: 'Category',
      cellClassName: 'category-cell',
      cell: () => (
        <div className="category-skeleton bg-dark-400 animate-pulse rounded-md" />
      ),
    },
    {
      header: 'Top Gainers',
      cellClassName: 'top-gainers-cell',
      cell: () => (
        <div className="flex gap-1">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="coin-skeleton bg-dark-400 animate-pulse rounded-full"
            />
          ))}
        </div>
      ),
    },
    {
      header: '24h Change',
      cellClassName: 'change-header-cell',
      cell: () => (
        <div className="change-cell">
          <div className="change-icon bg-dark-400 animate-pulse" />
          <div className="value-skeleton-sm bg-dark-400 animate-pulse rounded-md" />
        </div>
      ),
    },
    {
      header: 'Market Cap',
      cellClassName: 'market-cap-cell',
      cell: () => (
        <div className="value-skeleton-lg bg-dark-400 animate-pulse rounded-md" />
      ),
    },
    {
      header: '24h Volume',
      cellClassName: 'volume-cell',
      cell: () => (
        <div className="value-skeleton-md bg-dark-400 animate-pulse rounded-md" />
      ),
    },
  ];

  const data = [...Array(10)].map((_, i) => ({ id: i }));

  return (
    <div id="categories-fallback">
      <h4>Top Categories</h4>
      <DataTable
        data={data}
        columns={columns}
        rowKey={(item) => item.id}
        tableClassName="mt-3"
      />
    </div>
  );
};

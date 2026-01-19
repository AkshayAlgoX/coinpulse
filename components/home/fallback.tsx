import React from 'react';
import DataTable from '@/components/DataTable';

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

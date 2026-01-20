import { fetcher } from '@/lib/coingecko.actions';
import Image from 'next/image';
import Link from 'next/link';
import { cn, formatPercentage, formatCurrency } from '@/lib/utils';
import DataTable from '@/components/DataTable';
import CoinsPagination from '@/components/CoinsPagination';

interface CoinsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const Coins = async (props: CoinsPageProps) => {
  const searchParams = await props.searchParams;

  const currentPage = Number(searchParams?.page) || 1;
  const perPage = Number(searchParams?.per_page) || 100;

  const coinsData = await fetcher<CoinMarketData[]>('/coins/markets', {
    vs_currency: 'usd',
    order: 'market_cap_desc',
    per_page: perPage,
    page: currentPage,
    sparkline: 'false',
    price_change_percentage: '24h',
  });

  // FIX: Gracefully handle the limit of the Free API
  if (!coinsData || coinsData.length === 0) {
    return (
      <main
        id="coins-page"
        className="flex min-h-[50vh] flex-col items-center justify-center gap-4"
      >
        <h2 className="text-2xl font-bold text-gray-800">No coins found</h2>
        <p className="text-gray-500">
          The CoinGecko Free API limits how far you can scroll.
        </p>
        <Link
          href="/coins?page=1"
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Go back to Page 1
        </Link>
      </main>
    );
  }

  const columns: DataTableColumn<CoinMarketData>[] = [
    {
      header: 'Rank',
      cellClassName: 'rank-cell',
      cell: (coin) => (
        <>
          #{coin.market_cap_rank}
          <Link href={`/coins/${coin.id}`} aria-label="View coin" />
        </>
      ),
    },
    {
      header: 'Token',
      cellClassName: 'token-cell',
      cell: (coin) => {
        // Safe image check
        const isValidImage =
          coin.image &&
          coin.image.startsWith('http') &&
          coin.image !== 'missing_large.png';
        return (
          <div className="token-info">
            {isValidImage ? (
              // FIX: 'unoptimized' is REQUIRED for the Free Plan to avoid 403 errors
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

  const hasMorePages = coinsData.length === perPage;
  const estimatedTotalPages = hasMorePages
    ? currentPage >= 100
      ? Math.ceil(currentPage / 100) * 100 + 100
      : 100
    : currentPage;

  return (
    <main id="coins-page">
      <div className="content">
        <h4>All Coins</h4>

        <DataTable
          tableClassName="coins-table"
          columns={columns}
          data={coinsData}
          rowKey={(coin) => coin.id}
        />

        <CoinsPagination
          currentPage={currentPage}
          totalPages={estimatedTotalPages}
          hasMorePages={hasMorePages}
        />
      </div>
    </main>
  );
};

export default Coins;

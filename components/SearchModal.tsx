'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import useSWR from 'swr';
import { useDebounce, useKey } from 'react-use';
import { Search, Loader2 } from 'lucide-react';
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
  CommandEmpty,
} from '@/components/ui/command';
import { searchCoins } from '@/lib/coingecko.actions';
import { Button } from '@/components/ui/button';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'; // Optional, or just hide via CSS
import { DialogTitle } from '@radix-ui/react-dialog'; // We need this for the fix

export const SearchModal = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useDebounce(() => setDebouncedQuery(query), 500, [query]);

  const { data: searchResults, isValidating } = useSWR(
    debouncedQuery.length > 1 ? ['search', debouncedQuery] : null,
    ([, q]) => searchCoins(q),
    { keepPreviousData: true },
  );

  useKey(
    (e) => e.key === 'k' && (e.metaKey || e.ctrlKey),
    (e) => {
      e.preventDefault();
      setOpen((prev) => !prev);
    },
  );

  const handleSelect = (coinId: string) => {
    setOpen(false);
    setQuery('');
    router.push(`/coins/${coinId}`);
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="relative h-10 w-full justify-start rounded-lg border-gray-800 bg-[#15191E] text-sm text-gray-400 hover:bg-[#1E2329] hover:text-white md:w-64"
      >
        <Search className="mr-2 h-4 w-4" />
        <span className="inline-flex">Search...</span>
        <kbd className="pointer-events-none absolute top-2 right-2 hidden h-6 items-center gap-1 rounded border border-gray-700 bg-gray-800 px-1.5 font-mono text-[10px] text-gray-400 opacity-100 select-none sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        {/* CRITICAL FIX: Add a Title for Accessibility (Hidden visually) */}
        <DialogTitle className="sr-only">Search Coins</DialogTitle>

        <div className="border-none bg-[#15191E]">
          <CommandInput
            placeholder="Search token name (e.g., bitcoin)..."
            value={query}
            onValueChange={setQuery}
            className="border-b border-gray-800 text-white placeholder:text-gray-500"
          />
          <CommandList className="custom-scrollbar max-h-[350px] p-2">
            {isValidating && (
              <div className="flex justify-center gap-2 py-6 text-gray-500">
                <Loader2 className="animate-spin" /> Searching...
              </div>
            )}

            {!isValidating && query && searchResults?.length === 0 && (
              <CommandEmpty className="py-6 text-center text-gray-500">
                No coins found.
              </CommandEmpty>
            )}

            {searchResults && searchResults.length > 0 && (
              <CommandGroup heading="Results" className="text-gray-400">
                {searchResults.map((coin: any) => (
                  <CommandItem
                    key={coin.id}
                    value={`${coin.name}-${coin.symbol}`} // Ensure unique value for search
                    onSelect={() => handleSelect(coin.id)}
                    className="my-1 flex cursor-pointer items-center justify-between rounded-lg p-3 hover:bg-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <Image
                        src={coin.image}
                        alt={coin.name}
                        width={28}
                        height={28}
                        className="rounded-full"
                        unoptimized
                      />
                      <div>
                        <p className="text-sm font-bold text-white">
                          {coin.name}
                        </p>
                        <p className="text-xs text-gray-500 uppercase">
                          {coin.symbol}
                        </p>
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </div>
      </CommandDialog>
    </>
  );
};

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { SearchModal } from '@/components/SearchModal';
import { cn } from '@/lib/utils';

export default function Header() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/coins', label: 'All Coins' },
  ];

  return (
    <header className="site-header bg-dark-900 sticky top-0 z-50 h-20 w-full sm:h-24">
      <div className="mx-auto flex h-full max-w-[1600px] items-center justify-between overflow-visible px-6 md:px-10">
        {/* LEFT: LOGO (BIG + PERFECTLY CENTERED) */}
        <Link href="/" className="relative flex items-center">
          <div className="relative h-28 w-28 sm:h-32 sm:w-32">
            <div className="absolute top-1/2 left-0 -translate-y-1/2">
              <div className="relative h-28 w-28 sm:h-32 sm:w-32">
                <Image
                  src="/logo.svg"
                  alt="CoinPulse Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </Link>

        {/* RIGHT: Nav + Search (UNCHANGED) */}
        <div className="flex items-center gap-6 md:gap-10">
          <nav className="hidden items-center gap-6 md:flex md:gap-10">
            {navLinks.map(({ href, label }) => {
              const isActive =
                pathname === href ||
                (href === '/coins' && pathname.startsWith('/coins'));

              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'relative text-sm font-medium transition-colors hover:text-white',
                    isActive ? 'text-white' : 'text-purple-100',
                  )}
                >
                  {label}
                  {isActive && (
                    <span className="absolute -bottom-2 left-0 h-0.5 w-full rounded-full bg-green-500" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="hidden w-[200px] sm:block">
            <SearchModal />
          </div>
        </div>
      </div>
    </header>
  );
}

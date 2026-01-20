'use client';
import { buildPageNumbers, cn, ELLIPSIS } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import React from 'react';
import type { Pagination as PaginationType } from '@/types';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
const CoinsPagination = ({
  currentPage,
  totalPages,
  hasMorePages,
}: PaginationType) => {
  const router = useRouter();

  const handlePageChange = (
    e: React.MouseEvent<HTMLAnchorElement>,
    page: number,
    disabled?: boolean,
  ) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    // We don't preventDefault here because we want the href to work normally if possible,
    // but the onClick is there for programmatic navigation or extra logic if needed.
    // Actually, usually in Next.js we might want to let the Link handle it or use router.push.
    // The issue asks to ensure href exists for accessibility.
    e.preventDefault();
    router.push(`/coins?page=${page}`);
  };

  const pageNumbers = buildPageNumbers(currentPage, totalPages);
  const isLastPage = !hasMorePages || currentPage === totalPages;
  return (
    <Pagination id="coins-pagination">
      <PaginationContent className="pagination-content">
        <PaginationItem className="pagination-control prev">
          <PaginationPrevious
            href={currentPage > 1 ? `/coins?page=${currentPage - 1}` : '#'}
            onClick={(e) =>
              handlePageChange(e, currentPage - 1, currentPage === 1)
            }
            className={
              currentPage === 1 ? 'control-disabled' : 'control-button'
            }
          />
        </PaginationItem>

        {pageNumbers.map((page, index) => (
          <PaginationItem key={index}>
            {page === ELLIPSIS ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                href={`/coins?page=${page}`}
                onClick={(e) => handlePageChange(e, page as number)}
                isActive={currentPage === page}
                className={cn('page-link', {
                  'page-link-active': currentPage === page,
                })}
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem className="pagination-control next">
          <PaginationNext
            href={!isLastPage ? `/coins?page=${currentPage + 1}` : '#'}
            onClick={(e) => handlePageChange(e, currentPage + 1, isLastPage)}
            className={isLastPage ? 'control-disabled' : 'control-button'}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
export default CoinsPagination;

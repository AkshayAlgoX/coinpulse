import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { cn } from '@/lib/utils';

// Make sure your DataTableProps interface is defined above this or imported
// interface DataTableProps<T> { ... }

const DataTable = <T,>({
  columns,
  data,
  rowKey,
  tableClassName,
  headerRowClassName,
  headerCellClassName,
  bodyRowClassName,
  headerClassName,
}: DataTableProps<T>) => {
  return (
    <Table className={cn('custom-scroller', tableClassName)}>
      <TableHeader className={headerClassName}>
        <TableRow className={cn('hover:bg-transparent!', headerRowClassName)}>
          {columns.map((column, i) => (
            <TableHead
              key={i} // Fixed: added '=' here
              className={cn(
                'bg-dark-400 py-4 text-purple-100 first:pl-5 last:pr-5',
                headerCellClassName,
              )}
            >
              {column.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, rowIndex) => (
          <TableRow
            key={rowKey(row, rowIndex)}
            className={cn(
              'hover:bg-dark-400/30! relative overflow-hidden rounded-lg border-b border-purple-100/5',
              bodyRowClassName,
            )}
          >
            {columns.map((column, columnIndex) => (
              <TableCell
                key={columnIndex}
                className={cn('py-4 first:pl-5 last:pr-5')}
              >
                {column.cell(row, rowIndex)}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default DataTable;

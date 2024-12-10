import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Loader2 } from 'lucide-react';
import { type CSSProperties, useState } from 'react';

const DEFAULT_REACT_TABLE_COLUMN_WIDTH = 150;

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading?: boolean;
}
const DataTable = <TData, TValue>({
  data,
  columns,
  loading = false,
}: DataTableProps<TData, TValue>) => {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => {
            return (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const styles: CSSProperties =
                    header.getSize() !== DEFAULT_REACT_TABLE_COLUMN_WIDTH
                      ? {
                          width: `${header.getSize()}px`,
                        }
                      : {};

                  return (
                    <TableHead key={header.id} style={styles}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            );
          })}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                {loading ? (
                  <Loader2 className="ml-auto mr-auto animate-spin" size={32} />
                ) : (
                  'Результатів немає'
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        {/* <TableFooter>
          {table.getFooterGroups().map(footerGroup => {
            return (
              <TableRow key={footerGroup.id}>
                {footerGroup.headers.map(footer => {
                  return (
                    <TableCell key={footer.id} colSpan={footer.colSpan}>
                      {flexRender(
                        footer.column.columnDef.footer,
                        footer.getContext(),
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableFooter> */}
      </Table>
    </div>
  );
};

export default DataTable;

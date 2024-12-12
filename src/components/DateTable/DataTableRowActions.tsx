import { Button } from '../ui/button';
import type { Row } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  onEdit: (value: TData) => void;
  onDelete?: (value: TData) => void;
}

const DataTableRowActions = <TData,>({
  row,
  onEdit,
  onDelete,
}: DataTableRowActionsProps<TData>) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="cursor-pointer" onClick={() => onEdit(row.original)}>
          Змінити
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {onDelete && (
          <DropdownMenuItem className="cursor-pointer" onClick={() => onDelete(row.original)}>
            Видалити
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DataTableRowActions;

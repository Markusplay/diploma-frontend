import { ColumnDef } from '@tanstack/react-table';
import { Button } from '../components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { GroupWithId } from '@/types/group';

type GetGroupColumnsParams = {
  onEdit: (group: GroupWithId) => void;
  onDelete: (group: GroupWithId) => void;
};

export function getGroupColumns({
  onEdit,
  onDelete,
}: GetGroupColumnsParams): ColumnDef<GroupWithId>[] {
  return [
    {
      accessorKey: 'groupId',
      header: 'ID',
    },
    {
      accessorKey: 'groupName',
      header: 'Назва групи',
    },
    {
      accessorKey: 'course',
      header: 'Курс',
    },
    {
      accessorKey: 'paymentForm',
      header: 'Форма оплати',
    },
    {
      accessorKey: 'budgetPlaces',
      header: 'Бюджетні місця',
    },
    {
      accessorKey: 'contractPlaces',
      header: 'Контрактні місця',
    },
    {
      accessorKey: 'foreignPlaces',
      header: 'Іноземні місця',
    },
    {
      id: 'actions',
      header: 'Дії',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => onEdit(row.original)}>
            <Edit size={16} />
          </Button>
          <Button variant="destructive" size="icon" onClick={() => onDelete(row.original)}>
            <Trash2 size={16} />
          </Button>
        </div>
      ),
    },
  ];
}

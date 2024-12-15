import type { GroupType } from '../types/GroupType';
import type { K3ItemTypeWithId } from '../types/K3ItemType';
import type { SubjectType } from '../types/SubjectType';
import type { ColumnDef } from '@tanstack/react-table';
import DataTableRowActions from './DateTable/DataTableRowActions.tsx';

interface K3ColumnsProps {
  onEdit: (k3Item: K3ItemTypeWithId) => void;
  onDelete: (k3Item: K3ItemTypeWithId) => void;

  groupsData?: GroupType[];
  subjectsData?: SubjectType[];
}

export const getK3Columns = ({
  onEdit,
  onDelete,
  groupsData,
  subjectsData,
}: K3ColumnsProps): ColumnDef<K3ItemTypeWithId>[] => [
  {
    accessorKey: 'paymentForm',
    header: 'Форма оплати',
    cell: ({ row }) => row.original.paymentForm,
  },
  {
    accessorKey: 'studyType',
    header: 'Форма навчання',
    cell: ({ row }) => row.original.studyType,
  },
  {
    accessorKey: 'subjectId',
    header: 'Дисципліна',
    cell: ({ row }) =>
      subjectsData?.find((subject) => subject.subjectId.toString() === row.original.subjectId.toString())
        ?.fullName,
  },
  {
    accessorKey: 'groupId',
    header: 'Група',
    cell: ({ row }) =>
      groupsData?.find((group) => group.groupId.toString() === row.original.groupId.toString())?.groupName,
  },
  {
    accessorKey: 'semester',
    header: 'Семестр',
    cell: ({ row }) => row.original.semester,
  },
  {
    accessorKey: 'course',
    header: 'Курс',
    cell: ({ row }) => row.original.course,
  },
  {
    accessorKey: 'disciplineVolume',
    header: 'Обсяг дисципліни',
    cell: ({ row }) => <p>{row.original.disciplineVolume}</p>,
  },
  {
    accessorKey: 'lectures',
    header: 'Лекції',
    cell: ({ row }) => <p>{row.original.lectures}</p>,
  },
  {
    accessorKey: 'practicals',
    header: 'Практичні',
    cell: ({ row }) => <p>{row.original.practicals}</p>,
  },
  {
    accessorKey: 'labs',
    header: 'Лабораторні',
    cell: ({ row }) => <p>{row.original.labs}</p>,
  },
  {
    accessorKey: 'individualLessons',
    header: 'Індивідуальні заняття',
    cell: ({ row }) => <p>{row.original.individualLessons}</p>,
  },
  {
    accessorKey: 'exams',
    header: 'Екзамени',
    cell: ({ row }) => <p>{row.original.exams ? '✅' : '❌'}</p>,
  },
  {
    accessorKey: 'credits',
    header: 'Заліки',
    cell: ({ row }) => <p>{row.original.credits ? '✅' : '❌'}</p>,
  },
  {
    accessorKey: 'controlWork',
    header: 'Контр.роботи',
    cell: ({ row }) => <p>{row.original.controlWork ? '✅' : '❌'}</p>,
  },
  {
    accessorKey: 'courseProject',
    header: 'Курсові проєкти',
    cell: ({ row }) => <p>{row.original.courseProject}</p>,
  },
  {
    accessorKey: 'courseWork',
    header: 'Курсові роботи',
    cell: ({ row }) => <p>{row.original.courseWork}</p>,
  },
  {
    accessorKey: 'rgr',
    header: 'РГР, РР, ГР',
    cell: ({ row }) => <p>{row.original.rgr}</p>,
  },
  {
    accessorKey: 'dkr',
    header: 'ДКР',
    cell: ({ row }) => <p>{row.original.dkr}</p>,
  },
  {
    accessorKey: 'abstract',
    header: 'Реферати',
    cell: ({ row }) => <p>{row.original.abstract}</p>,
  },
  {
    accessorKey: 'academicBudget',
    header: 'Академічні бюдж.',
    cell: ({ row }) => <p>{row.original.academicBudget}</p>,
  },
  {
    accessorKey: 'subgroupsForPZ',
    header: 'Підгрупи для ПЗ',
    cell: ({ row }) => <p>{row.original.subgroupsForPZ}</p>,
  },
  {
    accessorKey: 'subgroupsForLabs',
    header: 'Підгр. для лаб.роб.',
    cell: ({ row }) => <p>{row.original.subgroupsForLabs}</p>,
  },
  {
    accessorKey: 'academicContract',
    header: 'Академ. контрактні',
    cell: ({ row }) => <p>{row.original.academicContract}</p>,
  },
  {
    accessorKey: 'bValue',
    header: 'Б',
    cell: ({ row }) => <p>{row.original.bValue}</p>,
  },
  {
    accessorKey: 'kValue',
    header: 'К',
    cell: ({ row }) => <p>{row.original.kValue}</p>,
  },
  {
    accessorKey: 'bkValue',
    header: 'БК',
    cell: ({ row }) => <p>{row.original.bkValue}</p>,
  },
  {
    accessorKey: 'kkValue',
    header: 'КК',
    cell: ({ row }) => <p>{row.original.kkValue}</p>,
  },
  {
    accessorKey: 'streamsAmount',
    header: 'К-ть потоків',
    cell: ({ row }) => <p>{row.original.streamsAmount}</p>,
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} onEdit={onEdit} onDelete={onDelete} />,
    size: 50,
  },
];

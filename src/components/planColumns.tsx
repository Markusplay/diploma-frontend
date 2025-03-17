import { Button } from './ui/button';
import type { Group } from '../types/group.ts';
import type { PlanItem } from '../types/plan-item.ts';
import type { Subject } from '../types/subject.ts';
import type { Teacher } from '../types/teacher.ts';
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowDown, ArrowUp } from 'lucide-react';
import DataTableRowActions from './DateTable/DataTableRowActions.tsx';

interface Props {
  onEdit?: (loadItem: PlanItem) => void;
  onDelete?: (loadItem: PlanItem) => void;
  groupsData?: Group[];
  subjectsData?: Subject[];
  teachersData?: Teacher[];
}

export const getLoadColumns = ({
  onEdit,
  groupsData,
  subjectsData,
  teachersData,
}: Props): ColumnDef<PlanItem>[] => [
  {
    accessorKey: 'paymentForm',
    header: 'Форма оплати',
    cell: ({ row }) => row.original.paymentForm,
  },

  {
    accessorKey: 'subject',
    header: 'Дисципліна',
    cell: ({ row }) =>
      subjectsData?.find(
        (subject) => subject.subjectId.toString() === row.original.subject?.subjectId?.toString(),
      )?.fullName,
  },
  {
    accessorKey: 'group',
    header: 'Група',
    cell: ({ row }) =>
      groupsData?.find(
        (group) => group.groupId.toString() === row.original.group?.groupId?.toString(),
      )?.groupName,
  },
  {
    accessorKey: 'teacher',
    header: 'Викладач',
    cell: ({ row }) => {
      const teacher = teachersData?.find(
        (teacher) => teacher.teacherId.toString() === row.original.teacher?.teacherId?.toString(),
      );
      if (!teacher) return '';

      return `${teacher?.secondName} ${teacher?.initials}`;
    },
  },
  {
    accessorKey: 'semester',
    header: 'Семестр',
    cell: ({ row }) => row.original.semester,
  },
  // {
  //   accessorKey: 'course',
  //   header: 'Курс',
  //   cell: ({ row }) => row.original.course,
  // },
  {
    accessorKey: 'course',
    header: ({ column }) => {
      const isSortedAsc = column.getIsSorted() === 'asc';
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(isSortedAsc)}>
          Курс
          {isSortedAsc ? (
            <ArrowDown className="ml-1" size={18} />
          ) : (
            <ArrowUp className="ml-1" size={18} />
          )}
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue('course')}</div>,
  },
  {
    accessorKey: 'studyType',
    header: 'Вид навчання',
    cell: ({ row }) => row.original.studyType,
  },
  {
    accessorKey: 'studentAmount',
    header: 'К-ть студентів',
    cell: ({ row }) => <p>{row.original.studentAmount}</p>,
  },
  {
    accessorKey: 'lectureHour',
    header: ({ column }) => {
      const isSortedAsc = column.getIsSorted() === 'asc';
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(isSortedAsc)}>
          Лекції
          {isSortedAsc ? (
            <ArrowDown className="ml-1" size={18} />
          ) : (
            <ArrowUp className="ml-1" size={18} />
          )}
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue('lectureHour')}</div>,
  },
  {
    accessorKey: 'practicals',
    header: 'Практичні',
    cell: ({ row }) => <p>{row.original.practiceHour}</p>,
  },
  {
    accessorKey: 'labs',
    header: 'Лабораторні',
    cell: ({ row }) => <p>{row.original.labHour}</p>,
  },
  {
    accessorKey: 'consultations',
    header: 'Консультації',
    cell: ({ row }) => <p>{row.original.consultHour}</p>,
  },
  {
    accessorKey: 'controlWork',
    header: 'Контр.роботи',
    cell: ({ row }) => <p>{row.original.controlWorkHour}</p>,
  },
  {
    accessorKey: 'exams',
    header: 'Екзамени',
    cell: ({ row }) => <p>{row.original.examHour}</p>,
  },
  {
    accessorKey: 'credits',
    header: 'Заліки',
    cell: ({ row }) => <p>{row.original.creditHour}</p>,
  },

  {
    accessorKey: 'courseProject',
    header: 'Курсові проєкти',
    cell: ({ row }) => <p>{row.original.courseProjectHour}</p>,
  },
  {
    accessorKey: 'courseWork',
    header: 'Курсові роботи',
    cell: ({ row }) => <p>{row.original.courseWorkHour}</p>,
  },
  {
    accessorKey: 'rgr',
    header: 'РГР, РР, ГР',
    cell: ({ row }) => <p>{row.original.rgrHour}</p>,
  },
  {
    accessorKey: 'dkr',
    header: 'ДКР',
    cell: ({ row }) => <p>{row.original.dkrHour}</p>,
  },

  {
    accessorKey: 'dek',
    header: 'ДЕК',
    cell: ({ row }) => <p>{row.original.DEKHour}</p>,
  },
  {
    accessorKey: 'management.practice',
    header: 'Керівництво практикою',
    cell: ({ row }) => <p>{row.original.management.practice}</p>,
  },
  {
    accessorKey: 'management.bachelor',
    header: 'Керівництво бакалаврами',
    cell: ({ row }) => <p>{row.original.management.bachelor}</p>,
  },
  {
    accessorKey: 'management.masterPractice',
    header: 'Керівництво магістрами практиками',
    cell: ({ row }) => <p>{row.original.management.masterPractice}</p>,
  },
  {
    accessorKey: 'management.masterScience',
    header: 'Керівництво магістрами науковцями',
    cell: ({ row }) => <p>{row.original.management.masterScience}</p>,
  },
  {
    accessorKey: 'management.postgraduate',
    header: 'Керівництво аспірантами',
    cell: ({ row }) => <p>{row.original.management.postgraduate}</p>,
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} onEdit={onEdit} />,
    size: 50,
  },
];

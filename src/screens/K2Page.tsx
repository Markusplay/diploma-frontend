import { downloadFile, FileVariant } from '@/lib/downloadFile.ts';
import { Button } from '@/components/ui/button.tsx';
import { ArrowDown, Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.tsx';
import { useTeachers } from '@/hooks/use-teachers.ts';
import { useMemo, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import DataTable from '@/components/DateTable/DateTable.tsx';
import { getLoadColumns } from '@/components/planColumns.tsx';
import { useGroups } from '@/hooks/use-groups.ts';
import { useSubjects } from '@/hooks/use-subjects.ts';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEY } from '@/lib/constants.ts';
import PlanService from '@/services/PlanService.ts';
import { BackButton } from '@/components/BackButton.tsx';

const K2_FILENAME: string = 'K2.xlsx';

export const K2Page = () => {
  const { data: groups } = useGroups();
  const { data: subjects } = useSubjects();
  const { data: teachers } = useTeachers();

  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDownloadK2 = async (fileVariant: FileVariant, filename: string) => {
    if (!selectedTeacherId) {
      return;
    }
    setLoading(true);
    await downloadFile(fileVariant, filename, selectedTeacherId);
    setLoading(false);
  };

  const { data: initialLoadData, isLoading } = useQuery({
    queryKey: [QUERY_KEY.TEACHERS, selectedTeacherId],
    queryFn: async () => {
      const { data } = await PlanService.getByTeacherId(selectedTeacherId);
      return data;
    },
    enabled: !!selectedTeacherId, // ensures the query runs only if a teacher id is selected
  });

  const columns = useMemo(
    () =>
      getLoadColumns({
        onEdit: () => {},
        groupsData: groups,
        subjectsData: subjects,
        teachersData: teachers,
      }),
    [],
  );

  const getTeacherFullname = () => {
    const foundTeacher = teachers?.find(
      (teacher) => teacher.teacherId.toString() == selectedTeacherId,
    );
    if (!foundTeacher) {
      return 'Оберіть викладача';
    }

    return `${foundTeacher.secondName} ${foundTeacher.firstName} ${foundTeacher.middleName}`;
  };

  return (
    <div className="flex flex-col">
      <Card className="w-[350px] mx-auto">
        <CardHeader>
          <CardTitle>Форма К-2</CardTitle>
          <CardDescription>Оберіть викладача</CardDescription>
        </CardHeader>
        <CardContent>
          <Select onValueChange={(value) => setSelectedTeacherId(value)}>
            <SelectTrigger>
              <SelectValue placeholder={getTeacherFullname()} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {teachers?.map((teacher) => (
                  <SelectItem key={teacher.teacherId} value={teacher.teacherId.toString()}>
                    {`${teacher.secondName} ${teacher.firstName} ${teacher.middleName}`}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </CardContent>
        <CardFooter className="flex justify-between">
          <BackButton />
          <Button
            className="gap-2 px-4"
            onClick={() => handleDownloadK2(FileVariant.K2, K2_FILENAME)}
            size="lg"
            disabled={loading || !selectedTeacherId || initialLoadData?.length === 0}
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowDown size={20} />}
            Завантажити К-2
          </Button>
        </CardFooter>
      </Card>
      <DataTable data={initialLoadData || []} columns={columns} loading={isLoading} />
    </div>
  );
};

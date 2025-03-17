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
import { useEffect, useMemo, useState } from 'react';
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
import WorkloadService from '@/services/WorkloadService.ts';
import { AnalyzeResponse } from '@/types/AnalyzeResponse.ts';

const K2_FILENAME: string = 'K2.xlsx';

export const K2Page = () => {
  const { data: groups } = useGroups();
  const { data: subjects } = useSubjects();
  const { data: teachers } = useTeachers();

  const [loading, setLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeResult, setAnalyzeResult] = useState<AnalyzeResponse>();
  const [selectedTeacherId, setSelectedTeacherId] = useState('');

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
    enabled: !!selectedTeacherId,
  });

  useEffect(() => {
    const fetchAnalyze = async () => {
      setIsAnalyzing(true);
      const res = await WorkloadService.analyzeTeacher(selectedTeacherId);
      setIsAnalyzing(false);
      setAnalyzeResult(res.data);
    };
    if (!selectedTeacherId) {
      return;
    }

    fetchAnalyze();
  }, [selectedTeacherId]);

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
      <div className="flex w-full justify-center">
        {isAnalyzing && (
          <div className="flex mt-5">
            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
            Відбувається аналіз
          </div>
        )}
        {analyzeResult?.status && <h3>{analyzeResult.status}</h3>}
      </div>
      <div className="flex my-5 flex-col items-center w-full justify-center">
        {analyzeResult?.recommendations.length != 0 &&
          analyzeResult?.recommendations.map((rec) => (
            <>
              <h3>{rec}</h3>
            </>
          ))}
      </div>
      <DataTable data={initialLoadData || []} columns={columns} loading={isLoading} />
    </div>
  );
};

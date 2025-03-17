import { getLoadColumns } from '../components/planColumns.tsx';
import { ArrowDown, Loader2 } from 'lucide-react';
import { useMemo } from 'react';
import DataTable from '../components/DateTable/DateTable';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/card';
import { useGroups } from '../hooks/use-groups';
import { useSubjects } from '../hooks/use-subjects';
import { useTeachers } from '../hooks/use-teachers';
import PlanService from '../services/PlanService.ts';
import { useMutation, useQuery } from '@tanstack/react-query';
import { QUERY_KEY } from '../lib/constants';
import { BackButton } from '@/components/BackButton.tsx';
import WorkloadService from '@/services/WorkloadService.ts';

export function PlanPage() {
  const { data: groups } = useGroups();
  const { data: subjects } = useSubjects();
  const { data: teachers } = useTeachers();

  const { data: initialLoadData, isLoading } = useQuery({
    queryKey: [QUERY_KEY.WORKLOAD],
    queryFn: async () => {
      const { data } = await PlanService.getAll();
      return data;
    },
  });

  const { data: analyzeData, isLoading: isAnalyzing } = useQuery({
    queryKey: [QUERY_KEY.ANALYZE],
    queryFn: async () => {
      const { data } = await WorkloadService.analyze();
      return data;
    },
  });

  const columns = useMemo(
    () =>
      getLoadColumns({
        groupsData: groups,
        subjectsData: subjects,
        teachersData: teachers,
      }),
    [],
  );

  const mutation = useMutation({
    mutationFn: async () => {
      await PlanService.download();
    },
  });

  const handleDownload = () => {
    mutation.mutate();
  };

  return (
    <>
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="w-full justify-center text-center text-xl">
            План розподілу навантаження
          </CardTitle>

          <BackButton />
        </CardHeader>
        <CardContent>
          <DataTable data={initialLoadData || []} columns={columns} loading={isLoading} />
          {isAnalyzing && (
            <div className="flex mt-5">
              <Loader2 className="mr-2 h-6 w-6 animate-spin" />
              Відбувається аналіз
            </div>
          )}
          <ul className="mt-4">
            <li>Викладачі, які мають перевантаження: {analyzeData?.overloaded_teachers.length}</li>
            {!analyzeData?.is_balanced &&
              analyzeData?.overloaded_teachers.map((ot) => <li className="text-red-600">{ot}</li>)}
          </ul>
        </CardContent>
        <CardFooter className="flex gap-5">
          <Button
            size="lg"
            className="gap-2 px-4"
            onClick={handleDownload}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Формується...
              </>
            ) : (
              <>
                <ArrowDown size={20} />
                Сформувати навантаження
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}

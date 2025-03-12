import { getLoadColumns } from '../components/planColumns.tsx';
import type { PlanItem } from '../types/plan-item.ts';
import { ArrowDown, Loader2 } from 'lucide-react';
import { useCallback, useMemo } from 'react';
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

  const onEdit = useCallback((p: PlanItem) => {
    console.log(p.id);
  }, []);

  const columns = useMemo(
    () =>
      getLoadColumns({
        onEdit,
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

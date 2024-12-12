import { useNavigate } from 'react-router-dom';
import { getLoadColumns } from '../components/loadColumns';
import type { LoadType } from '../types/LoadType';
import { ArrowDown, Loader2 } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import DataTable from '../components/DateTable/DateTable';
import LoadForm from '../components/LoadForm/LoadForm';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/card';
import { useGroups } from '../hooks/use-groups';
import { useSubjects } from '../hooks/use-subjects';
import { useTeachers } from '../hooks/use-teachers';
import LoadService from '../services/LoadService';
import { useMutation, useQuery } from '@tanstack/react-query';
import { QUERY_KEY } from '../lib/constants';
import { queryClient } from '@/lib/queryClient.ts';

export function LoadPage() {
  const navigate = useNavigate();

  const { data: groups } = useGroups();
  const { data: subjects } = useSubjects();
  const { data: teachers } = useTeachers();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedLoad, setSelectedLoad] = useState<LoadType | null>(null);

  const { data: initialLoadData, isLoading } = useQuery({
    queryKey: [QUERY_KEY.LOADS],
    queryFn: async () => {
      const { data } = await LoadService.getAll();
      return data;
    },
  });

  const onEdit = useCallback((load: LoadType) => {
    setSelectedLoad(load);
    setIsDialogOpen(true);
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
      await LoadService.download();
    },
  });

  const handleDownload = () => {
    mutation.mutate();
  };

  return (
    <>
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Розподіл навантаження</CardTitle>

          <div className="flex justify-between">
            <Button
              onClick={() => {
                navigate(-1);
                queryClient.removeQueries({ queryKey: [QUERY_KEY.LOADS] });
              }}
              size="lg"
            >
              Назад
            </Button>
            <div />
            <div className="flex-nowrap">
              <LoadForm
                loadItem={selectedLoad}
                isOpen={isDialogOpen}
                onOpenChange={(value) => {
                  setIsDialogOpen(value);
                  if (!value) {
                    setSelectedLoad(null);
                  }
                }}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable data={initialLoadData || []} columns={columns} loading={isLoading} />
        </CardContent>
        <CardFooter className="flex gap-5">
          <Button className="gap-2 px-4" onClick={handleDownload} disabled={mutation.isPending}>
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Завантажується...
              </>
            ) : (
              <>
                <ArrowDown size={20} />
                Завантажити навантаження
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}

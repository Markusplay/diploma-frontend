import DataTable from '../components/DateTable/DateTable';
import { getK3Columns } from '../components/k3Columns';
import K3Form from '../components/K3Form/K3Form';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { useToast } from '../hooks/use-toast';
import { downloadFile } from '../lib/downloadFile';
import K3Service from '../services/K3Service';
import type { K3ItemTypeWithId } from '../types/K3ItemType';
import { ArrowDown, Eye, Loader2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import LoadService from '../services/LoadService';
import { useGroups } from '../hooks/use-groups';
import { useSubjects } from '../hooks/use-subjects';
import { useMutation, useQuery } from '@tanstack/react-query';
import { queryClient } from '../lib/queryClient';
import { QUERY_KEY } from '../lib/constants';
import { Link } from 'react-router-dom';

export function K3Page() {
  const { toast } = useToast();

  const { data: groups } = useGroups();
  const { data: subjects } = useSubjects();

  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedK3Item, setSelectedK3Item] = useState<K3ItemTypeWithId | null>(null);

  const {
    data: k3Items,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [QUERY_KEY.K3],
    queryFn: async () => {
      const { data } = await K3Service.getAll();
      return data;
    },
    staleTime: 0,
  });

  useEffect(() => {
    refetch();
  }, []);

  const deleteMutation = useMutation({
    mutationFn: (k3ItemId: string) => K3Service.delete(k3ItemId),
    onSuccess: () => {
      toast({
        title: 'Дані успішно видалені',
        variant: 'success',
      });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.K3] });
    },
    onError: () => {
      toast({
        title: 'Помилка під час видалення даних',
        variant: 'destructive',
      });
    },
  });

  const onDelete = useCallback(async (k3Item: K3ItemTypeWithId) => {
    deleteMutation.mutate(k3Item.id);
  }, []);

  const onEdit = useCallback((k3Item: K3ItemTypeWithId) => {
    setSelectedK3Item(k3Item);
    setIsDialogOpen(true);
  }, []);

  const columns = getK3Columns({
    onEdit,
    onDelete,
    groupsData: groups,
    subjectsData: subjects,
  });

  const handleDownload = async () => {
    setLoading(true);
    await downloadFile('k3', 'К-3-Б.xlsx');
    setLoading(false);
  };

  const handleLoadGenerate = async () => {
    const loadRes = await LoadService.create();
    if (loadRes.status !== 200) {
      toast({
        title: 'Помилка під час обрахування навантаження',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="w-full justify-center text-center text-xl">Форма К-3</CardTitle>
        <div className="flex justify-between">
          <div className="flex gap-5">
            <Button className="gap-2 px-4" onClick={handleDownload} disabled={loading} size="lg">
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ArrowDown size={20} />
              )}

              {loading ? 'Завантажується...' : 'Завантажити К-3'}
            </Button>
            <Link to="/load" onClick={handleLoadGenerate}>
              <Button className="gap-2 px-4" size="lg">
                <Eye size={20} />
                Переглянути навантаження
              </Button>
            </Link>
          </div>
          <div className="flex-nowrap">
            <K3Form
              isOpen={isDialogOpen}
              k3Item={selectedK3Item}
              groups={groups || []}
              subjects={subjects || []}
              onOpenChange={(value) => {
                setIsDialogOpen(value);
                if (!value) {
                  setSelectedK3Item(null);
                }
              }}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable data={k3Items || []} columns={columns} loading={isLoading} />
      </CardContent>
    </Card>
  );
}

import DataTable from '../components/DateTable/DateTable';
import { getK3Columns } from '../components/k3Columns';
// import K3Form from '../components/K3Form/K3Form';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { useToast } from '../hooks/use-toast';
import { downloadFile, FileVariant } from '../lib/downloadFile';
import K3Service from '../services/K3Service';
import type { K3ItemTypeWithId } from '../types/k3-item.ts';
import { ArrowDown, Eye } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useGroups } from '../hooks/use-groups';
import { useSubjects } from '../hooks/use-subjects';
import { useMutation, useQuery } from '@tanstack/react-query';
import { queryClient } from '../lib/queryClient';
import { QUERY_KEY } from '../lib/constants';
import { Link } from 'react-router-dom';
import { BackButton } from '@/components/BackButton.tsx';

const K3B_FILENAME = 'К-3-Б.xlsx';
const K3K_FILENAME = 'К-3-K.xlsx';

export function K3Page() {
  const { toast } = useToast();

  const { data: groups } = useGroups();
  const { data: subjects } = useSubjects();
  const [loading, setLoading] = useState(false);
  // const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  // const [selectedK3Item, setSelectedK3Item] = useState<K3ItemTypeWithId | null>(null);

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
    console.log(k3Item.id);
  }, []);

  const columns = getK3Columns({
    onEdit,
    onDelete,
    groupsData: groups,
    subjectsData: subjects,
  });

  const handleDownloadK3 = async (fileVariant: FileVariant, filename: string) => {
    setLoading(true);
    await downloadFile(fileVariant, filename);
    setLoading(false);
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="w-full justify-center text-center text-xl">Форма К-3</CardTitle>
        <div className="flex justify-between">
          <div className="flex gap-5">
            <BackButton />

            <Link to="/plan">
              <Button className="gap-2 px-4" size="lg">
                <Eye size={20} />
                Переглянути план навантаження
              </Button>
            </Link>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable data={k3Items || []} columns={columns} loading={isLoading} />
      </CardContent>
      <CardFooter className="flex gap-3">
        <Button
          className="gap-2 px-4"
          onClick={() => handleDownloadK3(FileVariant.K3B, K3B_FILENAME)}
          disabled={loading}
          size="lg"
        >
          <ArrowDown size={20} />
          Завантажити К-3-Б
        </Button>

        <Button
          className="gap-2 px-4"
          onClick={() => handleDownloadK3(FileVariant.K3K, K3K_FILENAME)}
          disabled={loading}
          size="lg"
        >
          <ArrowDown size={20} />
          Завантажити К-3-К
        </Button>
      </CardFooter>
    </Card>
  );
}

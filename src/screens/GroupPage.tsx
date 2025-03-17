import DataTable from '../components/DateTable/DateTable';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { useToast } from '../hooks/use-toast';
import GroupService from '../services/GroupService';
import { Plus } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { queryClient } from '../lib/queryClient';
import { QUERY_KEY } from '../lib/constants';
import { Group } from '@/types/group';
import { getGroupColumns } from '@/components/getGroupColumns.tsx';
import { GroupForm } from '@/components/GroupForm.tsx';
import { BackButton } from '@/components/BackButton.tsx';

export function GroupPage() {
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  const {
    data: groups,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [QUERY_KEY.GROUPS],
    queryFn: async () => {
      const { data } = await GroupService.getAll();
      return data;
    },
  });

  useEffect(() => {
    refetch();
  }, [refetch]);

  const deleteMutation = useMutation({
    mutationFn: (groupId: number) => GroupService.delete(groupId),
    onSuccess: () => {
      toast({ title: 'Групу успішно видалено', variant: 'success' });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.GROUPS] });
    },
    onError: () => {
      toast({ title: 'Помилка видалення групи', variant: 'destructive' });
    },
  });

  const onDelete = useCallback(
    (group: Group) => {
      deleteMutation.mutate(group.groupId);
    },
    [deleteMutation],
  );

  const onEdit = useCallback((group: Group) => {
    setSelectedGroup(group);
    setIsDialogOpen(true);
  }, []);

  const columns = getGroupColumns({
    onEdit,
    onDelete,
  });

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Групи</CardTitle>
        <BackButton />

        <div className="flex justify-between">
          <Button className="gap-2 px-4" onClick={() => setIsDialogOpen(true)} size="lg">
            <Plus size={20} /> Додати групу
          </Button>
          <GroupForm
            isOpen={isDialogOpen}
            group={selectedGroup}
            onOpenChange={(value) => {
              setIsDialogOpen(value);
              if (!value) {
                setSelectedGroup(null);
              }
            }}
          />
        </div>
      </CardHeader>
      <CardContent>
        <DataTable data={groups?.reverse() || []} columns={columns} loading={isLoading} />
      </CardContent>
    </Card>
  );
}

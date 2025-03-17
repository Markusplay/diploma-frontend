import DataTable from '@/components/DateTable/DateTable.tsx';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEY } from '@/lib/constants.ts';
import PlanService from '@/services/PlanService.ts';
import { useCallback, useMemo, useState } from 'react';
import { getLoadColumns } from '@/components/planColumns.tsx';
import { useGroups } from '@/hooks/use-groups.ts';
import { useSubjects } from '@/hooks/use-subjects.ts';
import { useTeachers } from '@/hooks/use-teachers.ts';
import type { PlanItem } from '@/types/plan-item.ts';
import { downloadFile, FileVariant } from '@/lib/downloadFile.ts';
import { BackButton } from '@/components/BackButton.tsx';
import { Button } from '@/components/ui/button.tsx';
import { ArrowDown, Loader2 } from 'lucide-react';

const K5_FILENAME = 'K5.xlsx';

export const K5Page = () => {
  const { data: groups } = useGroups();
  const { data: subjects } = useSubjects();
  const { data: teachers } = useTeachers();
  const [loading, setLoading] = useState(false);

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
  const handleDownloadK4 = async (fileVariant: FileVariant, filename: string) => {
    setLoading(true);
    await downloadFile(fileVariant, filename);
    setLoading(false);
  };
  return (
    <div className="flex flex-col m-4 gap-4">
      <BackButton />
      <DataTable data={initialLoadData || []} columns={columns} loading={isLoading} />
      <Button
        className="gap-2 px-4"
        onClick={() => handleDownloadK4(FileVariant.K4, K5_FILENAME)}
        size="lg"
        disabled={loading || initialLoadData?.length === 0}
      >
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowDown size={20} />}
        Завантажити К-4
      </Button>
    </div>
  );
};

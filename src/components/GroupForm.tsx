import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { FC, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import GroupService from '@/services/GroupService';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';
import { QUERY_KEY } from '@/lib/constants';
import { Group } from '@/types/group';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { PaymentForm } from '@/types/enums.ts';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.tsx';
import { COURSES, CourseType } from '@/types/types.ts';

const groupSchema = z.object({
  groupName: z.string().min(1, 'Назва групи обов’язкова'),
  course: z.coerce.number().min(1),
  paymentForm: z.enum([PaymentForm.budget, PaymentForm.contract], {
    message: 'Оберіть форму оплати',
  }),
  budgetPlaces: z.coerce.number().min(0),
  contractPlaces: z.coerce.number().min(0),
  foreignPlaces: z.coerce.number().min(0),
});

interface GroupFormProps {
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
  group: Group | null;
}

export const GroupForm: FC<GroupFormProps> = ({ isOpen, onOpenChange, group }) => {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof groupSchema>>({
    resolver: zodResolver(groupSchema),
    mode: 'onChange',
  });

  const createMutation = useMutation({
    mutationFn: (data: Omit<Group, 'groupId'>) => GroupService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.GROUPS] });
      toast({ title: 'Групу додано', variant: 'success' });
    },
    onError: () => toast({ title: 'Помилка додавання групи', variant: 'destructive' }),
  });

  const updateMutation = useMutation({
    mutationFn: (data: Group) => GroupService.update(data.groupId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.GROUPS] });
      toast({ title: 'Групу оновлено', variant: 'success' });
    },
    onError: () => toast({ title: 'Помилка оновлення групи', variant: 'destructive' }),
  });

  useEffect(() => {
    form.reset(group || {});
  }, [isOpen, group]);

  const onSubmit: SubmitHandler<z.infer<typeof groupSchema>> = async (values) => {
    if (!group) {
      const newGroup = { ...values, course: values.course as CourseType };
      createMutation.mutate(newGroup);
    } else {
      updateMutation.mutate({
        ...values,
        groupId: group.groupId,
        course: values.course as CourseType,
      });
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[400px]">
        <DialogHeader>
          <DialogTitle>{group ? 'Оновити групу' : 'Додати нову групу'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="flex flex-col gap-4">
            <FormField
              name="groupName"
              control={form.control}
              render={({ field: { value, onChange } }) => (
                <FormItem>
                  <FormLabel>Назва групи</FormLabel>
                  <FormControl>
                    <Input value={value} onChange={(value) => onChange(value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="course"
              control={form.control}
              render={({ field: { onChange, value } }) => (
                <FormItem>
                  <FormLabel>Курс</FormLabel>
                  <FormControl>
                    <Select onValueChange={onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={value || 'Оберіть курс'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {COURSES.map((item) => (
                            <SelectItem key={item.toString()} value={item.toString()}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="paymentForm"
              control={form.control}
              render={({ field: { onChange, value } }) => (
                <FormItem>
                  <FormLabel>Форма оплати</FormLabel>
                  <FormControl>
                    <Select onValueChange={onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={value || 'Оберіть форму оплати'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {Object.values(PaymentForm).map((item) => (
                            <SelectItem key={item} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="budgetPlaces"
              control={form.control}
              render={({ field: { value, onChange } }) => (
                <FormItem>
                  <FormLabel>Бюджетні місця</FormLabel>
                  <FormControl>
                    <Input value={value} onChange={(value) => onChange(value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="contractPlaces"
              control={form.control}
              render={({ field: { value, onChange } }) => (
                <FormItem>
                  <FormLabel>Контрактні місця</FormLabel>
                  <FormControl>
                    <Input value={value} onChange={(value) => onChange(value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="foreignPlaces"
              control={form.control}
              render={({ field: { value, onChange } }) => (
                <FormItem>
                  <FormLabel>Іноземні місця</FormLabel>
                  <FormControl>
                    <Input value={value} onChange={(value) => onChange(value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button onClick={form.handleSubmit(onSubmit)}>
            {(createMutation.isPending || updateMutation.isPending) && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Підтвердити
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import type { K3ItemType, K3ItemTypeWithId } from '../../types/K3ItemType';
import { PaymentForm, StudyType } from '../../types/enums';
import { COURSES, type CourseType, SEMESTERS, type SemesterType } from '../../types/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, ChevronsUpDown, Loader2, Plus } from 'lucide-react';
import { type FC, useEffect, useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import type { z } from 'zod';
import { Checkbox } from '../ui/checkbox';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import formSchema from './schema';
import { cn } from '@/lib/cn.ts';
import { queryClient } from '@/lib/queryClient';
import { QUERY_KEY } from '@/lib/constants';
import { useMutation } from '@tanstack/react-query';
import K3Service from '@/services/K3Service';
import { useToast } from '@/hooks/use-toast';
import { SubjectType } from '@/types/SubjectType';
import { GroupType } from '@/types/GroupType';

interface K3FormProps {
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
  k3Item: K3ItemTypeWithId | null;
  groups: GroupType[];
  subjects: SubjectType[];
}

const K3Form: FC<K3FormProps> = ({ isOpen, onOpenChange, k3Item, groups, subjects }) => {
  const { toast } = useToast();

  const [openSubjectSearch, setOpenSubjectSearch] = useState(false);
  const [openGroupSearch, setOpenGroupSearch] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
  });

  const createMutation = useMutation({
    mutationFn: (data: K3ItemType) => K3Service.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.K3] });
    },
    onError: () => {
      toast({
        title: 'Помилка під час додавання',
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: K3ItemTypeWithId) => K3Service.update(data),
    onSuccess: () => {
      toast({
        title: 'Дані успішно оновлено',
        variant: 'success',
      });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.K3] });
    },
    onError: () => {
      toast({
        title: 'Помилка під час оновлення',
        variant: 'destructive',
      });
    },
  });

  useEffect(() => {
    if (k3Item) {
      form.reset({
        semester: k3Item.semester,
        course: k3Item.course,
        subjectId: k3Item.subjectId.toString(),
        groupId: k3Item.groupId.toString(),
        disciplineVolume: k3Item.disciplineVolume,
        lectures: k3Item.lectures,
        practicals: k3Item.practicals,
        labs: k3Item.labs,
        individualLessons: k3Item.individualLessons,
        exams: k3Item.exams,
        credits: k3Item.credits,
        controlWork: k3Item.controlWork,
        courseProject: k3Item.courseProject,
        courseWork: k3Item.courseWork,
        rgr: k3Item.rgr,
        dkr: k3Item.dkr,
        abstract: k3Item.abstract,
        academicBudget: k3Item.academicBudget,
        paymentForm: k3Item.paymentForm,
        studyType: k3Item.studyType,
        subgroupsForPZ: k3Item.subgroupsForPZ,
        subgroupsForLabs: k3Item.subgroupsForLabs,
        academicContract: k3Item.academicContract,
        bValue: k3Item.bValue,
        kValue: k3Item.kValue,
        bkValue: k3Item.bkValue,
        kkValue: k3Item.kkValue,
        streamsAmount: k3Item.streamsAmount,
      });
    } else {
      form.reset();
    }
  }, [isOpen, k3Item]);

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (
    values: z.infer<typeof formSchema>,
  ) => {
    const k3Dto: K3ItemType = {
      groupId: values.groupId,
      semester: values.semester as SemesterType,
      course: values.course as CourseType,
      paymentForm: values.paymentForm,
      subjectId: values.subjectId || '',
      cathedra: 'ІСТ',
      studyType: values.studyType,
      disciplineVolume: values.disciplineVolume,
      lectures: values.lectures,
      practicals: values.practicals,
      labs: values.labs,
      individualLessons: values.individualLessons,
      exams: !!values.exams,
      credits: !!values.credits,
      controlWork: !!values.controlWork,
      courseProject: values.courseProject,
      courseWork: values.courseWork,
      rgr: values.rgr,
      dkr: values.dkr,
      abstract: values.abstract,
      academicBudget: values.academicBudget,
      subgroupsForPZ: values.subgroupsForPZ,
      subgroupsForLabs: values.subgroupsForLabs,
      academicContract: values.academicContract,
      bValue: values.bValue,
      kValue: values.kValue,
      bkValue: values.bkValue,
      kkValue: values.kkValue,
      streamsAmount: values.streamsAmount,
    };

    if (!k3Item) {
      createMutation.mutate(k3Dto);
    } else {
      const body: K3ItemTypeWithId = Object.assign(k3Dto, { id: k3Item.id });
      updateMutation.mutate(body);
    }

    onOpenChange(false);
  };

  console.log('k3Item', k3Item);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2 px-4" size="lg">
          <Plus /> Додати К-3 дисципліну
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{k3Item ? 'Оновити дисципліну' : 'Додати нову дисципліну'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="flex gap-10 items-start">
            <div className="flex flex-col gap-4">
              <FormField
                name="subjectId"
                control={form.control}
                render={({ field: { value, onChange } }) => (
                  <FormItem className="flex flex-col overflow-hidden">
                    <FormLabel>Дисципліна</FormLabel>
                    <FormControl>
                      <Popover open={openSubjectSearch} onOpenChange={setOpenSubjectSearch}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openSubjectSearch}
                            className="w-[200px] justify-between"
                          >
                            {subjects?.find((subject) => subject.subjectId.toString() === value)
                              ?.fullName || 'Знайти дисципліну'}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                          <Command>
                            <CommandInput placeholder="Пошук дисципліни..." />
                            <CommandList>
                              <CommandEmpty>Дисципліну не знайдено.</CommandEmpty>
                              <CommandGroup>
                                {subjects?.map((subject) => {
                                  return (
                                    <CommandItem
                                      key={subject.subjectId}
                                      value={subject.subjectId.toString()}
                                      onSelect={(currentValue) => {
                                        onChange(currentValue === value ? '' : currentValue);
                                        setOpenSubjectSearch(false);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          'mr-2 h-4 w-4',
                                          value === subject.fullName ? 'opacity-100' : 'opacity-0',
                                        )}
                                      />
                                      {subject.fullName}
                                    </CommandItem>
                                  );
                                })}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="paymentForm"
                control={form.control}
                render={({ field: { onChange } }) => (
                  <FormItem>
                    <FormLabel>Форма оплати</FormLabel>
                    <FormControl>
                      <Select onValueChange={(value) => onChange(value)}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue
                            placeholder={k3Item?.paymentForm || 'Оберіть форму оплати'}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {Object.values(PaymentForm)?.map((item) => (
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
                name="studyType"
                control={form.control}
                render={({ field: { onChange } }) => (
                  <FormItem>
                    <FormLabel>Форма навчання</FormLabel>
                    <FormControl>
                      <Select onValueChange={(value) => onChange(value)}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder={k3Item?.studyType || 'Оберіть форму'} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {Object.values(StudyType)?.map((item) => (
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
                name="groupId"
                control={form.control}
                render={({ field: { value, onChange } }) => (
                  // <FormItem>
                  //   <FormLabel>Група</FormLabel>
                  //   <FormControl>
                  //     <Select onValueChange={value => onChange(value)}>
                  //       <SelectTrigger className="w-[180px]">
                  //         <SelectValue
                  //           placeholder={
                  //             groups?.find(
                  //               group =>
                  //                 group.groupId.toString() === k3Item?.groupId,
                  //             )?.groupName || 'Оберіть групу'
                  //           }
                  //         />
                  //       </SelectTrigger>
                  //       <SelectContent>
                  //         <SelectGroup>
                  //           {groups?.map(item => (
                  //             <SelectItem
                  //               key={item.groupId}
                  //               value={item.groupId.toString()}
                  //             >
                  //               {item.groupName}
                  //             </SelectItem>
                  //           ))}
                  //         </SelectGroup>
                  //       </SelectContent>
                  //     </Select>
                  //   </FormControl>
                  //   <FormMessage />
                  // </FormItem>
                  <FormItem className="flex flex-col overflow-hidden">
                    <FormLabel>Група</FormLabel>
                    <FormControl>
                      <Popover open={openGroupSearch} onOpenChange={setOpenGroupSearch}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openGroupSearch}
                            className="w-[200px] justify-between"
                          >
                            {groups?.find((group) => group.groupId.toString() === value)
                              ?.groupName || 'Оберіть групу'}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                          <Command>
                            <CommandInput placeholder="Пошук групи..." />
                            <CommandList>
                              <CommandEmpty>Групу не знайдено.</CommandEmpty>
                              <CommandGroup>
                                {groups?.map((group) => {
                                  return (
                                    <CommandItem
                                      key={group.groupId}
                                      value={group.groupId.toString()}
                                      onSelect={(currentValue) => {
                                        onChange(currentValue === value ? '' : currentValue);
                                        setOpenSubjectSearch(false);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          'mr-2 h-4 w-4',
                                          value === group.groupName ? 'opacity-100' : 'opacity-0',
                                        )}
                                      />
                                      {group.groupName}
                                    </CommandItem>
                                  );
                                })}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="semester"
                control={form.control}
                render={({ field: { onChange } }) => (
                  <FormItem>
                    <FormLabel>Семестр</FormLabel>
                    <FormControl>
                      <Select onValueChange={(value) => onChange(value)}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder={k3Item?.semester || 'Оберіть семестр'} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {SEMESTERS.map((item, index) => (
                              <SelectItem key={index} value={item.toString()}>
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
                name="course"
                control={form.control}
                render={({ field: { onChange } }) => (
                  <FormItem>
                    <FormLabel>Курс</FormLabel>
                    <FormControl>
                      <Select onValueChange={(value) => onChange(value)}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder={k3Item?.course || 'Оберіть курс'} />
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
                name="disciplineVolume"
                control={form.control}
                render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <FormLabel>Обсяг дисципліни</FormLabel>
                    <FormControl>
                      <Input value={value} onChange={(value) => onChange(value)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col gap-4">
              <FormField
                name="lectures"
                control={form.control}
                render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <FormLabel>Лекції</FormLabel>
                    <FormControl>
                      <Input value={value} onChange={(value) => onChange(value)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="practicals"
                control={form.control}
                render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <FormLabel>Практичні</FormLabel>
                    <FormControl>
                      <Input value={value} onChange={(value) => onChange(value)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="labs"
                control={form.control}
                render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <FormLabel>Лабораторні</FormLabel>
                    <FormControl>
                      <Input value={value} onChange={(value) => onChange(value)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="individualLessons"
                control={form.control}
                render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <FormLabel>Індивідуальні заняття</FormLabel>
                    <FormControl>
                      <Input value={value} onChange={(value) => onChange(value)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="exams"
                control={form.control}
                render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Checkbox checked={value} onCheckedChange={onChange} />
                        <div className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Екзамени
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="credits"
                control={form.control}
                render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Checkbox checked={value} onCheckedChange={onChange} />
                        <div className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Заліки
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="controlWork"
                control={form.control}
                render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Checkbox checked={value} onCheckedChange={onChange} />
                        <div className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Контр.роб (мод., темат.)
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col gap-4">
              <FormField
                name="courseProject"
                control={form.control}
                render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <FormLabel>Курсові проєкти</FormLabel>
                    <FormControl>
                      <Input value={value} onChange={(value) => onChange(value)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="courseWork"
                control={form.control}
                render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <FormLabel>Курсові роботи</FormLabel>
                    <FormControl>
                      <Input value={value} onChange={(value) => onChange(value)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="rgr"
                control={form.control}
                render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <FormLabel>РГР, РР, ГР</FormLabel>
                    <FormControl>
                      <Input value={value} onChange={(value) => onChange(value)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="dkr"
                control={form.control}
                render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <FormLabel>ДКР</FormLabel>
                    <FormControl>
                      <Input value={value} onChange={(value) => onChange(value)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="abstract"
                control={form.control}
                render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <FormLabel>Реферати</FormLabel>
                    <FormControl>
                      <Input value={value} onChange={(value) => onChange(value)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col gap-4">
              <FormField
                name="subgroupsForPZ"
                control={form.control}
                render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <FormLabel>Підгрупи для ПЗ</FormLabel>
                    <FormControl>
                      <Input value={value} onChange={(value) => onChange(value)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="subgroupsForLabs"
                control={form.control}
                render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <FormLabel>Підгр. для лаб.роб.</FormLabel>
                    <FormControl>
                      <Input value={value} onChange={(value) => onChange(value)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="academicBudget"
                control={form.control}
                render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <FormLabel>Академічні бюдж.</FormLabel>
                    <FormControl>
                      <Input value={value} onChange={(value) => onChange(value)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="academicContract"
                control={form.control}
                render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <FormLabel>Академ. контрактні</FormLabel>
                    <FormControl>
                      <Input value={value} onChange={(value) => onChange(value)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col gap-4">
              <FormField
                name="bValue"
                control={form.control}
                render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <FormLabel>Б</FormLabel>
                    <FormControl>
                      <Input value={value} onChange={(value) => onChange(value)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="kValue"
                control={form.control}
                render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <FormLabel>К</FormLabel>
                    <FormControl>
                      <Input value={value} onChange={(value) => onChange(value)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="bkValue"
                control={form.control}
                render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <FormLabel>БК</FormLabel>
                    <FormControl>
                      <Input value={value} onChange={(value) => onChange(value)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="kkValue"
                control={form.control}
                render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <FormLabel>КК</FormLabel>
                    <FormControl>
                      <Input value={value} onChange={(value) => onChange(value)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="streamsAmount"
                control={form.control}
                render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <FormLabel>К-ть потоків</FormLabel>
                    <FormControl>
                      <Input value={value} onChange={(value) => onChange(value)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        <DialogFooter>
          <Button
            type="button"
            disabled={createMutation.isPending}
            onClick={form.handleSubmit(onSubmit)}
          >
            {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Підтвердити
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default K3Form;

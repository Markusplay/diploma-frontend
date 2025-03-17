import { Button } from '@/components/ui/button.tsx';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form.tsx';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command.tsx';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { formSchema } from './schema.ts';
import { FC, useEffect, useState } from 'react';
import { queryClient } from '@/lib/queryClient.ts';
import { z } from 'zod';
import { QUERY_KEY } from '@/lib/constants.ts';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast.ts';
import { zodResolver } from '@hookform/resolvers/zod';
import { COURSES, CourseType, SEMESTERS, SemesterType } from '@/types/types.ts';
import { Checkbox } from '@/components/ui/checkbox.tsx';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.tsx';
import { cn } from '@/lib/utils.ts';
import { PaymentForm, StudyType } from '@/types/enums.ts';
import { useGroups } from '@/hooks/use-groups.ts';
import { useSubjects } from '@/hooks/use-subjects.ts';
import { BackButton } from '@/components/BackButton.tsx';
import { Link } from 'react-router-dom';
import { Workload } from '@/types/workload.ts';
import WorkloadService from '@/services/WorkloadService.ts';
import { useTeachers } from '@/hooks/use-teachers.ts';

export const CreationPage: FC = () => {
  const { toast } = useToast();
  const { data: groups } = useGroups();
  const { data: subjects } = useSubjects();
  const { data: teachers } = useTeachers();

  const [openSubjectSearch, setOpenSubjectSearch] = useState(false);
  const [openGroupSearch, setOpenGroupSearch] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onSubmit',
  });

  const createMutation = useMutation({
    mutationFn: (data: Workload) => WorkloadService.post(data),
    onSuccess: () => {
      toast({
        title: 'Дані успішно додано',
        variant: 'success',
      });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.WORKLOAD] });
    },
    onError: () => {
      toast({
        title: 'Помилка під час додавання',
        variant: 'destructive',
      });
    },
  });

  useEffect(() => {
    form.reset();
  }, []);

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (values) => {
    const dto: Workload = {
      ...values,
      subjectId: parseInt(values.subjectId),
      groupId: parseInt(values.groupId),
      teacherId: parseInt(values.teacherId),
      cathedra: 'ІСТ',
      paymentForm: values.paymentForm as PaymentForm,
      semester: values.semester as SemesterType,
      course: values.course as CourseType,
    };

    createMutation.mutate(dto);
  };
  return (
    <div className="container mx-auto p-6">
      <div className="flex">
        <BackButton />
        <h1 className="text-2xl font-bold mx-auto">Додати нову дисципліну</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-2">Основна інформація</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-end">
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
                            className="w-full justify-between"
                          >
                            {subjects?.find((subject) => subject.subjectId.toString() == value)
                              ?.fullName || 'Знайти дисципліну'}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0 max-w-[500px]">
                          <Command>
                            <CommandInput placeholder="Пошук дисципліни..." />
                            <CommandList>
                              <CommandEmpty>Дисципліну не знайдено.</CommandEmpty>
                              <CommandGroup>
                                {subjects?.map((subject) => (
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
                                ))}
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
                name="studyType"
                control={form.control}
                render={({ field: { onChange, value } }) => (
                  <FormItem>
                    <FormLabel>Форма навчання</FormLabel>
                    <FormControl>
                      <Select onValueChange={onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={value || 'Оберіть форму навчання'} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {Object.values(StudyType).map((item) => (
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
                  <FormItem className="flex flex-col overflow-hidden">
                    <FormLabel>Група</FormLabel>
                    <FormControl>
                      <Popover open={openGroupSearch} onOpenChange={setOpenGroupSearch}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openGroupSearch}
                            className="w-full justify-between"
                          >
                            {groups?.find((group) => group.groupId.toString() == value)
                              ?.groupName || 'Оберіть групу'}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0 max-w-[500px]">
                          <Command>
                            <CommandInput placeholder="Пошук групи..." />
                            <CommandList>
                              <CommandEmpty>Групу не знайдено.</CommandEmpty>
                              <CommandGroup>
                                {groups?.map((group) => (
                                  <CommandItem
                                    key={group.groupId}
                                    value={group.groupId.toString()}
                                    onSelect={(currentValue) => {
                                      onChange(currentValue === value ? '' : currentValue);
                                      setOpenGroupSearch(false);
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
                                ))}
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
                render={({ field: { onChange, value } }) => (
                  <FormItem>
                    <FormLabel>Семестр</FormLabel>
                    <FormControl>
                      <Select onValueChange={onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={value || 'Оберіть семестр'} />
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
              <FormField
                name="teacherId"
                control={form.control}
                render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <FormLabel>Викладач</FormLabel>
                    <FormControl>
                      <Select onValueChange={(value) => onChange(value)}>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              teachers?.find((teacher) => teacher.teacherId.toString() == value)
                                ?.initials || 'Оберіть викладача'
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {teachers?.map((teacher) => (
                              <SelectItem
                                key={teacher.teacherId}
                                value={teacher.teacherId.toString()}
                              >
                                {`${teacher.secondName} ${teacher.firstName} ${teacher.middleName}`}
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
            </div>
          </section>
          {/* Заняття */}
          <section>
            <h2 className="text-xl font-semibold mb-2">Заняття</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <FormField
                name="lectureHour"
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
                name="practiceHour"
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
                name="labHour"
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
                name="hasExam"
                control={form.control}
                render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Checkbox checked={value} onCheckedChange={onChange} />
                        <div className="text-sm font-medium">Екзамени</div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="hasCredit"
                control={form.control}
                render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Checkbox checked={value} onCheckedChange={onChange} />
                        <div className="text-sm font-medium">Заліки</div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="hasControlWork"
                control={form.control}
                render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Checkbox checked={value} onCheckedChange={onChange} />
                        <div className="text-sm font-medium">Контр.роб (мод., темат.)</div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </section>
          {/* Проєкти та реферати */}
          <section>
            <h2 className="text-xl font-semibold mb-2">Проєкти та реферати</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <FormField
                name="courseProjectHour"
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
                name="courseWorkHour"
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
                name="rgrHour"
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
                name="dkrHour"
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
          </section>
          {/* Підгрупи та бюджет */}
          <section>
            <h2 className="text-xl font-semibold mb-2">Підгрупи та бюджет</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <FormField
                name="subgroupsForPZ"
                control={form.control}
                render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <FormLabel>Підгрупи для практичних занять</FormLabel>
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
          </section>
          {/* Керівництво */}
          <section>
            <h2 className="text-xl font-semibold mb-2">Керівництво</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <FormField
                name="managementPractice"
                control={form.control}
                render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <FormLabel>Керівництво практикою</FormLabel>
                    <FormControl>
                      <Input value={value} onChange={(value) => onChange(value)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="managementBachelor"
                control={form.control}
                render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <FormLabel>Керівництво бакалаврами</FormLabel>
                    <FormControl>
                      <Input value={value} onChange={(value) => onChange(value)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="managementMasterPractice"
                control={form.control}
                render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <FormLabel>Керівництво магістрами професійними</FormLabel>
                    <FormControl>
                      <Input value={value} onChange={(value) => onChange(value)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="managementMasterScience"
                control={form.control}
                render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <FormLabel>Керівництво науковцями</FormLabel>
                    <FormControl>
                      <Input value={value} onChange={(value) => onChange(value)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="managementPostgraduate"
                control={form.control}
                render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <FormLabel>Керівництво аспірантами</FormLabel>
                    <FormControl>
                      <Input value={value} onChange={(value) => onChange(value)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="dekHour"
                control={form.control}
                render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <FormLabel>ДЕК</FormLabel>
                    <FormControl>
                      <Input value={value} onChange={(value) => onChange(value)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </section>
          {/* Інші параметри */}
          <section>
            <h2 className="text-xl font-semibold mb-2">Інші параметри</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
          </section>
          <div className="flex gap-4 justify-end">
            {createMutation.isSuccess && (
              <Button variant="outline" size="lg" type="button" asChild>
                <Link to="/k3">Переглянути форму К-3</Link>
              </Button>
            )}
            <Button type="submit" size="lg" disabled={createMutation.isPending}>
              {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Підтвердити
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

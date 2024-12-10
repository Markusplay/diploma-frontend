import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import type { CourseType, SemesterType } from '../../types/types';
import { zodResolver } from '@hookform/resolvers/zod';

import type { LoadType } from '../../types/LoadType';
import { type SubmitHandler, useForm } from 'react-hook-form';
import type { z } from 'zod';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import formSchema from './schema';
import { useToast } from '../../hooks/use-toast';
import { api } from '../../lib/api';
import { useGroups } from '../../hooks/use-groups';
import { useSubjects } from '../../hooks/use-subjects';
import { useTeachers } from '../../hooks/use-teachers';
import { FC, useEffect } from 'react';

interface LoadFormProps {
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
  loadItem: LoadType | null;
}

const LoadForm: FC<LoadFormProps> = ({ isOpen, onOpenChange, loadItem }) => {
  const { toast } = useToast();
  const { data: groups } = useGroups();
  const { data: subjects } = useSubjects();
  const { data: teachers } = useTeachers();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
  });

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = (
    values: z.infer<typeof formSchema>,
  ) => {
    const createDto: LoadType = {
      id: loadItem?.id || 0,
      cathedra: values.cathedra,
      consultHour: values.consultHour,
      controlWorkHour: values.controlWorkHour,
      course: values.course as CourseType,
      courseProjectHour: values.courseProjectHour,
      courseWorkHour: values.courseWorkHour,
      creditHour: values.creditHour,
      dkrHour: values.dkrHour,
      examHour: values.examHour,
      group: groups?.find((group) => group.groupId.toString() === values.groupId.toString()),
      labHour: values.labHour,
      lectureHour: values.lectureHour,
      management: values.management,
      paymentForm: values.paymentForm,
      practiceHour: values.practiceHour,
      rgrHour: values.rgrHour,
      semester: values.semester as SemesterType,
      studentAmount: values.studentAmount,
      studyType: values.studyType,
      subject: subjects?.find(
        (subject) => subject.subjectId.toString() === values.subjectId.toString(),
      ),
      teacher: teachers?.find(
        (teacher) => teacher.teacherId.toString() === values.teacherId?.toString(),
      ),
      DEKHour: values.DEKHour,
      totalHour: values.totalHour,
    };

    // updateItem(createDto, loadItem?.id || 0);

    api.put(`/load/${loadItem?.id}`, createDto).then((res) =>
      res.status === 200
        ? toast({
            title: 'Навантаження успішно оновлено',
            variant: 'success',
          })
        : toast({
            title: 'Помилка під час оновлення навантаження',
            variant: 'destructive',
          }),
    );
    onOpenChange(false);
  };

  useEffect(() => {
    if (loadItem) {
      form.reset({
        cathedra: loadItem.cathedra,
        consultHour: loadItem.consultHour,
        controlWorkHour: loadItem.controlWorkHour,
        course: loadItem.course,
        courseProjectHour: loadItem.courseProjectHour,
        courseWorkHour: loadItem.courseWorkHour,
        creditHour: loadItem.creditHour,
        dkrHour: loadItem.dkrHour,
        examHour: loadItem.examHour,
        groupId: loadItem.group?.groupId,
        labHour: loadItem.labHour,
        lectureHour: loadItem.lectureHour,
        management: loadItem.management,
        paymentForm: loadItem.paymentForm,
        practiceHour: loadItem.practiceHour,
        rgrHour: loadItem.rgrHour,
        semester: loadItem.semester,
        studentAmount: loadItem.studentAmount,
        studyType: loadItem.studyType,
        subjectId: loadItem?.subject?.subjectId,
        teacherId: loadItem?.teacher?.teacherId,
        DEKHour: loadItem.DEKHour,
        totalHour: loadItem.totalHour,
      });
    } else {
      form.reset();
    }
  }, [isOpen, loadItem]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Змінити навантаження</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="flex gap-10 items-start">
            <div className="flex flex-col gap-4">
              <p>Форма оплати: {loadItem?.paymentForm}</p>
              <p>Форма навчання: {loadItem?.studyType}</p>
              <p>
                Дисципліна:{' '}
                {subjects?.find(
                  (subject) =>
                    subject.subjectId.toString() === loadItem?.subject?.subjectId.toString(),
                )?.fullName || 'Знайти дисципліну'}
              </p>

              <FormField
                name="teacherId"
                control={form.control}
                render={({ field: { onChange } }) => (
                  <FormItem>
                    <FormLabel>Викладач</FormLabel>
                    <FormControl>
                      <Select onValueChange={(value) => onChange(value)}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue
                            placeholder={
                              teachers?.find(
                                (teacher) =>
                                  teacher.teacherId.toString() ===
                                  loadItem?.teacher?.teacherId.toString(),
                              )?.initials || 'Оберіть викладача'
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

              <p>
                Група:{' '}
                {groups?.find(
                  (group) => group.groupId.toString() === loadItem?.group?.groupId.toString(),
                )?.groupName || 'Оберіть групу'}
              </p>

              <p>Курс: {loadItem?.course}</p>
              <p>Семестр: {loadItem?.semester}</p>

              <p>Кількість студентів: {loadItem?.studentAmount}</p>
              <p>Лекції: {loadItem?.lectureHour}</p>
              <p>Практичні: {loadItem?.practiceHour}</p>
              <p>Лабораторні: {loadItem?.labHour}</p>

              <p>Іспит: {loadItem?.examHour}</p>
              <p>Заліки: {loadItem?.creditHour}</p>
              <p>Курсові роботи: {loadItem?.courseWorkHour}</p>
              <p>Курсові роботи: {loadItem?.courseProjectHour}</p>

              <p>РГР, РР, ГР: {loadItem?.rgrHour}</p>
              <p>ДКР: {loadItem?.dkrHour}</p>
              <p>Контрольні роботи: {loadItem?.controlWorkHour}</p>
              <p>Консультації: {loadItem?.consultHour}</p>
            </div>
            <div className="flex flex-col gap-4">
              <FormField
                name="management.practice"
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
                name="management.bachelor"
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
                name="management.masterPractice"
                control={form.control}
                render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <FormLabel>Керівництво магістрами Пр</FormLabel>
                    <FormControl>
                      <Input value={value} onChange={(value) => onChange(value)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="management.masterScience"
                control={form.control}
                render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <FormLabel>Керівництво магістрами Н</FormLabel>
                    <FormControl>
                      <Input value={value} onChange={(value) => onChange(value)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="management.postgraduate"
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
                name="DEKHour"
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
          </form>
        </Form>
        <DialogFooter>
          <Button type="button" onClick={form.handleSubmit(onSubmit)}>
            Підтвердити
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LoadForm;

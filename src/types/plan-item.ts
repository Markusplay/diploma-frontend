import type { Group } from './group.ts';
import type { Management } from './management.ts';
import type { Subject } from './subject.ts';
import type { Teacher } from './teacher.ts';
import type { PaymentForm, StudyType } from './enums';
import type { CourseType, SemesterType } from './types';

export type PlanItem = {
  id: string;
  paymentForm: PaymentForm; // форма оплати
  studyType: StudyType; // вид навчання
  subject?: Subject;
  cathedra: string; // кафедра
  course: CourseType; // курс
  semester: SemesterType; // семестр
  teacher?: Teacher; // викладач
  group?: Group; // група

  studentAmount: number; // кількість студентів
  lectureHour: number; // години лекцій
  practiceHour: number; // години практик
  labHour: number; // години лабораторних
  consultHour: number; // години консультацій
  controlWorkHour: number; // години модульних робіт
  dkrHour: number; // години ДКР
  rgrHour: number; // години РГР
  examHour: number; // години іспитів

  courseWorkHour: number; // години курсових
  courseProjectHour: number; // години курсових проектів
  creditHour: number; // години заліків
  // abstractHour: number; // години рефератів
  // diplomaPracticalHour: number; // години практичних дипломів

  management: Management; // управління

  DEKHour: number; // години ДЕК
  totalHour: number; // загальна кількість годин
};

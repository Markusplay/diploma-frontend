import type { GroupType } from './GroupType';
import type { ManagementType } from './ManagementType';
import type { SubjectType } from './SubjectType';
import type { Teacher } from './Teacher';
import type { PaymentForm, StudyType } from './enums';
import type { CourseType, SemesterType } from './types';

export type LoadType = {
  id: string;
  paymentForm: PaymentForm; // форма оплати
  studyType: StudyType; // вид навчання
  subject?: SubjectType;
  cathedra: string; // кафедра
  course: CourseType; // курс
  semester: SemesterType; // семестр
  teacher?: Teacher; // викладач
  group?: GroupType; // група

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

  management: ManagementType; // управління

  DEKHour: number; // години ДЕК
  totalHour: number; // загальна кількість годин
};

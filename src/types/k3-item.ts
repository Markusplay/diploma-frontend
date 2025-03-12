import type { PaymentForm, StudyType } from './enums';
import type { CourseType, SemesterType } from './types';

export type K3Item = {
  paymentForm: PaymentForm;
  subjectId: string;
  cathedra: string;
  course: CourseType;
  groupId: string;
  studyType: StudyType;
  semester: SemesterType;
  disciplineVolume: number;
  lectures: number;
  practicals: number;
  labs: number;
  individualLessons: number;
  hasExam: boolean;
  hasCredit: boolean;
  hasControlWork: boolean;
  courseProject: number;
  courseWork: number;
  rgr: number;
  dkr: number;
  abstract: number;
  academicBudget: number;
  subgroupsForPZ: number;
  subgroupsForLabs: number;
  academicContract: number;
  bValue: number;
  kValue: number;
  bkValue: number;
  kkValue: number;
  streamsAmount: number;
};

export type K3ItemTypeWithId = K3Item & { id: string };

import type { PaymentForm, StudyType } from '@/types/enums.ts';
import type { CourseType, SemesterType } from '@/types/types.ts';

export interface Workload {
  id?: string;
  paymentForm: PaymentForm;
  course: CourseType;
  studyType: StudyType;
  cathedra: string;
  semester: SemesterType;
  lectureHour: number;
  practiceHour: number;
  labHour: number;
  individualLessons: number;
  consultHour: number;
  dkrHour: number;
  rgrHour: number;
  disciplineVolume: number;

  hasExam: boolean;
  hasCredit: boolean;
  hasControlWork: boolean;

  courseWorkHour: number;
  courseProjectHour: number;
  managementPractice: number;
  managementBachelor: number;
  managementMasterPractice: number;
  managementMasterScience: number;
  managementPostgraduate: number;
  dekHour: number;
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

  groupId: number;
  subjectId: number;
  teacherId: number;
}

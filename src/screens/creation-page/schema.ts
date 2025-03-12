import { z } from 'zod';
import { PaymentForm, StudyType } from '@/types/enums.ts';

export const formSchema = z.object({
  subjectId: z.string({ message: 'Оберіть дисципліну' }),
  groupId: z.string({ message: 'Оберіть групу' }),
  teacherId: z.string({ message: 'Оберіть викладача' }),

  disciplineVolume: z.coerce.number({ message: 'Введіть обсяг дисципліни' }),
  course: z.coerce.number({ message: 'Оберіть курс' }).min(1, { message: 'Оберіть курс' }),
  semester: z.coerce.number({ message: 'Оберіть семестр' }).min(1, { message: 'Оберіть семестр' }),

  lectureHour: z.coerce.number().default(0),
  practiceHour: z.coerce.number().default(0),
  labHour: z.coerce.number().default(0),
  consultHour: z.coerce.number().default(0),
  individualLessons: z.coerce.number().default(0),

  dkrHour: z.coerce.number().default(0),
  rgrHour: z.coerce.number().default(0),

  hasExam: z.boolean().default(false),
  hasCredit: z.boolean().default(false),
  hasControlWork: z.boolean().default(false),

  courseWorkHour: z.coerce.number().default(0),
  courseProjectHour: z.coerce.number().default(0),

  managementPractice: z.coerce.number().default(0),
  managementBachelor: z.coerce.number().default(0),
  managementMasterPractice: z.coerce.number().default(0),
  managementMasterScience: z.coerce.number().default(0),
  managementPostgraduate: z.coerce.number().default(0),

  abstract: z.coerce.number().default(0),
  academicBudget: z.coerce.number().default(0),
  subgroupsForPZ: z.coerce.number().default(0),
  subgroupsForLabs: z.coerce.number().default(0),
  academicContract: z.coerce.number().default(0),
  bValue: z.coerce.number().default(0),
  kValue: z.coerce.number().default(0),
  bkValue: z.coerce.number().default(0),
  kkValue: z.coerce.number().default(0),
  streamsAmount: z.coerce.number().default(0),

  dekHour: z.coerce.number().default(0),

  cathedra: z.string().default('ІСТ'),

  paymentForm: z.enum([PaymentForm.budget, PaymentForm.contract], {
    message: 'Оберіть форму оплати',
  }),
  studyType: z.enum([StudyType.fulltime, StudyType.extramural, StudyType.foreign], {
    message: 'Оберіть форму навчання',
  }),
});

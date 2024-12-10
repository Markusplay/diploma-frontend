import { PaymentForm, StudyType } from '../../types/enums';
import { z } from 'zod';

const formSchema = z.object({
  subjectId: z.string({ message: 'Оберіть дисципліну' }),
  groupId: z.string({ message: 'Оберіть групу' }),

  disciplineVolume: z.coerce.number({ message: 'Введіть обсяг дисципліни' }),
  course: z.coerce.number({ message: 'Оберіть курс' }).min(1, { message: 'Оберіть курс' }),
  semester: z.coerce.number({ message: 'Оберіть семестр' }).min(1, { message: 'Оберіть семестр' }),

  lectures: z.coerce.number().default(0),
  practicals: z.coerce.number().default(0),
  labs: z.coerce.number().default(0),
  individualLessons: z.coerce.number().default(0),

  exams: z.boolean().default(false),
  credits: z.boolean().default(false),
  controlWork: z.boolean().default(false),

  courseProject: z.coerce.number().default(0),
  courseWork: z.coerce.number().default(0),
  rgr: z.coerce.number().default(0),
  dkr: z.coerce.number().default(0),
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

  paymentForm: z.enum([PaymentForm.budget, PaymentForm.contract], {
    message: 'Оберіть форму оплати',
  }),
  studyType: z.enum([StudyType.fulltime, StudyType.extramural, StudyType.foreign], {
    message: 'Оберіть форму навчання',
  }),
});

export default formSchema;

import { PaymentForm, StudyType } from '../../types/enums';
import { z } from 'zod';

const PaymentFormSchema = z.nativeEnum(PaymentForm);
const StudyTypeSchema = z.nativeEnum(StudyType);

const formSchema = z.object({
  paymentForm: PaymentFormSchema,
  studyType: StudyTypeSchema,
  subjectId: z.any(),
  cathedra: z.string(),
  course: z.coerce.number().default(0),
  semester: z.coerce.number().default(0),
  teacherId: z.any(),
  groupId: z.any(),

  studentAmount: z.coerce.number().default(0),
  lectureHour: z.coerce.number().default(0),
  practiceHour: z.coerce.number().default(0),
  labHour: z.coerce.number().default(0),
  consultHour: z.coerce.number().default(0),
  controlWorkHour: z.coerce.number().default(0),
  dkrHour: z.coerce.number().default(0),
  rgrHour: z.coerce.number().default(0),
  examHour: z.coerce.number().default(0),

  courseWorkHour: z.coerce.number().default(0),
  courseProjectHour: z.coerce.number().default(0),
  creditHour: z.coerce.number().default(0),

  management: z.object({
    practice: z.coerce.number().default(0),
    bachelor: z.coerce.number().default(0),
    masterPractice: z.coerce.number().default(0),
    masterScience: z.coerce.number().default(0),
    postgraduate: z.coerce.number().default(0),
  }),

  DEKHour: z.coerce.number().default(0),
  totalHour: z.coerce.number().default(0),
});

export default formSchema;

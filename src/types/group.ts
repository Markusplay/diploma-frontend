import type { PaymentForm } from './enums';
import type { CourseType } from './types';

export type Group = {
  groupId: number;
  course: CourseType;
  groupName: string;
  paymentForm: PaymentForm;
  budgetPlaces: number;
  contractPlaces: number;
  foreignPlaces: number;
};

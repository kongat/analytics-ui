import {  MetricModel } from "./metric.model";
import { UserModel } from "./user.model";

export interface EmployeeModel {
  id: string
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: 'MALE' | 'FEMALE'| 'OTHER';
  status: 'ACTIVE' | 'OFFLINE';
  metrics: MetricModel[]
  userId: string;
  emergency: string;
}

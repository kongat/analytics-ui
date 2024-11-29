import {  MetricModel } from "./metric.model";
import { UserModel } from "./user.model";

export interface EmployeeModel {
  employeeId: string
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: 'MALE' | 'FEMALE';
  status: 'ACTIVE' | 'OFFLINE';
  metrics: MetricModel[]
  userId: string;
  emergency: string;
}

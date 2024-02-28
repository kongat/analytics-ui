import {  MetricModel } from "./metric.model";

export interface EmployeeModel {
  id: string
  firstName: string;
  lastName: string;
  birthdate: Date;
  gender: 'MALE' | 'FEMALE'| 'OTHER';
  status: 'ACTIVE' | 'OFFLINE';
  metrics: MetricModel[]
}

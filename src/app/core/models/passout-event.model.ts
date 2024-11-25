import { EmployeeModel } from "./employee.model";

export interface PassoutEvent{
  employeeId: string;
  createdAt: Date;
  value: boolean;
  Employee?: EmployeeModel;
}

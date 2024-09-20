import { EmployeeModel } from "./employee.model";

export interface UserModel {
  username: string;
  userId: string;
  createdAt: Date;
  // firstName: string;
   role: 'ADMIN' | 'EMPLOYEE' | 'MANAGER';
   employee: EmployeeModel
}






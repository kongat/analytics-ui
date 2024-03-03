import { EmployeeModel } from "./employee.model";

export interface UserModel {
  username: string;
  id: string;
  createdAt: Date;
  // firstName: string;
   role: 'ADMIN' | 'EMPLOYEE' | 'MANAGER';
   employee: EmployeeModel
}






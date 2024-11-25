import { EmployeeModel } from "./employee.model";
import { PassoutEvent } from "./passout-event.model";

export interface SosEvent{
  employeeId: string;
  createdAt: Date;
  value: boolean;
  Employee?: EmployeeModel;
}

export interface NotificationEvent{
  data: SosEvent | PassoutEvent;
  type: "sos" | "passout"
}

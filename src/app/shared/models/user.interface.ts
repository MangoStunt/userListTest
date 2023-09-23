import {UserType} from "../enums/user-type.enum";

export interface IUserInterface {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  userType: UserType
}

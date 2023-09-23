import {UserType} from "../../shared/enums/user-type.enum";
import {IUserInterface} from "../../shared/models/user.interface";

interface IBeConstants {
  localStorageKey: string;
  defaultUsersList: IUserInterface[]
}
export const BE_CONSTANTS: IBeConstants = {
  localStorageKey: 'users-list-data',
  defaultUsersList: [
    {
      id: 1,
      username: 'pineapple23',
      firstName: 'Ivan',
      lastName: 'Sichko',
      email: 'pineapple23@gmail.com',
      password: 'Qwerty12345',
      userType: UserType.DRIVER,
    },
    {
      id: 2,
      username: 'mangoCat',
      firstName: 'Vlad',
      lastName: 'Krasovski',
      email: 'mango.rules@outlook.com',
      password: 'QazwSxedC123456',
      userType: UserType.ADMIN,
    },
    {
      id: 3,
      username: 'appleJean',
      firstName: 'Jean',
      lastName: 'Curry',
      email: 'jean1985@gmail.com',
      password: 'Qwerty!2134',
      userType: UserType.DRIVER,
    },
  ]
}

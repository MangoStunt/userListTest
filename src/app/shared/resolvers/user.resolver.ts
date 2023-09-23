import { ResolveFn } from '@angular/router';
import {IUserInterface} from "../models/user.interface";
import {filter, Observable, take} from "rxjs";
import {UserService} from "../../services/user.service";
import {inject} from "@angular/core";

export const userResolver: ResolveFn<IUserInterface> = (
  route,
  state,
  userService: UserService = inject(UserService)
): Observable<IUserInterface> => {
  return userService.getUser(route.paramMap.get('id'))
    .pipe(
      filter<IUserInterface>((user: IUserInterface) => !!user),
      take(1)
    )
};

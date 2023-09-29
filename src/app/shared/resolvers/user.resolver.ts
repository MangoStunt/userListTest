import {ResolveFn, Router} from '@angular/router';
import {IUserInterface} from "../models/user.interface";
import {catchError, EMPTY, filter, Observable, take} from "rxjs";
import {UserService} from "../../services/user.service";
import {inject} from "@angular/core";

export const userResolver: ResolveFn<IUserInterface> = (
  route,
  state,
  userService: UserService = inject(UserService),
  router: Router = inject(Router)
): Observable<IUserInterface> => {
  return userService.getUser(route.paramMap.get('id'))
    .pipe(
      filter<IUserInterface>((user: IUserInterface) => !!user),
      take(1),
      catchError(err => {
        router.navigate(['404'], {queryParams: {type: '403', message: 'User not found'}})
        return EMPTY
      })
    )
};

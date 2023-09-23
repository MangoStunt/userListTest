import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {IUserInterface} from "../shared/models/user.interface";
import {environment} from "../shared/environment";
import {BehaviorSubject, Observable, tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  notify: BehaviorSubject<boolean> = new BehaviorSubject(false)
  constructor(
    private router: Router,
    private http: HttpClient
  ) { }

  public getUserList(): Observable<IUserInterface[]> {
    return this.http.get<IUserInterface[]>(`${environment.apiUrl}/users`)
  }

  public addUser(userData: IUserInterface) {
    return this.http.post(`${environment.apiUrl}/user/add`, userData).pipe(tap(() => this.notify.next(true)))
  }

  public getUser(userId: string | null): Observable<IUserInterface> {
    return this.http.get<IUserInterface>(`${environment.apiUrl}/user/${userId}`)
  }

  public updateUser(userId: string | number, userData: Partial<IUserInterface>) {
    return this.http.put(`${environment.apiUrl}/user/${userId}`, userData).pipe(tap(() => this.notify.next(true)))
  }

  public deleteUser(userId: string | number) {
    return this.http.delete(`${environment.apiUrl}/user/${userId}`).pipe(tap(() => this.notify.next(true)))
  }
}

import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from "@angular/common/http";
import {delay, Observable, of} from "rxjs";
import {IUserInterface} from "../app/shared/models/user.interface";
import {BE_CONSTANTS} from "./shared/constants";
import {error} from "@angular/compiler-cli/src/transformers/util";

let usersData: IUserInterface[] = JSON.parse(localStorage.getItem(BE_CONSTANTS.localStorageKey)!) || BE_CONSTANTS.defaultUsersList
@Injectable()
export class BackendInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const {url, method, body} = req

    return handleRoute()

    function handleRoute() {
      switch (true) {
        case url.endsWith('/users') && method === 'GET':
          return getUsersList()
        case url.endsWith('/user/add') && method === 'POST':
          return addNewUser()
        case url.match(/\/user\/\d+$/) && method === 'GET':
          return getUserById()
        case url.match(/\/user\/\d+$/) && method === 'PUT':
          return updateUser()
        case url.match(/\/user\/\d+$/) && method === 'DELETE':
          return removeUser()
        default:
          return next.handle(req)
      }
    }

    function getUsersList() {
      return resOk(usersData.map(u => tableUserData(u)))
    }

    function addNewUser() {
      const newUser = body

      if (usersData.find(u => u.username === newUser.username)) return error(`Username: ${newUser.username} has already been taken. Choose another one, please`)
      if (usersData.find(u => u.email === newUser.email)) return error(`Email address: ${newUser.username} has already been taken. Choose another one, please`)

      newUser.id = usersData.length ? Math.max(...usersData.map(u => u.id)) + 1 : 1
      usersData.push(newUser)
      localStorage.setItem(BE_CONSTANTS.localStorageKey, JSON.stringify(usersData))
      return resOk()
    }

    function getUserById() {
      const user = usersData.find(u => u.id === getLinkId())
      return resOk(user)
    }

    function updateUser() {
      const updatedUser = body
      const user = usersData.find(u => u.id === getLinkId())

      if (!user) {
        return error(`User with Id: ${getLinkId()} doesn't found`)
      } else {
        Object.assign(user, updatedUser)
      }

      localStorage.setItem(BE_CONSTANTS.localStorageKey, JSON.stringify(usersData))

      return resOk()
    }

    function removeUser() {
      usersData = usersData.filter(u => u.id !== getLinkId())
      localStorage.setItem(BE_CONSTANTS.localStorageKey, JSON.stringify(usersData))

      return resOk()
    }

    function resOk(body?: any) {
      return of(new HttpResponse({status: 200, body})).pipe(delay(500))
    }

    function tableUserData(user: IUserInterface) {
      const {id, username, firstName, lastName, email, userType} = user
      return {id, username, firstName, lastName, email, userType}
    }

    function getLinkId(): number {
      const splitUrl = url.split('/')
      return +splitUrl[splitUrl.length - 1]
    }
  }
}

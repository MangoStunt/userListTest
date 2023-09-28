import {
  HttpHandler,
  HttpRequest,
  HttpResponse
} from "@angular/common/http";
import {of, throwError} from "rxjs";
import {IUserInterface} from "../shared/models/user.interface";
import {BE_CONSTANTS} from "./shared/constants";

let usersData: IUserInterface[] = JSON.parse(localStorage.getItem(BE_CONSTANTS.localStorageKey)!) || BE_CONSTANTS.defaultUsersList
export function BackendInterceptor(req: HttpRequest<any>, next: HttpHandler) {
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
        return deleteUser()
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

    if (!user) {
      return error('Can`t find user with such id')
    }

    return resOk(user)
  }

  function updateUser() {
    const updatedUser = body
    const user = usersData.find(u => u.id === getLinkId())

    //Do this if you want to test error messaging
    // const user = undefined

    if (!user) {
      return error(`User with Id: ${getLinkId()} doesn't found`)
    } else {
      Object.assign(user, updatedUser)
    }

    localStorage.setItem(BE_CONSTANTS.localStorageKey, JSON.stringify(usersData))

    return resOk()
  }

  function deleteUser() {
    usersData = usersData.filter(u => u.id !== getLinkId())

    if (!usersData.length) {
      return error('Some error occurred while deleting the user')
    } else {
      localStorage.setItem(BE_CONSTANTS.localStorageKey, JSON.stringify(usersData))

      return resOk()
    }
  }

  function resOk(body?: any) {
    return of(new HttpResponse({status: 200, body}))
  }

  function error(message: string) {
    return throwError(() => ({error: {message}}))
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

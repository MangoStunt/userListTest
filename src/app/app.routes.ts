import {Routes} from "@angular/router";
import {userResolver} from "./shared/resolvers/user.resolver";

export const APP_ROUTES: Routes = [
  {
    path: '**',
    redirectTo: ''
  },
  {
    path: '',
    loadComponent: () => import('./components/user-list/user-list.component').then(m => m.UserListComponent)
  },
  {
    path: 'user',
    loadComponent: () => import('./components/user-form/user-form.component').then(m => m.UserFormComponent),
    outlet: 'userForm'
  },
  {
    path: 'user/:id',
    loadComponent: () => import('./components/user-form/user-form.component').then(m => m.UserFormComponent),
    outlet: 'userForm',
    resolve: {user: userResolver}
  }
  ]

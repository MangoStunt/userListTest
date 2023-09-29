import {Routes} from "@angular/router";
import {userResolver} from "./shared/resolvers/user.resolver";

export const APP_ROUTES: Routes = [
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
  },
  {
    path: '**',
    redirectTo: '/404',
    outlet: 'userForm'
  },
  {
    path: '**',
    redirectTo: '/404'
  },
  {
    path: '404',
    loadComponent: () => import('./components/not-found/not-found.component').then(m => m.NotFoundComponent),
    data: {}
  },
  ]

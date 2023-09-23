import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router, RouterModule} from "@angular/router";
import {UserService} from "../../services/user.service";
import {Observable} from "rxjs";
import {IUserInterface} from "../../shared/models/user.interface";

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  usersList$?: Observable<IUserInterface[]>
  constructor(
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.usersList$ = this.userService.getUserList()
  }
}

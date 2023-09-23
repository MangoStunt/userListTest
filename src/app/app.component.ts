import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {UserService} from "./services/user.service";

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [
    RouterOutlet,
  ],
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'testUserList';

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.notify.next(true)
  }
}

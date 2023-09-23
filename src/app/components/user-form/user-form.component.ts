import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IUserInterface} from "../../shared/models/user.interface";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {UserService} from "../../services/user.service";
import {first} from "rxjs";

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  public user!: IUserInterface | undefined;
  public error = false
  public userForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private userService: UserService
  ) {
  }

  ngOnInit() {
    this.route.data.subscribe(({user}) => {
      this.user = user
    })

    this.userForm = new FormGroup({
      'username': new FormControl(this.user?.username || '', Validators.required),
      'firstName': new FormControl(this.user?.firstName || '', Validators.required),
      'lastName': new FormControl(this.user?.lastName || '', Validators.required),
      'email': new FormControl(this.user?.email || '', Validators.required),
      'userType': new FormControl(this.user?.userType || '', Validators.required),
      'password': new FormControl(this.user?.password || '', Validators.required),
      'passwordRepeat': new FormControl('', Validators.required)
    })
  }

  onSubmit() {
    if (this.userForm.invalid) {
      return
    }

    if (this.user) {
      this.userService.updateUser(this.user.id, this.userForm.value)
        .pipe(first())
        .subscribe({
          next: () => {
            this.router.navigate(['', {outlets: {userForm: null}}])
          },
          error: e => {
            //something here
          }
        })
    } else {
      this.userService.addUser(this.userForm.value)
        .pipe(first())
        .subscribe({
          next: () => {
            this.router.navigate(['', {outlets: {userForm: null}}]).then(i => alert(`User ${this.userForm.get('username')?.value} added`))
          },
          error: e => {
            //error handling
          }
        })
    }
  }

  onDelete() {
    if (this.user) {
      this.userService.deleteUser(this.user.id)
        .subscribe({
          next: () => {
            this.router.navigate(['', {outlets: {userForm: null}}]).then(i => alert(`User ${this.userForm.get('username')?.value} added`))
          },
          error: e => {
            //error handling
          }
        })
    }
  }
}

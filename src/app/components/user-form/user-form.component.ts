import {Component, OnInit} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {IUserInterface} from "../../shared/models/user.interface";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {UserService} from "../../services/user.service";
import {first} from "rxjs";
import {UserType} from "../../shared/enums/user-type.enum";
import {CustomValidators} from "../../shared/validators/user-form.validators";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgOptimizedImage, RouterLink],
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
    private alert: ToastrService,
    private customValidators: CustomValidators,
    private userService: UserService,
  ) {
  }

  ngOnInit() {
    this.route.data.subscribe(({user}) => {
      this.user = user


    this.userForm = new FormGroup({
        'username': new FormControl(this.user?.username || '', [Validators.required, this.customValidators.uniqueUsernameValidator(this.user?.username || null)]),
        'firstName': new FormControl(this.user?.firstName || '', Validators.required),
        'lastName': new FormControl(this.user?.lastName || '', Validators.required),
        'email': new FormControl(this.user?.email || '', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
        'userType': new FormControl(this.user?.userType || '', Validators.required),
        'password': new FormControl(this.user?.password || '', [Validators.required, Validators.pattern("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$")]),
        'passwordRepeat': new FormControl('', Validators.required)
      },
      this.customValidators.matchFieldsValidator('password', 'passwordRepeat'))
    })
  }

  onSubmit() {
    if (this.userForm.invalid) {
      Object.keys(this.userForm.controls).forEach(key => {
        this.userForm.get(key)!.markAsTouched();
      })

      return
    }

    if (this.user) {
      this.userService.updateUser(this.user.id, this.userForm.value)
        .pipe(first())
        .subscribe({
          next: () => {
            this.router.navigate(['', {outlets: {userForm: null}}])
            this.alert.success(`User ${this.userForm.get('username')?.value} was updated`, '', {toastClass: 'custom-alert__success'})
          },
          error: e => {
            this.alert.error(e.error.message || 'Error', '', {toastClass: 'custom-alert__error', positionClass: 'toast-top-left'})
          }
        })
    } else {
      this.userService.addUser(this.userForm.value)
        .pipe(first())
        .subscribe({
          next: () => {
            this.router.navigate(['', {outlets: {userForm: null}}])
            this.alert.success(`User ${this.userForm.get('username')?.value} was added`, '', {toastClass: 'custom-alert__success'})
          },
          error: e => {
            this.alert.error(e.error.message || 'Error', '', {toastClass: 'custom-alert__error', positionClass: 'toast-top-left'})
          }
        })
    }
  }

  onDelete() {
    if (this.user) {
      this.userService.deleteUser(this.user.id)
        .subscribe({
          next: () => {
            this.router.navigate(['', {outlets: {userForm: null}}])
            this.alert.success(`User ${this.user?.username} was deleted`, '', {toastClass: 'custom-alert__success'})
          },
          error: e => {
            this.alert.error(e.error.message || 'Error', '', {toastClass: 'custom-alert__error', positionClass: 'toast-top-left'})
          }
        })
    }
  }

  get usernameControl() {
    return this.userForm.get('username')
  }

  get firstNameControl() {
    return this.userForm.get('firstName')
  }

  get lastNameControl() {
    return this.userForm.get('lastName')
  }

  get emailControl() {
    return this.userForm.get('email')
  }

  get userTypeControl() {
    return this.userForm.get('userType')
  }

  get passwordControl() {
    return this.userForm.get('password')
  }

  get matchPasswordControl() {
    return this.userForm.get('passwordRepeat')
  }

  public getUsernameError() {
    //@ts-ignore
    const control: AbstractControl = this.usernameControl
    if (control.touched) {
      return control.hasError('required')
        ? 'Username is required'
        : control.hasError('nameTaken')
          ? 'This username is already taken'
          : ''
    }

    return ''
  }

  public getEmailError() {
    //@ts-ignore
    const control: AbstractControl = this.emailControl
    if (control.touched) {
      return control.hasError('required')
        ? 'Email is required'
        : control.hasError('pattern')
          ? 'Email should be real'
          : ''
    } else {
      return ''
    }
  }

  public getPasswordError() {
    //@ts-ignore
    const control: AbstractControl = this.passwordControl
    if (control.touched) {
      return control.hasError('required')
        ? 'Password is required'
        : control.hasError('pattern')
          ? 'Password must contain at least 8 characters and include 1 number, 1 title and 1 small letter'
          : ''
    } else {
      return ''
    }
  }

  public getPasswordMatchError() {
    //@ts-ignore
    const control: AbstractControl = this.matchPasswordControl
    //@ts-ignore
    const matchControl: AbstractControl = this.passwordControl
    if (control.touched && matchControl.touched && matchControl.valid) {
      return control.hasError('required')
        ? 'Password is required'
        : control.hasError('matchField')
          ? 'Two passwords don`t match'
          : ''
    } else {
      return ''
    }
  }


  protected readonly UserType = UserType;
}

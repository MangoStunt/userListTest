import {AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn} from "@angular/forms";
import {Injectable} from "@angular/core";
import {first, map} from "rxjs";
import {IUserInterface} from "../models/user.interface";
import {UserService} from "../../services/user.service";

@Injectable({
  providedIn: "root"
})
export class CustomValidators {
  public userNameList!: string[];

  constructor(private userService: UserService) {
    this.userService.getUserList()
      .pipe(
        first(),
        map(userArr =>
          this.userNameList = userArr.map(user => user.username)))
      .subscribe()
  }

  public uniqueUsernameValidator(username: string | null = null): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      let isNameTaken = true;

      console.log(username)

      if (username) {
        isNameTaken = !!(control.value !== null && this.userNameList.find(name => control.value !== name && control.value === username))
      } else {
        isNameTaken = !(control.value !== null && this.userNameList.find(name => control.value !== name))
      }

      return isNameTaken ? {nameTaken: true} : null
    }
  }

  public matchFieldsValidator(controlName: string, matchControlName: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const control = formGroup.get(controlName)
      const matchControl = formGroup.get(matchControlName)

      if (!control || !matchControl) return null

      if (control.errors && !control.errors["matchField"] || matchControl.errors) return null

      if (control.value !== matchControl!.value) {
        matchControl.setErrors({matchField: true})
        return {matchField: true}
      } else {
        matchControl.setErrors(null)
        return null
      }
    }
  }
}

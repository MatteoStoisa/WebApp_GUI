import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";
import {FormControl, Validators, FormGroup} from '@angular/forms';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { of } from 'rxjs';

import {AuthService} from '../auth.service'

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.css']
})
export class LoginDialogComponent implements OnInit {

  loginForm: FormGroup;
  authSub: Subscription;
  isAuthenticated: boolean;

  constructor(  public dialogRef: MatDialogRef<LoginDialogComponent>,
                private authService: AuthService){}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }

  ngOnDestroy(): void {
    if(this.authSub)
      this.authSub.unsubscribe();
  }

  closeLoginDialog() {
    this.dialogRef.close("closed");
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    console.log(this.loginForm.value);
    if(this.authSub)
      this.authSub.unsubscribe();
    console.log("try login:");
    this.authSub = this.authService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe(val => {
      if(val.hasOwnProperty("accessToken")) {
        this.dialogRef.close("success!");
      }           
    });
  }

}

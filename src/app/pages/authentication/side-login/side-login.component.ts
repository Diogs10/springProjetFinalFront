import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-side-login',
  standalone: true,
  imports: [
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    CommonModule,
  ],
  templateUrl: './side-login.component.html',
})
export class AppSideLoginComponent implements OnInit {
  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private _authService: AuthService
  ) {

  }
  passwordVisible: boolean = false
  displayBadCredentialsError: boolean = false;
  isLoading: boolean = false
  emailPattern: string = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$';
  togglePasswordVisibility(){
    this.passwordVisible = !this.passwordVisible;
  }

  signInForm:FormGroup;

  ngOnInit(): void {
      this.signInForm = this.formBuilder.group({
        username: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required]),
      });
  }

  get username(){
    return this.signInForm.get('username');
  }

  get password(){
    return this.signInForm.get('password');
  }

  checkValidity(){
    this.signInForm.markAllAsTouched()
    if (!this.signInForm.valid) {
      return;
    }else{
      this.submit()
    }
  }
  submit() {
    this.isLoading = true;
    this._authService.signIn(this.signInForm.value).subscribe({
      next:(response)=>{
        console.log('response', response);
        if(response['statusCode'] === 200) {
          this.isLoading = false
          this._authService.setItemInlocalStorage("user",response.data);
          this._authService.setItemInlocalStorage("access_token",response.data.accessToken);
          this.router.navigate(['/dashboard'])
        }
      },
      error:(error)=>{
        this.displayBadCredentialsError = true;
        this.isLoading = false
      }
    })
  }
}

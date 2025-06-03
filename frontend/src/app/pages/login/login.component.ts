import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm!: FormGroup;

  constructor(
      private authService: AuthService,
      private router: Router,
      private formBuilder: FormBuilder
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  login(dataLogin: any) {
    this.authService.login(dataLogin).subscribe({
      next: (response: any) => {
        alert('Credentials are correct!');
        console.log('Success: ', response);
        localStorage.setItem('token', response.access_token);
        this.router.navigateByUrl('home');
      },
      error: (error: any) => {
        alert('Invalid username or password.');
        console.log('Error: ', error);
        localStorage.removeItem('token');
      },
      complete: () => {
        console.log('Completed');
      }
    });
  }

  submit() {
    if (this.loginForm.valid) {
      console.log('Form data: ', this.loginForm.value);
      this.login(this.loginForm.value);
    } else {
      alert('All fields are required');
    }
  }
}
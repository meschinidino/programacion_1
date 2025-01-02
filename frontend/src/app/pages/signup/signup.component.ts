import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  name: string = '';
  last_name: string = '';
  email: string = '';
  password: string = '';
  phone_number: string = '';
  address: string = '';

  constructor(
      private router: Router,
      private authService: AuthService
  ) {}

  signup() {
    const signupData = {
      name: this.name,
      last_name: this.last_name,
      email: this.email,
      password: this.password,
      phone_number: this.phone_number,
      address: this.address,
      role: 'Guest'
    };

    this.authService.signup(signupData).subscribe({
      next: (response: any) => {
        alert('Signup successful! Please log in with your credentials.');
        this.router.navigate(['/login']);
      },
      error: (error: any) => {
        alert('Signup failed.');
        console.error('Error:', error);
      }
    });
  }
}
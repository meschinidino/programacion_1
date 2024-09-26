import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  mobile: string = '';

  constructor(private router: Router) {}

  signup() {
    // Implement signup logic here
    // For example, send the data to a backend service
    console.log('User signed up with:', this.username, this.email, this.password, this.mobile);
    this.router.navigate(['/home']); // Redirect to home page after signup
  }
}
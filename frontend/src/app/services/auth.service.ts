import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, take } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  url = 'http://127.0.0.1:5000';

  constructor(
      private httpClient: HttpClient,
      private router: Router
  ) { }

  login(dataLogin: any): Observable<any> {
    return this.httpClient.post(this.url + '/auth/login', dataLogin).pipe(take(1));
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigateByUrl('home');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
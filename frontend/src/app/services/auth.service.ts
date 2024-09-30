import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, take, tap } from 'rxjs';
import { Router } from '@angular/router';
import { LoginResponse } from './login-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = 'http://127.0.0.1:5000';

  constructor(
      private httpClient: HttpClient,
      private router: Router
  ) { }

  login(dataLogin: any): Observable<LoginResponse> {
    return this.httpClient.post<LoginResponse>(this.url + '/auth/login', dataLogin).pipe(
        take(1),
        tap(response => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('userId', response.id.toString());
        })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    this.router.navigateByUrl('home');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUser(userId: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });
    return this.httpClient.get(`${this.url}/user/${userId}`, { headers });
  }

  editUser(userId: number, userData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });
    return this.httpClient.put(`${this.url}/user/${userId}`, userData, { headers });
  }
}
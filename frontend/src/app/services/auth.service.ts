import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { take, tap, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoginResponse } from './login-response';
import { User } from '../models/user.model';
import { BookResponse } from '../models/book-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = 'http://127.0.0.1:5000';

  constructor(
      private httpClient: HttpClient,
      private router: Router
  ) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });
  }

  signup(data: any): Observable<any> {
    return this.httpClient.post(`${this.url}/auth/register`, data, { headers: this.getHeaders() });
  }

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

  getCurrentUser(userId: number): Observable<User> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });
    return this.httpClient.get<User>(`${this.url}/user/${userId}`, { headers });
  }

  editUser(userId: number, userData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });
    return this.httpClient.put(`${this.url}/user/${userId}`, userData, { headers });
  }

  getCurrentUserRole(): Observable<string> {
    const userId = parseInt(localStorage.getItem('userId') || '0', 10);
    return this.getCurrentUser(userId).pipe(
        map(user => user.role)
    );
  }

  getBooks(page: number = 1): Observable<BookResponse> {
    const headers = this.getHeaders();
    return this.httpClient.get<BookResponse>(`${this.url}/books?page=${page}`, { headers });
  }
}
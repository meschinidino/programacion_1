// user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url = 'http://127.0.0.1:5000';

  constructor(private httpClient: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
  }

  getUsers(): Observable<any> {
    return this.httpClient.get(`${this.url}/users`, { headers: this.getHeaders() });
  }

  updateUser(userId: number, userData: User): Observable<any> {
    return this.httpClient.put(`${this.url}/user/${userId}`, userData, { headers: this.getHeaders() });
  }

  createUser(userData: User): Observable<any> {
    return this.httpClient.post(`${this.url}/user`, userData, { headers: this.getHeaders() });
  }

  deleteUser(userId: number): Observable<any> {
    return this.httpClient.delete(`${this.url}/user/${userId}`, { headers: this.getHeaders() });
  }
}
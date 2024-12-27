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

  getUsers(page: number = 1): Observable<any> {
    return this.httpClient.get(`${this.url}/users?page=${page}`, { headers: this.getHeaders() });
  }

  // Método para obtener el perfil del usuario
  getUserProfile(userId:number): Observable<any> {
    return this.httpClient.get(`${this.url}/user/${userId}`, { headers: this.getHeaders() });
  }

  updateUser(userId: number, userData: User & { loans?: any[] }): Observable<any> {
    // Crear una copia del objeto userData
    const filteredUserData = { ...userData };

    // Eliminar loans si existe
    if ('loans' in filteredUserData) {
        delete filteredUserData.loans;
    }

    // Crear un nuevo objeto sin la clave role
    const { role, ...userDataWithoutRole } = filteredUserData;

    console.log('userId:', userId, 'userData:', userDataWithoutRole, 'headers:', this.getHeaders(), 'url:', `${this.url}/user/${userId}`);
    
    return this.httpClient.put(`${this.url}/user/${userId}`, userDataWithoutRole, { headers: this.getHeaders() });
  }

  createUser(userData: User): Observable<any> {
    return this.httpClient.post(`${this.url}/user`, userData, { headers: this.getHeaders() });
  }

  deleteUser(userId: number): Observable<any> {
    return this.httpClient.delete(`${this.url}/user/${userId}`, { headers: this.getHeaders() });
  }

  getAllUsers() {
    // Endpoint que retorne todos los usuarios sin paginación
    return this.httpClient.get(`${this.url}/users/all`, { headers: this.getHeaders() });
  }
}
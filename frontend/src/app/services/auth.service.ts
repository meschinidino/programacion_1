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
  private url = '/api';

  constructor(
    private httpClient: HttpClient,
    private router: Router
  ) { }

  // Método para generar encabezados con el token
  private getHeaders(): HttpHeaders {
    const token = this.getToken();
    const headersConfig: { [header: string]: string } = {
      'Content-Type': 'application/json'
    };
    if (token) {
      headersConfig['Authorization'] = `Bearer ${token}`;
    }
    return new HttpHeaders(headersConfig);
  }

  // Registro de usuarios
  signup(data: any): Observable<any> {
    return this.httpClient.post(`${this.url}/auth/register`, data, { headers: this.getHeaders() });
  }

  // Inicio de sesión
  login(dataLogin: any): Observable<LoginResponse> {
    return this.httpClient.post<LoginResponse>(`${this.url}/auth/login`, dataLogin).pipe(
      take(1),
      tap(response => {
        this.saveToken(response.token);
        this.saveUserId(response.id);
      })
    );
  }

  // Cerrar sesión
  logout(): void {
    this.clearToken();
    this.clearUserId();
    this.router.navigateByUrl('home');
  }

  // Obtener el token almacenado
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Guardar el token en localStorage
  private saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // Borrar el token de localStorage
  private clearToken(): void {
    localStorage.removeItem('token');
  }

  // Obtener el ID del usuario actual
  public getUserId(): number {
    const userId = parseInt(localStorage.getItem('userId') || '0', 10);
    console.log('User ID recuperado:', userId);
    return userId;
  }

  isAuthenticated(): boolean {
    // Cambia de 'access_token' al nombre correcto de tu token
    const token = this.getToken(); // Usa tu método existente getToken()
    console.log('Token actual:', token); // Depuración
    return !!token; // Simplifica la verificación inicialmente
  }
  

  // Guardar el ID del usuario actual en localStorage
  private saveUserId(userId: number): void {
    localStorage.setItem('userId', userId.toString());
  }

  // Borrar el ID del usuario actual de localStorage
  private clearUserId(): void {
    localStorage.removeItem('userId');
  }

  // Obtener información del usuario actual
  getCurrentUser(userId: number): Observable<User> {
    console.log('User ID para obtener información:', userId);
    return this.httpClient.get<User>(`${this.url}/user/${userId}`, { headers: this.getHeaders() });
  }

  // Editar datos del usuario actual
  editUser(userId: number, userData: any): Observable<any> {
    return this.httpClient.put(`${this.url}/user/${userId}`, userData, { headers: this.getHeaders() });
  }

  // Obtener el rol del usuario actual
  getCurrentUserRole(): Observable<string> {
    return this.getCurrentUser(this.getUserId()).pipe(
      map(user => user.role)
    );
  }

  // Obtener libros con paginación
  getBooks(page: number = 1): Observable<BookResponse> {
    return this.httpClient.get<BookResponse>(`${this.url}/books?page=${page}`, { headers: this.getHeaders() });
  }
  
}

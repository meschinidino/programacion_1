import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BookResponse } from '../models/book-response.model';

@Injectable({
    providedIn: 'root'
})
export class BookService {
    private apiUrl = 'http://localhost:5000/books'; // URL base actualizada

    constructor(private http: HttpClient) {}

    private getHeaders(): HttpHeaders {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No se encontró el token de autenticación');
        }
        return new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        });
    }

    getBooks(): Observable<BookResponse[]> {
        return this.http.get<BookResponse[]>(this.apiUrl, { headers: this.getHeaders() }).pipe(
            catchError(this.handleError)
        );
    }

    createBook(payload: any): Observable<BookResponse> {
        return this.http.post<BookResponse>(this.apiUrl, payload, { headers: this.getHeaders() }).pipe(
            catchError(this.handleError)
        );
    }

    updateBook(id: number, book: BookResponse): Observable<BookResponse> {
        return this.http.put<BookResponse>(`${this.apiUrl}/${id}`, book, { headers: this.getHeaders() }).pipe(
            catchError(this.handleError)
        );
    }

    deleteBook(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
            catchError(this.handleError)
        );
    }

    private handleError(error: any): Observable<never> {
        console.error('Ocurrió un error:', error);
        return throwError(() => new Error('Error en la solicitud, por favor intente nuevamente.'));
    }
}

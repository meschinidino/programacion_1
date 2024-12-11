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

    deleteBook(bookId: number): Observable<void> {
        const token = localStorage.getItem('token');
        
        if (!token) {
            console.error('No se encontró el token de autenticación');
            return throwError(() => new Error('No se encontró el token de autenticación'));
        }
    
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });
    
        const url = `http://127.0.0.1:5000/book/${bookId}`; // URL fija y dinámica para eliminar un libro
        console.log(`Eliminando el libro con ID: ${bookId}`);
    
        return this.http.delete<void>(url, { headers }).pipe(
            catchError(error => {
                console.error('Error al eliminar el libro:', error);
                return throwError(() => error);
            })
        );
    }
    

    private handleError(error: any): Observable<never> {
        console.error('Ocurrió un error:', error);
        return throwError(() => new Error('Error en la solicitud, por favor intente nuevamente.'));
    }
}

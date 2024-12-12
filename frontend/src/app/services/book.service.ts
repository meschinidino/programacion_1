import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BookResponse } from '../models/book-response.model';

@Injectable({
    providedIn: 'root'
})
export class BookService {
    private apiUrl = 'http://127.0.0.1:5000/books';
    private deleteUrl = 'http://127.0.0.1:5000/book';

    constructor(private http: HttpClient) {}

    private getHeaders(): HttpHeaders {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }
        return new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        });
    }

    getBooks(page: number, filters: any = {}, perPage: number = 10): Observable<any> {
        let params = new HttpParams().set('page', page.toString()).set('per_page', perPage.toString());
        Object.keys(filters).forEach(key => {
            params = params.set(key, filters[key]);
        });

        return this.http.get<any>(this.apiUrl, { params }).pipe(
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

    createAuthor(author: { name: string, last_name: string }): Observable<any> {
        const url = 'http://127.0.0.1:5000/authors';
        return this.http.post<any>(url, author, { headers: this.getHeaders() }).pipe(
            catchError(this.handleError)
        );
    }

    deleteBook(bookId: number): Observable<any> {
        return this.http.delete(`${this.deleteUrl}/${bookId}`, { headers: this.getHeaders() }).pipe(
            catchError(this.handleError)
        );
    }

    private handleError(error: any): Observable<never> {
        console.error('An error occurred:', error);
        return throwError(() => new Error('Request error, please try again.'));
    }
}
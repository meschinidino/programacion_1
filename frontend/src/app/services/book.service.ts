import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError, tap, map } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BookResponse } from '../models/book-response.model';

@Injectable({
    providedIn: 'root'
})
export class BookService {
    private apiUrl = 'http://127.0.0.1:5000/books';
    private bookUrl = 'http://127.0.0.1:5000/book';
    private usersUrl = 'http://127.0.0.1:5000/users';
    private loansUrl = 'http://127.0.0.1:5000/loans';
    private loanUrl = 'http://127.0.0.1:5000/loan';

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

    getBooks(page: number, params: any, itemsPerPage?: number) {
        let queryParams = new HttpParams()
            .set('page', page.toString());
        
        if (itemsPerPage) {
            queryParams = queryParams.set('per_page', itemsPerPage.toString());
        }
        
        if (params.searchTerm) {
            queryParams = queryParams.set('title', params.searchTerm);
        }
        
        if (params.genre) {
            queryParams = queryParams.set('genre', params.genre);
        }
        
        return this.http.get(`${this.apiUrl}`, { params: queryParams });
    }

    createBook(payload: any): Observable<BookResponse> {
        return this.http.post<BookResponse>(this.apiUrl, payload, { headers: this.getHeaders() }).pipe(
            catchError(this.handleError)
        );
    }

    updateBook(id: number, book: any): Observable<any> {
        if (!id) {
            console.error('Book ID is undefined');
            return throwError(() => new Error('Book ID is required'));
        }
        return this.http.put<any>(`${this.bookUrl}/${id}`, book, { 
            headers: this.getHeaders() 
        }).pipe(
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
        return this.http.delete(`${this.bookUrl}/${bookId}`, { headers: this.getHeaders() }).pipe(
            catchError(this.handleError)
        );
    }

    getBorrowedBooks(userId: number): Observable<any[]> {
        const url = `${this.usersUrl}/${userId}/borrowed-books`;
        console.log('Requesting borrowed books from:', url);
        return this.http.get<any[]>(url, {}).pipe(
            tap(response => console.log('Libros prestados:', response)),
            catchError(this.handleError)
        );
    }

    getLoans(page: number = 1, perPage: number = 10, searchTerm?: string): Observable<any> {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('per_page', perPage.toString());
        if (searchTerm) {
            params = params.set('book_title', searchTerm);
        }
        return this.http.get<any>(this.loansUrl, { 
            params,
            headers: this.getHeaders() 
        }).pipe(
            tap(response => console.log('Préstamos recibidos:', response)),
            catchError(this.handleError)
        );
    }

    updateLoanStatus(loanId: number, status: string): Observable<any> {
        return this.http.put<any>(`${this.loanUrl}/${loanId}`, { status }, {
            headers: this.getHeaders()
        }).pipe(
            catchError(this.handleError)
        );
    }

    deleteLoan(loanId: number): Observable<any> {
        return this.http.delete<any>(`${this.loanUrl}/${loanId}`, {
            headers: this.getHeaders()
        }).pipe(
            catchError(this.handleError)
        );
    }

    extendLoan(loanId: number, newReturnDate: string): Observable<any> {
        return this.http.put(`${this.loansUrl}/${loanId}/extend`, 
            { finish_date: newReturnDate },
            { headers: this.getHeaders() }
        ).pipe(
            catchError(this.handleError)
        );
    }

    suspendBook(bookId: number) {
        return this.http.put(`${this.bookUrl}/${bookId}/suspend`, {}, { headers: this.getHeaders() });  
    }
    unsuspendBook(bookId: number) {
        return this.http.put(`${this.bookUrl}/${bookId}/unsuspend`, {}, { headers: this.getHeaders() });
    }

    private handleError(error: any): Observable<never> {
        console.error('An error occurred:', error);
        return throwError(() => new Error('Request error, please try again.'));
    }
}
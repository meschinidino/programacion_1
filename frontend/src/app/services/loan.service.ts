// `loan.service.ts`
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Loan } from '../models/loan.model';

@Injectable({
    providedIn: 'root'
})
export class LoanService {
    private apiUrl = 'http://127.0.0.1:5000/loans';
    private userApiUrl = 'http://127.0.0.1:5000/user'; // Add user API URL

    constructor(private http: HttpClient) {}

    getLoans(): Observable<{ loans: Loan[] }> {
        return this.http.get<{ loans: Loan[] }>(this.apiUrl);
    }

    createLoan(loan: any): Observable<any> {
        const token = localStorage.getItem('token');
        if (!token) {
            return throwError(() => new Error('No authentication token found. Please log in again.'));
        }
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });
        return this.http.post<any>(this.apiUrl, loan, { headers })
            .pipe(catchError(error => throwError(() => error)));
    }

    updateLoan(id: string, loan: Partial<Loan>): Observable<Loan> {
        return this.http.put<Loan>(`${this.apiUrl}/${id}`, loan);
    }

    deleteLoan(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    // Add method to fetch user data by ID
    getUserById(userId: number): Observable<any> {
        return this.http.get<any>(`${this.userApiUrl}/${userId}`);
    }
}
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Loan } from '../models/loan.model';

@Injectable({
    providedIn: 'root'
})
export class LoanService {
    private apiUrl = 'http://127.0.0.1:5000/loans';
    private loanByIdUrl = 'http://127.0.0.1:5000/loan'; // URL for getting loan by ID

    constructor(private http: HttpClient) {}

    private getAuthHeaders(): HttpHeaders {
        const token = localStorage.getItem('token');
        return new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
    }

    getLoans(): Observable<any> {
        return this.http.get<any>(this.apiUrl).pipe(
            catchError(error => {
                console.error('Error en la solicitud de préstamos:', error);
                return throwError(error);
            })
        );
    }

    getLoansByUser(userId: number): Observable<Loan[]> {
        const headers = this.getAuthHeaders();
        return this.http.get<any>(`${this.apiUrl}?user_id=${userId}`, { headers }).pipe(
            map((response: any): Loan[] => {
                let loans: Loan[] = [];
                if (Array.isArray(response)) {
                    loans = response.filter((item: unknown): item is Loan =>
                        item != null &&
                        typeof item === 'object' &&
                        'user_id' in item
                    );
                } else if (response.loans && Array.isArray(response.loans)) {
                    loans = response.loans.filter((item: unknown): item is Loan =>
                        item != null &&
                        typeof item === 'object' &&
                        'user_id' in item
                    );
                } else if (typeof response === 'object') {
                    loans = Object.values(response)
                        .filter((item: unknown): item is Loan =>
                            item != null &&
                            typeof item === 'object' &&
                            'user_id' in item
                        );
                }
                return loans.filter((loan: Loan) => loan.user_id === userId);
            }),
            catchError(error => {
                console.error('Error completo al obtener préstamos:', error);
                return throwError(error);
            })
        );
    }

    getLoanById(loanId: number): Observable<Loan> {
        return this.http.get<Loan>(`${this.loanByIdUrl}/${loanId}`).pipe(
            catchError(error => {
                console.error('Error al obtener préstamo por ID:', error);
                return throwError(error);
            })
        );
    }

    createLoan(loan: any): Observable<any> {
        const headers = this.getAuthHeaders();
        return this.http.post<any>(this.apiUrl, loan, { headers }).pipe(
            catchError(error => {
                console.error('Error in request:', error);
                return throwError(() => error);
            })
        );
    }
    returnBook(loanId: number): Observable<any> {
        return this.http.post(`${this.apiUrl}/loans/${loanId}/return`, {});
    }

    requestMoreTime(loanId: number): Observable<any> {
        return this.http.post(`${this.apiUrl}/loans/${loanId}/extend`, {});
    }

    updateLoan(id: string, loan: Partial<Loan>): Observable<Loan> {
        return this.http.put<Loan>(`${this.apiUrl}/${id}`, loan).pipe(
            catchError(error => {
                console.error('Error al actualizar préstamo:', error);
                return throwError(error);
            })
        );
    }

    deleteLoan(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
            catchError(error => {
                console.error('Error al eliminar préstamo:', error);
                return throwError(error);
            })
        );
    }
}
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

    getLoans(): Observable<Loan[]> {
        const headers = this.getAuthHeaders();
        return this.http.get<any>(this.apiUrl, { headers }).pipe(
            map((response: any): Loan[] => {
                // Si la respuesta ya es un array, lo devolvemos
                if (Array.isArray(response)) {
                    return response;
                }
                // Si la respuesta tiene una propiedad 'loans' que es un array
                if (response.loans && Array.isArray(response.loans)) {
                    return response.loans;
                }
                // Si la respuesta es un objeto, convertimos sus valores en array
                if (typeof response === 'object') {
                    return Object.values(response);
                }
                // Si no podemos procesar la respuesta, devolvemos un array vacío
                return [];
            }),
            catchError(error => {
                console.error('Error en la solicitud de préstamos:', error);
                return throwError(() => error);
            })
        );
    }

    getLoansByUser(userId: number): Observable<Loan[]> {
        const headers = this.getAuthHeaders();
        return this.http.get<any>(`${this.apiUrl}/user/${userId}`, { headers }).pipe(
            map((response: any) => {
                if (response && response.loans) {
                    // Asegúrate de que cada préstamo tenga la información necesaria
                    return response.loans.map((loan: any) => ({
                        ...loan,
                        books: loan.books || [] // Si no hay books, usar array vacío
                    }));
                }
                return [];
            }),
            catchError(error => {
                console.error('Error al obtener préstamos:', error);
                return throwError(() => error);
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

    extendLoanTime(loanId: string, newDueDate: string): Observable<any> {
        const headers = this.getAuthHeaders();
        const payload = {
            finish_date: newDueDate  // Cambiado de due_date a finish_date para coincidir con el backend
        };
        
        console.log('Enviando payload:', payload); // Para debugging
        
        return this.http.put(`${this.apiUrl}/${loanId}/extend`, payload, { headers }).pipe(
            catchError(error => {
                console.error('Error al extender el préstamo:', error);
                return throwError(() => error);
            })
        );
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
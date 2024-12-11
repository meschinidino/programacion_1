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

    constructor(private http: HttpClient) {}

    getLoans(): Observable<{ loans: Loan[] }> {
        return this.http.get<{ loans: Loan[] }>(this.apiUrl);
    }

    // Crear un nuevo préstamo
    createLoan(loan: any): Observable<any> {
        const token = localStorage.getItem('token');
    
        // Si no hay token, retornar un error inmediatamente
        if (!token) {
            console.error('No se encontró el token de autenticación');
            return throwError(() => new Error('No se encontró el token de autenticación. Por favor, inicie sesión nuevamente.'));
        }

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });

        console.log('URL:', this.apiUrl);
        console.log('Headers completos:', headers.keys());
        console.log('Datos del préstamo:', JSON.stringify(loan));

        return this.http.post<any>(this.apiUrl, loan, { headers })
            .pipe(
                catchError(error => {
                    console.error('Error en la petición:', error);
                    console.error('Token usado:', token);
                    return throwError(() => error);
                })
            );
    }
    


    // Actualizar un préstamo existente
    updateLoan(id: string, loan: Partial<Loan>): Observable<Loan> {
        return this.http.put<Loan>(`${this.apiUrl}/${id}`, loan);
    }

    // Eliminar un préstamo por ID
    deleteLoan(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
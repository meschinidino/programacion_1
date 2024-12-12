// `loan.service.ts`
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Loan } from '../models/loan.model';

@Injectable({
    providedIn: 'root'
})
export class LoanService {
    private apiUrl = 'http://127.0.0.1:5000/loans';
    private userApiUrl = 'http://127.0.0.1:5000/user'; // Add user API URL

    constructor(private http: HttpClient) {}

    getLoans(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/loans`).pipe(
            catchError(error => {
            console.error('Error en la solicitud de préstamos:', error);
            return throwError(error);
        })
        );
    }

    // Método para obtener préstamos de un usuario específico
    getLoansByUser(userId: number): Observable<Loan[]> {
        // Obtener el token de autenticación
        const token = localStorage.getItem('token');
        
        // Configurar headers con el token de autorización
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
    
        return this.http.get<any>(`${this.apiUrl}/user/${userId}`, { headers }).pipe(
            map((response: any): Loan[] => {
                console.log('Respuesta completa de la API:', response);
                
                // Manejar diferentes estructuras de respuesta
                let loans: Loan[] = [];
                
                // Si la respuesta es un array, usarlo directamente
                if (Array.isArray(response)) {
                    loans = response.filter((item: unknown): item is Loan => 
                        item != null && 
                        typeof item === 'object' && 
                        item !== null && 
                        'user_id' in item
                    );
                } 
                // Si la respuesta tiene una propiedad 'loans', usar esa
                else if (response.loans && Array.isArray(response.loans)) {
                    loans = response.loans.filter((item: unknown): item is Loan => 
                        item != null && 
                        typeof item === 'object' && 
                        item !== null && 
                        'user_id' in item
                    );
                } 
                // Si la respuesta es un objeto con préstamos
                else if (typeof response === 'object') {
                    loans = Object.values(response)
                        .filter((item: unknown): item is Loan => 
                            item != null && 
                            typeof item === 'object' && 
                            item !== null && 
                            'user_id' in item
                        );
                }

                console.log('Estructura de préstamos:', loans);
                
                // Filtrar préstamos donde el user_id coincida con el usuario actual
                const userLoans = loans.filter((loan: Loan) => {
                    console.log(`Comparando: loan.user_id (${loan.user_id}) === userId (${userId})`);
                    return loan.user_id === userId;
                });
        
                console.log('Préstamos filtrados del usuario:', userLoans);
                return userLoans;
            }),
            catchError(error => {
                console.error('Error completo al obtener préstamos:', error);
                console.error('Detalles del error:', error.status, error.message);
                return of([]);
            })
        );
    }
    getLoanById(loanId: number): Observable<Loan> {
        return this.http.get<Loan>(`${this.apiUrl}/${loanId}`);
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
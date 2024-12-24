import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, tap, throwError } from 'rxjs';
import { Rating } from '../models/rating.model';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class RatingService {
    private apiUrl = 'http://127.0.0.1:5000/ratings';

    constructor(private http: HttpClient) {}

    getRatings(page: number, filters: any = {}): Observable<{ ratings: Rating[], page: number, pages: number, total: number }> {
        let params = `?page=${page}`;
        if (filters.user_id) params += `&user_id=${filters.user_id}`;
        if (filters.assessment) params += `&assessment=${filters.assessment}`;
        if (filters.sort_by) params += `&sort_by=${filters.sort_by}`;
        if (filters.valuation_date) params += `&valuation_date=${filters.valuation_date}`;
        if (filters.name) params += `&name=${filters.name}`;
        if (filters.book_title) params += `&book_title=${filters.book_title}`;
        if (filters.book_id) params += `&book_id=${filters.book_id}`;
        return this.http.get<{ ratings: Rating[], page: number, pages: number, total: number }>(`${this.apiUrl}${params}`);
    }

    // Verificar si el usuario puede hacer una reseña
    canUserRate(userId: number, bookId: number): Observable<boolean> {
        if (!userId || !bookId) {
            console.log('Usuario o libro no válido:', { userId, bookId });
            return of(false);
        }

        const url = `${this.apiUrl}/can-rate/${userId}/${bookId}`;
        console.log('Verificando si puede calificar:', url);

        return this.http.get<boolean>(url).pipe(
            tap(response => console.log('Respuesta de can-rate:', response)),
            catchError(error => {
                console.error('Error en canUserRate:', error);
                return of(false);
            })
        );
    }

    // Crear una nueva reseña
    createRating(rating: Rating): Observable<Rating> {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No hay token disponible');
            return throwError(() => new Error('No autorizado'));
        }

        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        console.log('Intentando crear rating:', rating);
        
        return this.http.post<Rating>(this.apiUrl, rating, { headers }).pipe(
            tap(response => console.log('Rating creado exitosamente:', response)),
            catchError(error => {
                console.error('Error al crear rating:', error);
                throw error;
            })
        );
    }

    // Obtener la reseña existente del usuario para un libro específico
    getUserRating(userId: number, bookId: number): Observable<Rating> {
        return this.http.get<Rating>(`${this.apiUrl}/user/${userId}/book/${bookId}`);
    }
}
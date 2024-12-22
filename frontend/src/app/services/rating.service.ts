import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
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
            return new Observable(subscriber => subscriber.next(false));
        }
        return this.http.get<boolean>(`${this.apiUrl}/can-rate/${userId}/${bookId}`).pipe(
            catchError(error => {
                console.error('Error en canUserRate:', error);
                return of(false);
            })
        );
    }

    // Crear una nueva reseña
    createRating(rating: Rating): Observable<Rating> {
        return this.http.post<Rating>(this.apiUrl, rating);
    }

    // Obtener la reseña existente del usuario para un libro específico
    getUserRating(userId: number, bookId: number): Observable<Rating> {
        return this.http.get<Rating>(`${this.apiUrl}/user/${userId}/book/${bookId}`);
    }
}
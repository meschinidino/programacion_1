import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rating } from '../models/rating.model';

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
}
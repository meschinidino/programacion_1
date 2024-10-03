import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
}
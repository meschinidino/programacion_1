import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Loan } from '../models/loan.model'; // Adjust the import path as necessary

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  private url = '/api';

  constructor(private httpClient: HttpClient) {}

  getLoans(): Observable<{ loans: Loan[] }> {
    return this.httpClient.get<{ loans: Loan[] }>(`${this.url}/api/loans`);
  }

  loan(): Observable<any> {
    let dataLoan = {
      loan_id: 4,
      user_id: 1,
      loan_date: "2021-01-02",
      finish_date: "2021-01-16"
    };
    return this.httpClient.post(`${this.url}/api/loans`, dataLoan).pipe(take(1));
  }
}
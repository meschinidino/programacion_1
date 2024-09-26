// loan.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  url = '/api';

  constructor(private httpClient: HttpClient) { }

  addUserLoan(book: any, duration: number) {
    let auth_token = localStorage.getItem('token');

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth_token}`
    });

    const requestOptions = { headers: headers };
    const body = { book, duration };

    return this.httpClient.post(this.url + '/loans', body, requestOptions);
  }
}
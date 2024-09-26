import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  getUserLoans(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/${userId}/loans`);
  }

  updateLoanStatus(loanId: string, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/loan/${loanId}`, { status });
  }

  // Other methods as needed
}
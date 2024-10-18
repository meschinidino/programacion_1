import { Injectable } from '@angular/core';
import{ HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  url = 'http://localhost:8000/api/loans';
  constructor(
      private httpClient: HttpClient,
  ) { }

    Loans(): Observable<any> {
        let dataLoan = {

        }
        return this.httpClient.post(this.url, dataLoan);
    }
}

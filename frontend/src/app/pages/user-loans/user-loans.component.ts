import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-loans',
  templateUrl: './user-loans.component.html',
  styleUrls: ['./user-loans.component.css']
})
export class UserLoansComponent implements OnInit {
  userId: string = '123'; // Example user ID
  loans: any[] = [];

  ngOnInit(): void {
    this.loans = [
      { id: '1', bookTitle: 'Book One', status: 'borrowed' },
      { id: '2', bookTitle: 'Book Two', status: 'returned' },
      { id: '3', bookTitle: 'Book Three', status: 'lost' }
    ];
  }

  updateLoanStatus(loanId: string, status: string): void {
    const loan = this.loans.find(l => l.id === loanId);
    if (loan) {
      loan.status = status;
    }
  }
}
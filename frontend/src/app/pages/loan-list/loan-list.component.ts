import { Component, OnInit } from '@angular/core';
import { LoanService } from '../../services/loan.service';
import { Loan } from '../../models/loan.model';

@Component({
  selector: 'app-loan-list',
  templateUrl: './loan-list.component.html',
  styleUrls: ['./loan-list.component.css']
})
export class LoanListComponent implements OnInit {
  loans: Loan[] = [];

  constructor(private loanService: LoanService) {}

  ngOnInit(): void {
    this.loadLoans();
  }

  loadLoans(): void {
    this.loanService.getLoans().subscribe({
      next: (loans: Loan[]) => {
        this.loans = loans;
      },
      error: (error) => console.error('Error cargando préstamos:', error)
    });
  }

  updateLoanStatus(loanId: string, status: string): void {
    this.loanService.updateLoan(loanId, { status }).subscribe({
      next: () => this.loadLoans(),
      error: (error) => console.error('Error actualizando estado:', error)
    });
  }

  extendLoanTime(loanId: string, newDate: string | null): void {
    if (newDate) {
      this.loanService.extendLoanTime(loanId, newDate).subscribe({
        next: () => {
          this.loadLoans();
      },
      error: (error) => console.error('Error extendiendo el préstamo:', error)
    });
  }
}
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoanService } from '../../services/loan.service';

@Component({
  selector: 'app-loans',
  templateUrl: './loans.component.html',
  styleUrls: ['./loans.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})

export class LoansComponent {
  selectedStatus: string = 'all';
  loans = [
    {
      title: 'The Hobbit',
      status: 'borrowed',
      borrowedDate: '01/08/2024',
      returnDate: '15/08/2024',
      image: 'assets/images/hobbit.png'
    },
    {
      title: 'Game of Thrones',
      status: 'returned',
      borrowedDate: '05/07/2024',
      returnDate: '20/07/2024',
      image: 'assets/images/got.png'
    }
  ];
  filteredLoans = this.loans;

  constructor(private loanService: LoanService) {}

  irLoan() {
    this.loanService.loan().subscribe({
      next: (rta: any) => {
        alert('Credenciales correctas');
        console.log('Exitos: ', rta);
      },
      error: (err: any) => {
        alert('Credenciales incorrectas');
      },
      complete: () => {
        console.log('finalizado');
      }
    });
  }

  filterLoans() {
    if (this.selectedStatus === 'all') {
      this.filteredLoans = this.loans;
    } else {
      this.filteredLoans = this.loans.filter(loan => loan.status === this.selectedStatus);
    }
  }

  clearFilters() {
    this.selectedStatus = 'all';
    this.filteredLoans = this.loans;
  }
}
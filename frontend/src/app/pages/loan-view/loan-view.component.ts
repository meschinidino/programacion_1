import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoanService } from '../../services/loan-service.service';

@Component({
  selector: 'app-loan-view',
  templateUrl: './loan-view.component.html',
  styleUrls: ['./loan-view.component.css']
})
export class LoanViewComponent implements OnInit {
  book: any;
  loanDuration: number = 1;
  loans: any[] = [
    { book: { title: 'Sample Book 1' }, duration: 1 },
    { book: { title: 'Sample Book 2' }, duration: 2 }
  ];

  constructor(private router: Router, private loanService: LoanService) {
    const navigation = this.router.getCurrentNavigation();
    this.book = navigation?.extras.state?.['book'];
  }

  ngOnInit(): void {}

  onLoanSubmit() {
    this.loanService.addUserLoan(this.book, this.loanDuration).subscribe(() => {
      this.router.navigate(['/loans']);
    });
  }
}
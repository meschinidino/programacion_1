import { Component, Input } from '@angular/core';
import { Loan } from '../../models/loan.model';

@Component({
  selector: 'app-loan',
  templateUrl: './loan.component.html',
  styleUrls: ['./loan.component.css']
})
export class LoanComponent {
  @Input() loan!: Loan;
}
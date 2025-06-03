import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoanService } from '../../services/loan.service';
import { Loan } from '../../models/loan.model';
import { MatDialog } from '@angular/material/dialog';
import { ExtendLoanDialogComponent } from '../../components/extend-loan-dialog/extend-loan-dialog.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-loans',
  templateUrl: './user-loans.component.html',
  styleUrls: ['./user-loans.component.css']
})
export class UserLoansComponent implements OnInit {
  loans: Loan[] = [];
  userId: number = 0;
  userRole: string = '';

  constructor(
    private loanService: LoanService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private authService: AuthService
  ) {
    this.authService.getCurrentUserRole().subscribe(role => {
      this.userRole = role;
    });
  }

  ngOnInit(): void {
    // Obtener el userId de los parámetros de la URL
    this.route.params.subscribe(params => {
      console.log('Parámetros de ruta:', params);
      this.userId = +params['userId']; // El + convierte el string a número
      console.log('ID de usuario a consultar:', this.userId);
      
      if (this.userId) {
        this.loadLoans();
      } else {
        console.error('No se proporcionó un ID de usuario válido en la URL');
      }
    });
  }

  loadLoans(): void {
    if (!this.userId) {
      console.error('No se ha proporcionado un ID de usuario');
      return;
    }

    console.log('Solicitando préstamos para el usuario:', this.userId);
    
    this.loanService.getLoansByUser(this.userId).subscribe({
      next: (data) => {
        console.log('Datos de préstamos recibidos:', data);
        this.loans = data;
      },
      error: (error) => {
        console.error('Error al cargar préstamos:', error);
      }
    });
  }

  updateLoanStatus(loanId: string, status: string): void {
    console.log('Actualizando estado del préstamo:', loanId, status);
    this.loanService.updateLoan(loanId, { status }).subscribe({
      next: () => {
        console.log('Estado actualizado correctamente');
        alert('Loan status updated successfully');
        this.loadLoans();
      },
      error: (error) => console.error('Error actualizando estado:', error)
    });
  }

  extendLoanTime(loanId: string): void {
    const dialogRef = this.dialog.open(ExtendLoanDialogComponent, {
      width: '300px',
      data: { loanId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loanService.extendLoanTime(loanId, result).subscribe({
          next: () => {
            console.log('Préstamo extendido correctamente');
            alert('Loan extended successfully');
            this.loadLoans();
          },
          error: (error) => console.error('Error al extender el préstamo:', error)
        });
      }
    });
  }

  deleteLoan(loanId: number) {
    if (confirm('¿Are you sure you want to delete this loan?')) {
      this.loanService.deleteLoan(loanId.toString()).subscribe({
        next: () => {
          alert('Loan deleted successfully');
          this.loadLoans();
        },
        error: (error) => {
          console.error('Error al eliminar el préstamo:', error);
        }
      });
    }
  }
}
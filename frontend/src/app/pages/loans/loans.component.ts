import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoanService } from '../../services/loan.service';
import { Loan } from '../../models/loan.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-loans',
  templateUrl: './loans.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./loans.component.css']
})
export class LoansComponent implements OnInit {
  loans: Loan[] = []; // Lista de préstamos
  filteredLoans: Loan[] = []; // Lista filtrada de préstamos
  selectedLoan: Loan | null = null;
  isEditing: boolean = false;
  selectedStatus: string = '';

  constructor(
    private modalService: NgbModal,
    private loanService: LoanService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    console.log('User ID from Auth Service:' + userId);
    this.loadLoans();
  }

  loadLoans(): void {
    const currentUserId = this.authService.getUserId();
    
    if (!currentUserId) {
      console.error('No se pudo obtener el ID del usuario');
      return;
    }

    this.loanService.getLoansByUser(currentUserId).subscribe(
      (loans: Loan[]) => {
        console.log('Préstamos obtenidos:', loans);
        this.loans = loans;
        this.filteredLoans = [...this.loans];
        
        if (this.loans.length === 0) {
          console.log('No tienes préstamos registrados');
        }
      },
      (error) => {
        console.error('Error al cargar préstamos:', error);
      }
    );
  }

  // Método para calcular el estado del préstamo
  calculateStatus(loan: Loan): string {
    const today = new Date();
    const finishDate = new Date(this.parseDate(loan.finish_date));
    
    return finishDate < today ? 'overdue' : 'borrowed';
  }

  // Método para parsear la fecha en formato DD/MM/YYYY
  parseDate(dateString: string): Date {
    const [day, month, year] = dateString.split('/');
    return new Date(+year, +month - 1, +day);
  }

  // Filtrar préstamos
  filterLoans(status: string): void {
    this.selectedStatus = status;
    
    if (status === 'all') {
      this.filteredLoans = [...this.loans];
    } else {
      this.filteredLoans = this.loans.filter(loan => 
        this.calculateStatus(loan) === status
      );
    }
  }
  
  clearFilters(): void {
    this.selectedStatus = 'all'; // Restablecer el filtro a "all"
    this.filterLoans(this.selectedStatus); // Mostrar todos los préstamos
  }
  

  // Abrir modal para crear o editar un préstamo
  open(content: any, loan: Loan | null = null): void {
    this.selectedLoan = loan
      ? { ...loan } // Copia para evitar mutaciones directas
      : { loan_id: 0, user_id: 0, loan_date: '', finish_date: '' }; // Nuevo préstamo
    this.isEditing = !!loan;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  // Guardar préstamo (crear o actualizar)
  saveLoan(modal: any): void {
    if (this.selectedLoan) {
        // Asegurarse de que el user_id esté asignado al crear un préstamo
        if (!this.isEditing) {
          this.selectedLoan.user_id = this.authService.getUserId() || 0;
        }

        const saveObservable = this.isEditing
        ? this.loanService.updateLoan(this.selectedLoan.loan_id.toString(), this.selectedLoan)
        : this.loanService.createLoan(this.selectedLoan);

      saveObservable.subscribe(() => {
        this.loadLoans();
        modal.close();
      });

      this.selectedLoan = null;
      this.isEditing = false;
    }
  }

  // Eliminar un préstamo
  deleteLoan(loan: Loan): void {
    this.loanService.deleteLoan(loan.loan_id.toString()).subscribe(() => {
      this.loadLoans();
    });
  }
}
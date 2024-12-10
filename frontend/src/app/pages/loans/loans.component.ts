import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoanService } from '../../services/loan.service';
import { Loan } from '../../models/loan.model';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-loans',
  templateUrl: './loans.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./loans.component.css']
})
export class LoansComponent implements OnInit {
  loans$: Observable<Loan[]> = new Observable<Loan[]>(); // Lista observable de préstamos
  allLoans: Loan[] = []; // Lista completa de préstamos
  filteredLoans: Loan[] = []; // Lista filtrada de préstamos
  selectedLoan: Loan | null = null; // Préstamo seleccionado para edición o creación
  isEditing: boolean = false; // Indica si se está editando un préstamo
  selectedStatus: string = ''; // Estado seleccionado del préstamo

  constructor(
    private modalService: NgbModal,
    private loanService: LoanService
  ) {}

  ngOnInit(): void {
    this.loadLoans();
  }

  // Cargar todos los préstamos
  loadLoans(): void {
    this.loanService.getLoans().pipe(
      map((response: any) => {
        return response.loans.map((loan: Loan) => ({
          ...loan,
          status: this.calculateStatus(loan) // Agrega el campo `status`
        }));
      })
    ).subscribe(
      (loans) => {
        this.allLoans = loans; // Cargar todos los préstamos
        this.filteredLoans = [...this.allLoans]; // Inicializar la lista filtrada
      },
      (error) => {
        console.error('Error loading loans:', error);
      }
    );
  }
  
  // Método para calcular el estado de un préstamo
  calculateStatus(loan: Loan): string {
    const today = new Date().toISOString().split('T')[0]; // Fecha actual
    if (loan.finish_date < today) {
      return 'overdue'; // Retrasado si la fecha de finalización ya pasó
    } else {
      return 'borrowed'; // En préstamo
    }
  }

  // Filtrar préstamos por texto
  filterLoans(status: string): void {
    if (status === 'all') {
      this.filteredLoans = [...this.allLoans]; // Mostrar todos los préstamos
    } else {
      this.filteredLoans = this.allLoans.filter(loan => loan.status === status);
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

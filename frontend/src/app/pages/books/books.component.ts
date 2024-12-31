import { Component, OnInit } from '@angular/core';
import { BookService } from '../../services/book.service';
import { BookResponse } from '../../models/book-response.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit {
  bookLoans: any[] = [];
  displayedColumns: string[] = ['id', 'bookTitle', 'userName', 'loanDate', 'returnDate', 'status', 'actions'];

  constructor(
    private bookService: BookService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadBookLoans();
  }

  loadBookLoans(): void {
    this.bookService.getLoans().subscribe({
      next: (response: any) => {
        console.log('Respuesta del servidor:', response);
        if (response && response.loans) {
          this.bookLoans = response.loans.map((loan: any) => ({
            id: loan.loan_id,
            book: {
              title: loan.books?.[0]?.title || 'N/A'
            },
            user: {
              name: loan.user?.name || 'N/A'
            },
            loanDate: loan.loan_date,
            returnDate: loan.finish_date,
            status: loan.status || 'prestado'
          }));
        }
        console.log('Préstamos procesados:', this.bookLoans);
      },
      error: (error) => {
        console.error('Error al cargar préstamos:', error);
        this.snackBar.open('Error al cargar los préstamos', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }

  updateLoanStatus(loanId: number, newStatus: string): void {
    this.bookService.updateLoanStatus(loanId, newStatus).subscribe({
      next: () => {
        this.snackBar.open('Estado actualizado correctamente', 'Cerrar', {
          duration: 3000
        });
      },
      error: (error) => {
        console.error('Error al actualizar el estado:', error);
        this.snackBar.open('Error al actualizar el estado', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }

  deleteLoan(loanId: number): void {
    if (confirm('¿Está seguro de eliminar este préstamo?')) {
      this.bookService.deleteLoan(loanId).subscribe({
        next: () => {
          this.loadBookLoans(); // Recargar la lista
          this.snackBar.open('Préstamo eliminado correctamente', 'Cerrar', {
            duration: 3000
          });
        },
        error: (error) => {
          console.error('Error al eliminar el préstamo:', error);
          this.snackBar.open('Error al eliminar el préstamo', 'Cerrar', {
            duration: 3000
          });
        }
      });
    }
  }

  editLoan(loan: any): void {
    // Aquí puedes implementar la lógica para editar el préstamo
    // Por ejemplo, abrir un diálogo de edición
    console.log('Editando préstamo:', loan);
    // Implementa aquí la lógica de edición que necesites
  }
}

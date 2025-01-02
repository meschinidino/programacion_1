import { Component, OnInit } from '@angular/core';
import { BookService } from '../../services/book.service';
import { BookResponse } from '../../models/book-response.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ExtendLoanDialogComponent } from '../../components/extend-loan-dialog/extend-loan-dialog.component';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit {
  bookLoans: any[] = [];
  currentPage: number = 1;
  totalPages: number = 0;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  displayedColumns: string[] = ['id', 'bookTitle', 'userName', 'loanDate', 'returnDate', 'status', 'actions'];
  searchTerm: string = '';

  constructor(
    private bookService: BookService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadBookLoans();
  }

  loadBookLoans(page?: number, searchTerm?: string): void {
    this.bookService.getLoans(page || this.currentPage, this.itemsPerPage, searchTerm).subscribe({
      next: (response: any) => {
        console.log('Respuesta completa del servidor:', response);
        if (response && response.loans) {
          this.bookLoans = response.loans.map((loan: any) => {
            const userName = loan.user?.name || '';
            const userLastName = loan.user?.last_name || '';
            console.log('Datos de usuario:', { name: userName, last_name: userLastName });
            
            return {
              id: loan.loan_id || loan.id,
              book: {
                title: loan.books?.[0]?.title || 'N/A'
              },
              user: {
                name: [userName, userLastName].filter(Boolean).join(' ') || 'N/A'
              },
              loanDate: loan.loan_date || loan.loanDate,
              returnDate: loan.finish_date || loan.returnDate,
              status: loan.status || 'prestado'
            };
          });
          
          this.totalItems = response.total;
          this.totalPages = response.pages;
          console.log('Préstamos procesados:', this.bookLoans);
        }
      },
      error: (error) => {
        console.error('Error al cargar préstamos:', error);
        this.snackBar.open('Error al cargar los préstamos', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadBookLoans();
  }

  updateLoanStatus(loanId: number, newStatus: string): void {
    this.bookService.updateLoanStatus(loanId, newStatus).subscribe({
      next: () => {
        alert('Status updated successfully');
      },
      error: (error) => {
        console.error('Error al actualizar el estado:', error);
        alert('Error al actualizar el estado');
      }
    });
  }

  deleteLoan(loanId: number): void {
    if (confirm('¿Está seguro de eliminar este préstamo?')) {
      this.bookService.deleteLoan(loanId).subscribe({
        next: () => {
          this.loadBookLoans(); // Recargar la lista
          alert('Loan deleted successfully');

        },
        error: (error) => {
          console.error('Error al eliminar el préstamo:', error);
          alert('Error al eliminar el préstamo');
        }
      });
    }
  }

  editLoan(loan: any): void {
    const dialogRef = this.dialog.open(ExtendLoanDialogComponent, {
        width: '400px',
        data: { loanId: loan.id }
    });

    dialogRef.afterClosed().subscribe(newDate => {
        if (newDate) {
            this.bookService.extendLoan(loan.id, newDate).subscribe({
                next: () => {
                    this.loadBookLoans();
                    alert('Loan extended successfully');
                },
                error: (error) => {
                    console.error('Error al extender el préstamo:', error);
                    alert('Error al extender el préstamo');
                }
            });
        }
    });
  }

  onSearch(): void {
    this.currentPage = 1; // Resetear a la primera página
    this.loadBookLoans(this.currentPage, this.searchTerm);
  }

  getPages(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }
}

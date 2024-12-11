import { Component, Input, HostListener, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoanService } from '../../services/loan.service';
import { BookService } from '../../services/book.service'; 
import { AuthService } from '../../services/auth.service';
import { Book } from '../../models/book-response.model';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class BookComponent implements OnInit {
  @Input() book!: Book; 
  @Output() bookDeleted = new EventEmitter<number>(); // Emite el ID del libro eliminado
  isFlipped = false;
  userRole: string = ''; 

  constructor(
    private loanService: LoanService,
    private bookService: BookService, 
    private authService: AuthService 
  ) {}

  ngOnInit(): void {
    this.authService.getCurrentUserRole().subscribe((role) => {
      this.userRole = role;
    });
  }

  onBookClick(): void {
    this.isFlipped = !this.isFlipped;
  }

  onBorrowClick(event: Event): void {
    event.stopPropagation();
    const loanRequest = {
      user_id: Number(6),
      loan_date: new Date().toISOString().split('T')[0],
      finish_date: this.calculateFinishDate(14),
      book_id: [Number(this.book.book_id)],
    };

    this.loanService.createLoan(loanRequest).subscribe({
      next: (response) => {
        console.log('Préstamo creado exitosamente:', response);
        alert(`Préstamo para "${this.book.title}" creado exitosamente!`);
      },
      error: (error) => {
        if (error.message.includes('token')) {
          alert('Necesita iniciar sesión para realizar esta acción');
        } else {
          console.error('Error al crear el préstamo:', error);
          alert('No se pudo crear el préstamo. Inténtelo de nuevo.');
        }
      },
    });
  }

  private calculateFinishDate(days: number): string {
    const finishDate = new Date();
    finishDate.setDate(finishDate.getDate() + days);
    return finishDate.toISOString().split('T')[0];
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (this.isFlipped && !(event.target as HTMLElement).closest('.book-card')) {
      this.isFlipped = false;
    }
  }

  getAuthors(): string {
    return this.book.authors.map((a) => `${a.name} ${a.last_name}`).join(', ');
  }

  deleteBook(): void {
    if (confirm(`¿Está seguro de que desea eliminar el libro "${this.book.title}"?`)) {
      this.bookService.deleteBook(this.book.book_id).subscribe({
        next: () => {
          console.log(`Libro "${this.book.title}" eliminado correctamente.`);
          alert(`Libro "${this.book.title}" eliminado correctamente.`);
          this.bookDeleted.emit(this.book.book_id); // Emitir evento para actualizar la lista
        },
        error: (err) => {
          console.error('Error al eliminar el libro:', err);
          alert('No se pudo eliminar el libro. Inténtelo de nuevo más tarde.');
        },
      });
    }
  }
  
}

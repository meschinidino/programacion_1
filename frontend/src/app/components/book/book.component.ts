import { Component, Input, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoanService } from '../../services/loan.service';
import { Book } from '../../models/book-response.model';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class BookComponent {
  @Input() book!: Book; // Recibe el libro como entrada
  isFlipped = false;

  constructor(private loanService: LoanService) {}

  // Método para girar el libro
  onBookClick(): void {
    this.isFlipped = !this.isFlipped;
  }

  // Lógica para manejar el clic en el botón "Borrow"
  onBorrowClick(event: Event): void {
    event.stopPropagation();
  
    const loanRequest = {
      user_id: Number(6),
      loan_date: new Date().toISOString().split('T')[0],
      finish_date: this.calculateFinishDate(14),
      book_id: [Number(this.book.book_id)]
    };
  
    this.loanService.createLoan(loanRequest).subscribe({
      next: (response) => {
        console.log('Préstamo creado exitosamente:', response);
        alert(`Préstamo para "${this.book.title}" creado exitosamente!`);
      },
      error: (error) => {
        if (error.message.includes('token')) {
          // Error de autenticación
          alert('Necesita iniciar sesión para realizar esta acción');
          // Aquí podrías redirigir al login
          // this.router.navigate(['/login']);
        } else {
          // Otros errores
          const errorMessage = error.error?.msg || error.error?.message || 'No se pudo crear el préstamo';
          console.error('Error al crear el préstamo:', error);
          alert(`Error: ${errorMessage}`);
        }
      }
    });
  }
  
  
  
  // Método para calcular la fecha de devolución
  private calculateFinishDate(days: number): string {
    const finishDate = new Date();
    finishDate.setDate(finishDate.getDate() + days);
    return finishDate.toISOString().split('T')[0];
  }

  // Detectar clics fuera del libro para cerrarlo si está girado
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (this.isFlipped && !(event.target as HTMLElement).closest('.book-card')) {
      this.isFlipped = false;
    }
  }

  // Obtener los autores del libro
  getAuthors(): string {
    return this.book.authors.map(a => `${a.name} ${a.last_name}`).join(', ');
  }
}

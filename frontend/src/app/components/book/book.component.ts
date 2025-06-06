import { Component, Input, HostListener, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoanService } from '../../services/loan.service';
import { BookService } from '../../services/book.service';
import { AuthService } from '../../services/auth.service';
import { Book } from '../../models/book-response.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class BookComponent implements OnInit {
  @Input() book!: Book;
  @Input() userRole: string = '';
  @Output() bookDeleted = new EventEmitter<number>();
  @Output() bookUpdated = new EventEmitter<any>();
  isFlipped = false;
    userId: number = 0; // Add a property to store the user ID
    randomImage: string = '';

    private images: string[] = [
        'assets/images/got.png',
        'assets/images/hobbit.png',
        'assets/images/hailmary.jpeg',
        'assets/images/martian.jpeg'
        // Add more image paths here
    ];


  constructor(
      private loanService: LoanService,
      private bookService: BookService,
      private authService: AuthService,
      private modalService: NgbModal,
      private router: Router
  ) {}

    ngOnInit(): void {
        this.authService.getCurrentUserRole().subscribe((role) => {
            this.userRole = role;
        });
        this.userId = parseInt(localStorage.getItem('userId') || '0', 10); // Retrieve the user ID
        this.randomImage = this.getRandomImage();
    }

    private getRandomImage(): string {
        const randomIndex = Math.floor(Math.random() * this.images.length);
        return this.images[randomIndex];
    }

  onBookClick(): void {
    this.isFlipped = !this.isFlipped;
  }

  onBorrowClick(event: Event): void {
    event.stopPropagation();
    
    if (this.book.is_suspended) {
        alert('This book is not available because it is suspended');
        return;
    }
    
    // If the user is not authenticated
    if (!this.userId) {
        alert('You need to log in to perform this action');
        return;
    }

    const loanRequest = {
      user_id: this.userId,
      loan_date: new Date().toISOString().split('T')[0],
      finish_date: this.calculateFinishDate(14),
      book_id: [Number(this.book.book_id)],
    };

    this.loanService.createLoan(loanRequest).subscribe({
      next: (response) => {
        console.log('Loan created successfully:', response);
        alert(`Préstamo para "${this.book.title}" creado exitosamente!`);
      },
      error: (error) => {
        if (error.status === 403) {
          // Manejo específico para usuarios Guest
          alert(error.error.message || 'To borrow a book you need to be a registered user. An administrator has been notified.');
        } else if (error.status === 401) {
          alert('You need to log in to perform this action');
        } else if (error.error?.message) {
          // Mostrar mensaje específico del servidor
          alert(error.error.message);
        } else {
          console.error('Error creating loan:', error);
          alert('No se pudo crear el préstamo. Por favor intenta nuevamente.');
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
    if (confirm(`Are you sure you want to delete the book "${this.book.title}"?`)) {
      this.bookService.deleteBook(this.book.book_id).subscribe({
        next: () => {
          console.log(`Book "${this.book.title}" deleted successfully.`);
          alert(`Book "${this.book.title}" deleted successfully.`);
          this.bookDeleted.emit(this.book.book_id);
        },
        error: (err) => {
          console.error('Error deleting book:', err);
          alert('Could not delete the book. Please try again later.');
        },
      });
    }
  }

  getAverageRating(): number {
    if (!this.book.ratings || this.book.ratings.length === 0) {
        return 0;
    }
    const sum = this.book.ratings.reduce((acc, rating) => acc + rating.assessment, 0);
    return sum / this.book.ratings.length;
  }

  editBook(): void {
    if (this.book.loans && this.book.loans.length > 0) {
      alert('This book cannot be edited because it has active loans');
      return;
    }

    this.bookUpdated.emit({
      action: 'edit',
      book: this.book,
      bookId: this.book.book_id
    });
  }

  showInfo(): void {
    console.log('Navegando a libro:', this.book.book_id); // Debug
    this.router.navigate(['/book', this.book.book_id]);
  }

  toggleBookSuspension(book: any) {
    if (book.is_suspended) {
        if (confirm('Are you sure you want to reactivate this book?')) {
            this.bookService.unsuspendBook(book.book_id).subscribe({
                next: (response) => {
                    book.is_suspended = false;
                    alert('Book reactivated successfully');
                },
                error: (error) => {
                    console.error('Error reactivating book:', error);
                }
            });
        }
    } else {
        if (confirm('Are you sure you want to suspend this book?')) {
            this.bookService.suspendBook(book.book_id).subscribe({
                next: (response) => {
                    book.is_suspended = true;
                    alert('Book suspended successfully');
                },
                error: (error) => {
                    console.error('Error suspending book:', error);
                }
            });
        }
    }
  }
}
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
  @Output() bookDeleted = new EventEmitter<number>();
  isFlipped = false;
  userRole: string = '';
  userId: number = 0; // Add a property to store the user ID

  constructor(
      private loanService: LoanService,
      private bookService: BookService,
      private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.getCurrentUserRole().subscribe((role) => {
      this.userRole = role;
    });
    this.userId = parseInt(localStorage.getItem('userId') || '0', 10); // Retrieve the user ID
  }

  onBookClick(): void {
    this.isFlipped = !this.isFlipped;
  }

  onBorrowClick(event: Event): void {
    event.stopPropagation();
    const loanRequest = {
      user_id: this.userId, // Use the retrieved user ID
      loan_date: new Date().toISOString().split('T')[0],
      finish_date: this.calculateFinishDate(14),
      book_id: [Number(this.book.book_id)],
    };

    this.loanService.createLoan(loanRequest).subscribe({
      next: (response) => {
        console.log('Loan created successfully:', response);
        alert(`Loan for "${this.book.title}" created successfully!`);
      },
      error: (error) => {
        if (error.message.includes('token')) {
          alert('You need to log in to perform this action');
        } else {
          console.error('Error creating loan:', error);
          alert('Could not create the loan. Please try again.');
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
}
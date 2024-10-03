import { Component, Input, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Book } from '../../models/book-response.model';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class BookComponent {
  @Input() book!: Book;
  isFlipped = false;

  constructor(private router: Router) { }

  onBookClick() {
    this.isFlipped = !this.isFlipped;
  }

  onBorrowClick(event: Event) {
    event.stopPropagation();
    this.router.navigate(['/loan-view'], { state: { book: this.book } });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (this.isFlipped && !(event.target as HTMLElement).closest('.book-card')) {
      this.isFlipped = false;
    }
  }

  getAuthors(): string {
    return this.book.authors.map(a => `${a.name} ${a.last_name}`).join(', ');
  }
}
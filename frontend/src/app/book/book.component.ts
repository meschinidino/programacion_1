import { Component, Input, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class BookComponent {
  @Input() book: any;
  isFlipped = false;
  showFullDescription = false;

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

  toggleDescription(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.showFullDescription = !this.showFullDescription;
  }

  getShortDescription(description: string): string {
    const words = description.split(' ');
    return words.length > 10 ? words.slice(0, 10).join(' ') + '...' : description;
  }
}

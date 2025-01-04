import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book-response.model';

@Component({
  selector: 'app-book-info',
  templateUrl: './book-info.component.html',
  styleUrl: './book-info.component.css'
})
export class BookInfoComponent implements OnInit {
  book: Book | null = null;
  loading: boolean = true;
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const bookId = params['id'];
      console.log('BookId:', bookId);
      if (bookId) {
        this.loadBookInfo(bookId);
      }
    });
  }

  private loadBookInfo(bookId: number): void {
    this.loading = true;
    this.error = '';
    
    this.bookService.getBookById(bookId).subscribe({
      next: (book) => {
        console.log('Book received:', book);
        this.book = book;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error completo:', error);
        this.error = 'Error al cargar la información del libro';
        this.loading = false;
      }
    });
  }

  get averageRating(): number {
    if (!this.book?.ratings || this.book.ratings.length === 0) {
      return 0;
    }
    const sum = this.book.ratings.reduce((acc, rating) => acc + rating.assessment, 0);
    return sum / this.book.ratings.length;
  }

  getBookStatus(): string {
    if (this.book?.is_suspended) {
      return 'Suspendido';
    }
    return this.book?.available ? 'Disponible' : 'No disponible';
  }
}

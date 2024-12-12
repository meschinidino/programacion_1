import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  searchTerm: string = '';
  books: any[] = [];
  genres: any[] = [
    { name: 'Fiction', image: 'fiction.png' },
    { name: 'History', image: 'history.png' },
    { name: 'Crime', image: 'crime.png' },
    { name: 'Horror', image: 'horror.png' },
    { name: 'Romance', image: 'romance.png' },
    { name: 'Fantasy', image: 'fantasy.png' },
    { name: 'Religion', image: 'religion.png' }
  ];
  selectedGenre: string | null = null;

  constructor(private bookService: BookService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
      const genre = params['genre'];
      if (genre) {
        this.filterByGenre({ name: genre });
      }
    });
  }

  searchBooks(): void {
    this.bookService.getBooks(1, { searchTerm: this.searchTerm }).subscribe({
      next: (response: any) => {
        this.books = response.books;
      },
      error: (err: any) => {
        console.error('Error searching books:', err);
      }
    });
  }

  filterByGenre(genre: any): void {
    this.selectedGenre = genre.name;
    this.router.navigate(['/search'], { queryParams: { genre: genre.name } });
    this.bookService.getBooks(1, { genre: genre.name }).subscribe({
      next: (response: any) => {
        this.books = response.books;
      },
      error: (err: any) => {
        console.error('Error filtering books by genre:', err);
      }
    });
  }

  clearFilters(): void {
    this.selectedGenre = null;
    this.books = [];
    this.router.navigate(['/search']);
  }
}
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
    { name: 'Religion', image: 'religion.png'},
    { name: 'Sci-fi', image: 'scifi.png'},
    { name: 'Self-help', image: 'selfhelp.png'}
  ];
  selectedGenre: string | null = null;

  constructor(private bookService: BookService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
      const genre = params['genre'];
      const search = params['search'];
      
      if (genre) {
        this.selectedGenre = genre;
      }
      
      if (search) {
        this.searchTerm = search;
        this.searchBooks();
      }
    });
  }

  searchBooks(): void {
    const searchParams = {
      searchTerm: this.searchTerm.trim(),
      genre: this.selectedGenre
    };

    this.bookService.getBooks(1, searchParams, 10).subscribe({
      next: (response: any) => {
        this.books = response.books;
        this.router.navigate(['/search'], { 
          queryParams: { 
            search: this.searchTerm.trim(),
            genre: this.selectedGenre 
          },
          queryParamsHandling: 'merge'
        });
      },
      error: (err: any) => {
        console.error('Error buscando libros:', err);
      }
    });
  }

  filterByGenre(genre: any): void {
    this.selectedGenre = genre.name;
    this.searchBooks();
  }

  clearFilters(): void {
    this.selectedGenre = null;
    this.books = [];
    this.router.navigate(['/search']);
  }
}
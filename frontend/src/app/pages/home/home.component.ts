import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { BookResponse } from '../../models/book-response.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  searchTerm: string = '';
  books: any[] = [];
  filteredBooks: any[] = [];
  paginatedBooks: any[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  itemsPerPage: number = 8; // Adjust as needed

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.fetchBooks();
  }

  fetchBooks(page: number = 1): void {
    this.authService.getBooks(page).subscribe((response: BookResponse) => {
      this.books = response.books;
      this.filteredBooks = this.books;
      this.currentPage = response.page;
      this.totalPages = response.pages;
      this.updatePaginatedBooks();
    });
  }

  updatePaginatedBooks(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedBooks = this.filteredBooks.slice(startIndex, endIndex);
  }

  onBookClick(book: any): void {
    console.log('Book clicked:', book);
    // Add your logic here, e.g., navigate to a book detail page
  }

  filterBooks(): void {
    this.filteredBooks = this.books.filter(book =>
        book.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        book.authors.some((author: any) =>
            `${author.name} ${author.last_name}`.toLowerCase().includes(this.searchTerm.toLowerCase())
        ) ||
        book.isbn.toString().toLowerCase().includes(this.searchTerm.toLowerCase()) || // Convert isbn to string
        book.editorial.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.updatePaginatedBooks();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.filteredBooks = this.books;
    this.updatePaginatedBooks();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedBooks();
    }
  }
}
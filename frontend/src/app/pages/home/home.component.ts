import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { BookService } from '../../services/book.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  searchTerm: string = '';
  availableBooks: any[] = [];
  filteredBooks: any[] = [];
  paginatedBooks: any[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  itemsPerPage: number = 10;
  userRole: string = '';
  selectedBook: any = { authors: [] };
  availableAuthors: any[] = [];
  isEditing: boolean = false;
  filters: any = {};

  @ViewChild('bookModal', { static: true }) bookModal: any;

  constructor(
      private authService: AuthService,
      private bookService: BookService,
      private modalService: NgbModal,
      private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadBooks();
    this.authService.getCurrentUserRole().subscribe(role => {
      this.userRole = role;
    });
  }

  loadBooks(page: number = 1): void {
    console.log(`Loading books for page: ${page}`);
    this.bookService.getBooks(page, this.filters, this.itemsPerPage).subscribe({
      next: (response: any) => {
        console.log('HTTP Response:', response); // Log the response for debugging
        if (response?.books) {
          this.handlePageChange(response);
        } else {
          console.error('Response does not contain the property "books".');
        }
      },
      error: (err: any) => {
        console.error('Error loading books:', err);
      }
    });
  }

  handlePageChange(response: any): void {
    console.log('Handling page change:', response);
    this.availableBooks = response.books;
    this.extractAuthors(this.availableBooks);
    this.filteredBooks = this.availableBooks;
    this.totalPages = response.pages; // Ensure this is set correctly
    this.currentPage = response.page;
    this.paginatedBooks = response.books; // Directly set paginatedBooks from response
    console.log('Updated paginatedBooks:', this.paginatedBooks);
  }

  extractAuthors(books: any[]): void {
    const authors = books.flatMap((book: any) => Array.isArray(book.authors) ? book.authors : []);
    this.availableAuthors = Array.from(new Set(authors.map((a: any) => a.id)))
        .map((id: any) => authors.find((a: any) => a.id === id));
  }

  filterBooks(): void {
    this.filters.searchTerm = this.searchTerm;
    this.loadBooks();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.filters = {};
    this.loadBooks();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      console.log(`Going to page: ${page}`);
      this.currentPage = page;
      this.loadBooks(this.currentPage);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  onAddBook(): void {
    this.isEditing = false;
    this.selectedBook = { title: '', authors: [], genre: '', year: '', editorial: '', isbn: '', available: '' };
    this.modalService.open(this.bookModal, { ariaLabelledBy: 'modal-basic-title' });
  }

  saveBook(modal: any): void {
    if (this.selectedBook) {
      const author = {
        name: this.selectedBook.authorName,
        last_name: this.selectedBook.authorLastName
      };

      this.bookService.createAuthor(author).subscribe({
        next: (authorResponse: any) => {
          this.selectedBook.authors = [authorResponse];

          const saveObservable = this.isEditing
              ? this.bookService.updateBook(this.selectedBook.id, this.selectedBook)
              : this.bookService.createBook(this.selectedBook);

          saveObservable.subscribe({
            next: (bookResponse: any) => {
              this.loadBooks();
              modal.close();
              this.selectedBook = { authors: [] }; // Reset selectedBook after saving
              this.isEditing = false;
            },
            error: (err: any) => {
              console.error('Error saving book:', err);
              modal.close();
              this.selectedBook = { authors: [] }; // Reset selectedBook after error
              this.isEditing = false;
            }
          });
        },
        error: (err: any) => {
          console.error('Error creating author:', err);
          modal.close();
          this.selectedBook = { authors: [] }; // Reset selectedBook after error
          this.isEditing = false;
        }
      });
    }
  }

  open(content: any, book: any | null = null): void {
    this.selectedBook = book
        ? { ...book }
        : { id: 0, title: '', authors: [], genre: '', year: '', editorial: '', isbn: '', available: '' };
    this.isEditing = !!book;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  onBookClick(book: any): void {
    console.log('Book clicked:', book);
  }
}
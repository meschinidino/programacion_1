import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { BookResponse } from '../../models/book-response.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BookService } from '../../services/book.service';
import { Router } from '@angular/router';

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
  itemsPerPage: number = 8;
  userRole: string = '';
  selectedBook: any = { authors: [] };
  availableAuthors: any[] = [];
  isEditing: boolean = false;

  @ViewChild('bookModal', { static: true }) bookModal: any;

  constructor(
    private authService: AuthService,
    private bookService: BookService,
    private modalService: NgbModal,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadBooks();
    this.authService.getCurrentUserRole().subscribe(role => {
      this.userRole = role;
    });
  }

  loadBooks(): void {
    this.bookService.getBooks().subscribe({
      next: (response: any) => {
        if (response?.books) {
          this.availableBooks = response.books;
          this.extractAuthors(this.availableBooks);
          this.filteredBooks = [...this.availableBooks];
          this.updatePaginatedBooks();
        } else {
          console.error('La respuesta no contiene la propiedad "books".');
        }
      },
      error: (err) => {
        console.error('Error al cargar libros:', err);
      }
    });
  }

  extractAuthors(books: any[]): void {
    const authors = books.flatMap((book: any) => Array.isArray(book.authors) ? book.authors : []);
    this.availableAuthors = Array.from(new Set(authors.map((a: any) => a.id)))
      .map((id: any) => authors.find((a: any) => a.id === id));
  }

  updatePaginatedBooks(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedBooks = this.filteredBooks.slice(startIndex, endIndex);
  }

  filterBooks(): void {
    this.filteredBooks = this.availableBooks.filter(book =>
      book.title?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      book.authors?.some((author: any) =>
        `${author.name} ${author.last_name}`.toLowerCase().includes(this.searchTerm.toLowerCase())
      ) ||
      book.isbn?.toString().toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      book.editorial?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.updatePaginatedBooks();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.filteredBooks = [...this.availableBooks];
    this.updatePaginatedBooks();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedBooks();
    }
  }

  onAddBook(): void {
    this.isEditing = false;
    this.selectedBook = { title: '', authors: [], genre: '', year: '', editorial: '', isbn: '', available: '' };
    this.modalService.open(this.bookModal, { ariaLabelledBy: 'modal-basic-title' });
  }

  addAuthorFromInput(event: KeyboardEvent): void {
    const input = (event.target as HTMLInputElement).value.trim();
    const [name, lastName] = input.split(' ');
    console.log(`Nuevo autor: ${name} ${lastName}`);

    if (name && lastName) {
      this.selectedBook.authors.push({ name, last_name: lastName });
      (event.target as HTMLInputElement).value = ''; // Limpia el campo
    } else {
      console.error('Debe ingresar un nombre y apellido separados por un espacio.');
    }
  }

  saveBook(modal: any): void {
    const bookData = { ...this.selectedBook };
  
    if (this.isEditing) {
      this.bookService.updateBook(this.selectedBook.id, bookData).subscribe({
        next: () => {
          this.loadBooks();
          modal.dismiss();
          console.log('Libro actualizado correctamente:', bookData);
          alert('Libro actualizado correctamente');
        },
        error: (err) => {
          console.error('Error actualizando libro:', err);
        }
      });
    } else {
      this.bookService.createBook(bookData).subscribe({
        next: () => {
          this.loadBooks();
          modal.dismiss();
          console.log('Libro guardado correctamente:', bookData);
          alert('Libro guardado correctamente');
        },
        error: (err) => {
          console.error('Error agregando libro:', err);
        }
      });
    }
  }
  

  onBookClick(book: any): void {
    console.log('Book clicked:', book);
  }
}
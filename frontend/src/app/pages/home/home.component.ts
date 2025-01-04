import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { BookService } from '../../services/book.service';
import { LoanService } from '../../services/loan.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChangeDetectorRef } from '@angular/core';
import { Book } from '../../models/book-response.model';


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
      private loanService: LoanService,
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
    this.bookService.getBooks(page, this.filters, this.itemsPerPage).subscribe({
      next: (response: any) => {
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
    this.availableBooks = response.books.sort((a: Book, b: Book) => {
        const ratingA = this.calculateAverageRating(a);
        const ratingB = this.calculateAverageRating(b);
        return ratingB - ratingA;
    });
    
    this.extractAuthors(this.availableBooks);
    this.filteredBooks = this.availableBooks;
    this.totalPages = response.pages;
    this.currentPage = response.page;
    this.paginatedBooks = this.availableBooks;
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
      console.log('ID antes de guardar:', this.selectedBook.book_id);

      const author = {
        name: this.selectedBook.authorName,
        last_name: this.selectedBook.authorLastName
      };
      
      console.log('🔍 Datos del autor a crear:', {
        nombreAutor: author.name,
        apellidoAutor: author.last_name,
        datosCompletos: author
      });

      if (this.isEditing) {
        this.bookService.updateBook(this.selectedBook.book_id, this.selectedBook)
          .subscribe({
            next: (response) => {
              const index = this.availableBooks.findIndex(book => book.book_id === this.selectedBook.book_id);
              if (index !== -1) {
                this.availableBooks[index] = { ...this.selectedBook };
                this.filteredBooks = [...this.availableBooks];
                this.paginatedBooks = [...this.availableBooks];
              }
              modal.close('save');
              alert('Book updated successfully');
            },
            error: (err) => {
              console.error('Error al actualizar:', err);
              modal.close();
            }
          });
      } else {
        this.bookService.createAuthor(author).subscribe({
          next: (authorResponse: any) => {
            console.log('✅ Autor creado exitosamente:', {
              respuestaCompleta: authorResponse,
              id: authorResponse.author_id,
              datos: authorResponse
            });

            this.selectedBook.author_id = [authorResponse.author_id];
            
            console.log('📚 Datos del libro antes de crear:', {
              libroCompleto: this.selectedBook,
              autorAsignado: this.selectedBook.author_id,
              títuloLibro: this.selectedBook.title
            });

            const saveObservable = this.bookService.createBook(this.selectedBook);

            saveObservable.subscribe({
              next: (bookResponse: any) => {
                console.log('✅ Libro creado exitosamente:', {
                  respuestaCompleta: bookResponse,
                  idLibro: bookResponse.book_id,
                  títuloCreado: bookResponse.title,
                  autoresAsociados: bookResponse.authors
                });
                this.loadBooks();
                modal.close();
                this.selectedBook = { authors: [] };
                this.isEditing = false;
              },
              error: (err: any) => {
                console.error('❌ Error al crear el libro:', {
                  error: err,
                  mensaje: err.message,
                  detalles: err.error
                });
                modal.close();
                this.selectedBook = { authors: [] };
                this.isEditing = false;
              }
            });
          },
          error: (err: any) => {
            console.error('❌ Error al crear el autor:', {
              error: err,
              mensaje: err.message,
              detalles: err.error
            });
            modal.close();
            this.selectedBook = { authors: [] };
            this.isEditing = false;
          }
        });
      }
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

  private calculateAverageRating(book: Book): number {
    if (!book.ratings || book.ratings.length === 0) {
      return 0;
    }
    const sum = book.ratings.reduce((acc, rating) => acc + rating.assessment, 0);
    return sum / book.ratings.length;
  }

  onBookAction(event: any): void {
    if (event.action === 'edit') {
      if (event.book.loans && event.book.loans.length > 0) {
        alert('No se puede editar este libro porque tiene préstamos activos');
        return;
      }

      console.log('Evento recibido:', event);
      this.selectedBook = { ...event.book };
      this.isEditing = true;
      
      this.modalService.open(this.bookModal).result.then(
        (result) => {
          if (result === 'save') {
            console.log('ID del libro a actualizar:', this.selectedBook.book_id);
            console.log('Datos completos a guardar:', this.selectedBook);
            
            this.bookService.updateBook(this.selectedBook.book_id, this.selectedBook)
              .subscribe({
                next: (response) => {
                  this.loadBooks();
                },
                error: (error) => {
                  console.error('Error detallado:', error);
                }
              });
          }
        }
      );
    }
  }
}
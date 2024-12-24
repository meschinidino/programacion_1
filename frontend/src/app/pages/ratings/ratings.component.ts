import { Component, OnInit } from '@angular/core';
import { Rating } from '../../models/rating.model';
import { RatingService } from '../../services/rating.service';
import { AuthService } from '../../services/auth.service';
import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-ratings',
  templateUrl: './ratings.component.html',
  styleUrls: ['./ratings.component.css']
})
export class RatingsComponent implements OnInit {
  ratings: Rating[] = [];
  page: number = 1;
  pages: number = 1;
  userId: number = 0;
  filters: any = { assessment: 0 };
  showUserRatings: boolean = false;
  showFilterMenu: boolean = false;
  newRating: Rating = {} as Rating;
  books: any[] = [];
  showReviewForm = false;

  constructor(private ratingService: RatingService, private authService: AuthService, private bookService: BookService) {}

  ngOnInit(): void {
    this.userId = parseInt(localStorage.getItem('userId') || '0', 10);
    this.loadRatings();
    this.loadBooks();
  }

  loadRatings(): void {
    const filters = { ...this.filters };
    if (this.showUserRatings) {
      filters.user_id = this.userId;
    } else {
      delete filters.user_id;
    }
    this.ratingService.getRatings(this.page, filters).subscribe(data => {
      this.ratings = data.ratings;
      this.page = data.page;
      this.pages = data.pages;
    });
  }

  clearFilters(): void {
    this.filters = { assessment: 0 };
    this.page = 1;
    this.loadRatings();
  }

  applyFilters(): void {
    this.page = 1;
    this.loadRatings();
  }

  nextPage(): void {
    if (this.page < this.pages) {
      this.page++;
      this.loadRatings();
    }
  }

  previousPage(): void {
    if (this.page > 1) {
      this.page--;
      this.loadRatings();
    }
  }

  toggleUserRatings(): void {
    this.showUserRatings = !this.showUserRatings;
    this.loadRatings();
  }

  toggleFilterMenu(): void {
    this.showFilterMenu = !this.showFilterMenu;
  }

  setAssessment(star: number): void {
    this.filters.assessment = star;
  }

  async crearResena(bookId: number, rating: Rating) {
    this.ratingService.canUserRate(this.userId, bookId).subscribe(
      canRate => {
        if (canRate) {
          this.ratingService.createRating(rating).subscribe(
            newRating => {
              console.log('Reseña creada exitosamente');
              alert('Rating created successfully');
              this.loadRatings();
            },
            error => {
              console.error('Error al crear la reseña');
              alert('Error creating rating');
            }
          );
        } else {
          console.log('No puedes hacer una reseña para este libro');
          alert('You already rated this book');
        }
      }
    );
  }

  loadBooks() {
    this.bookService.getBorrowedBooks(this.userId).subscribe(
      (response: any) => {
        console.log('Estructura completa de la respuesta:', response);
        if (response && Array.isArray(response.borrowed_books)) {
          this.books = response.borrowed_books.map((book: any) => ({
            id: book.book_id,
            title: book.title
          }));
        } else {
          this.books = [];
        }
        console.log('Libros procesados:', this.books);
      },
      error => {
        console.error('Error al cargar los libros:', error);
        this.books = [];
      }
    );
  }

  handleSubmitRating(): void {
    const ratingData = {
        ...this.newRating,
        user_id: this.userId,
        valuation_date: new Date().toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        })
    };
    this.crearResena(this.newRating.book_id, ratingData);
  }

  toggleReviewForm(): void {
    this.showReviewForm = !this.showReviewForm;
  }

}
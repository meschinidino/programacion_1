import { Component, OnInit } from '@angular/core';
import { Rating } from '../../models/rating.model';
import { RatingService } from '../../services/rating.service';
import { AuthService } from '../../services/auth.service';

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

  constructor(private ratingService: RatingService, private authService: AuthService) {}

  ngOnInit(): void {
    this.userId = parseInt(localStorage.getItem('userId') || '0', 10);
    this.loadRatings();
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

  applyFilters(): void {
    this.page = 1; // Reset to first page when applying filters
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
}
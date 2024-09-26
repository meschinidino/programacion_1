import { Component } from '@angular/core';

@Component({
  selector: 'app-ratings',
  templateUrl: './ratings.component.html',
  styleUrl: './ratings.component.css'
})
export class RatingsComponent {
  // Datos de las calificaciones
  ratings = [
    {
      title: 'The Hobbit',
      image: 'assets/images/hobbit.png',
      rating: 4.5,
      comment: 'An amazing journey, timeless classic!'
    },
    {
      title: 'Game of Thrones',
      image: 'assets/images/got.png',
      rating: 5,
      comment: 'Incredible world-building and plot twists!'
    }
  ];

  // Retorna la cantidad de estrellas completas
  fullStars(rating: number): number[] {
    const fullStarsCount = Math.floor(rating);
    return Array(fullStarsCount).fill(0);
  }

  // Verifica si hay media estrella
  hasHalfStar(rating: number): boolean {
    return rating % 1 !== 0;
  }
}

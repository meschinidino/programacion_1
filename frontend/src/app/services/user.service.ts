import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userRole: string;
  private loans: any[] = [];

  constructor() {
    // This is just a placeholder. In a real application, you would fetch this from an API or authentication service.
    this.userRole = 'User'; // or 'Librarian', 'Admin'
  }

  getRole(): string {
    return this.userRole;
  }

  setRole(role: string): void {
    this.userRole = role;
  }

  getUserLoans(): any[] {
    return this.loans;
  }

  addUserLoan(book: any, duration: number): void {
    this.loans.push({ book, duration });
  }
}

// frontend/src/app/models/book-response.model.ts

export interface Author {
    author_id: number;
    last_name: string;
    name: string;
}

export interface Loan {
    finish_date: string;
    loan_date: string;
    loan_id: number;
    user_id: number;
}

export interface Rating {
    assessment: number;
    book_id: number;
    comment: string;
    rating_id: number;
    user_id: number;
    valuation_date: string;
}

export interface Book {
    authors: Author[];
    available: number;
    book_id: number;
    editorial: string;
    genre: string;
    isbn: number;
    loans: Loan[];
    ratings: Rating[];
    title: string;
    year: number;
}

export interface BookResponse {
    books: Book[];
    page: number;
    pages: number;
    total: number;
}
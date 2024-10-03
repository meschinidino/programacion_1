export interface Book {
    editorial: string;
    isbn: number;
    title: string;
}

export interface Rating {
    assessment: number;
    book: Book;
    book_id: number;
    comment: string;
    rating_id: number;
    user_id: number;
    user_last_name: string;
    user_name: string;
    valuation_date: string;
}
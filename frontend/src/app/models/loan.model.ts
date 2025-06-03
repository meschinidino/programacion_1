export interface User {
    user_id: number;
    name: string;
    last_name: string;
    email: string;
    phone_number: number;
    address: string;
    role: string;
}

export interface Loan {
    loan_id: number;
    user_id: number;
    loan_date: string;
    finish_date: string;
    status?: string;
    image?: string;
    title?: string;
    user?: {
        user_id: number;
        name: string;
        last_name: string;
        email: string;
        phone_number: number;
        address: string;
        role: string;
    };
    books?: {
        title: string;
        editorial: string;
        isbn: number;
    }[];
}

export interface LoanResponse {
    loans: Loan[];
    page: number;
    pages: number;
    total: number;
}

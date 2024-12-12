export interface User {
    user_id: number;
    name: string;
    last_name: string;
    email: string;
    phone_number: number;
    address: string;
    role: string;
}

// `loan.model.ts`
export interface Loan {
    finish_date: string;
    loan_date: string;
    loan_id: number;
    user_id: number;
    status?: string;
    image?: string;
    title?: string;
}
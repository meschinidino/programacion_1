import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-extend-loan-dialog',
    templateUrl: './extend-loan-dialog.component.html',
    styleUrls: ['./extend-loan-dialog.component.css']
})
export class ExtendLoanDialogComponent {
    selectedDate: Date | null = null;
    minDate = new Date(); // Fecha mínima es hoy

    constructor(
        public dialogRef: MatDialogRef<ExtendLoanDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { loanId: string }
    ) {}

    onCancel(): void {
        this.dialogRef.close();
    }

    formatDate(date: Date | null): string | null {
        if (!date) return null;
        return date.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    }
}

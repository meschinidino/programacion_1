import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-extend-loan-dialog',
    templateUrl: './extend-loan-dialog.component.html',
    styleUrls: ['./extend-loan-dialog.component.css']
})
export class ExtendLoanDialogComponent {
    selectedDate: Date | null = null;
    minDate = new Date();

    constructor(
        public dialogRef: MatDialogRef<ExtendLoanDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { loanId: string }
    ) {}

    onCancel(): void {
        this.dialogRef.close();
    }

    onConfirm(): void {
        if (this.selectedDate) {
            this.dialogRef.close(this.formatDate(this.selectedDate));
        }
    }

    formatDate(date: Date | null): string | null {
        if (!date) return null;
        return date.toISOString().split('T')[0];
    }
}

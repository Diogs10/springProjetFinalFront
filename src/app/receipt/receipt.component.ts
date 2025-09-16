import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.scss'],
  standalone: true,
})
export class ReceiptComponent {
  tokenNumber = 'TOKEN#4';
  customerName = 'Mani1';
  date = '2024-11-29';
  subTotal = 9675;
  salesTax = 1548;
  finalTotal = this.subTotal + this.salesTax;
  sellerName = 'Abdul Rehman';
  status = 'UNPAID';

  constructor(
    public dialogRef: MatDialogRef<ReceiptComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  close() {
    this.dialogRef.close();
  }

  print() {
    window.print();
  }
}

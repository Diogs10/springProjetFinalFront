import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';;

@Component({
  selector: 'app-modele-form',
  standalone: true,
  imports: [
      CommonModule,
      MatIconModule,
      MatCard,
      MatButtonModule,
      MatCardModule,
    ],
  templateUrl: './display-photo.component.html',
  styleUrl: './display-photo.component.scss'
})
export class DisplayPhotoComponent implements OnInit{
  image: string;
  constructor(
    public matDialogRef: MatDialogRef<DisplayPhotoComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    this.image = data.image
  }
  ngOnInit() {
  }
}

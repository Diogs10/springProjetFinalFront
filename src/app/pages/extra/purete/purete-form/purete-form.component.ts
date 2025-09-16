import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelect } from '@angular/material/select';
import Swal from 'sweetalert2';
import { PureteService } from '../services/purete.service';
import { SnackService } from 'src/app/shared/services/snack.service';
import { SNACKTYPE } from 'src/app/enums/snack-type';
import { ACTIONTYPE } from 'src/app/enums/action-type';
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
  selector: 'app-marque-form',
  standalone: true,
  imports: [
    MatFormFieldModule,
    ReactiveFormsModule,
    CommonModule,
    MatOptionModule,
    MatIconModule,
    MatCard,
    MatRadioModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatCheckboxModule,
    MatProgressSpinner,
  ],
  templateUrl: './purete-form.component.html',
  styleUrl: './purete-form.component.scss'
})
export class PureteFormComponent implements OnInit{
  pureteForm!: FormGroup
  action: ACTIONTYPE;
  modalTitle: string | null;
  selectedPurete : number = 0;
  isLoading : boolean = false;
  constructor(
    private fb: FormBuilder,
    public matDialogRef: MatDialogRef<PureteFormComponent>,
    private pureteService: PureteService,
    private snackBarService: SnackService,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    this.action = data.action
    if (this.action == ACTIONTYPE.NEW) {
      this.modalTitle = 'Ajout de pureté'
      this.initializeForm();
    }else if(this.action == ACTIONTYPE.EDIT){
      this.modalTitle = 'Modification de pureté'
      this.initializeForm(data.item);
    }
  }
  ngOnInit(): void {
  }

    initializeForm(data?: any): void {
      this.pureteForm = this.fb.group({
        purete: [data?.purete ? data?.purete :'', [Validators.required]]
      });
      this.selectedPurete = data ? data.id : '';
    }

    onSubmit(): void {
      if (this.pureteForm.valid) {
        Swal.fire({
          title: 'Confirmation',
          text: `Voulez-vous vraiment ${this.action === ACTIONTYPE.EDIT ? 'modifier' : 'ajouter'} cette pureté ?`,
          showCancelButton: true,
          confirmButtonText: 'Oui',
          cancelButtonText: 'Non'
        }).then((result) => {
          if (result["value"]) {
            this.isLoading = true;
            const request$ = this.action === ACTIONTYPE.EDIT
              ? this.pureteService.update(this.pureteForm.value, this.selectedPurete)
              : this.pureteService.add(this.pureteForm.value);
            request$.subscribe({
              next: (response) => {
                if (response) {
                  this.snackBarService.sendNotification(
                    this.action === ACTIONTYPE.EDIT ? "Pureté modifiée avec succès" : "Pureté ajoutée avec succès",
                    SNACKTYPE.SUCCESS
                  );
                  this.isLoading = false;
                  this.matDialogRef.close(response);
                }
              },
              error: (error) => {
                this.snackBarService.sendNotification("Erreur : "+error.message, SNACKTYPE.ERROR);
                this.isLoading = false;
              }
            });
          }
        });

      }else{
        return
      }
    }

    onCancel(): void {
      this.matDialogRef.close();
    }
}

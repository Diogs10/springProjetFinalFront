import { PureteService } from './../../purete/services/purete.service';
import { Purete } from './../../purete/purete';
import { CommonModule } from '@angular/common';
import {Component, Inject, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelect } from '@angular/material/select';
import Swal from 'sweetalert2';
import { MarqueService } from '../services/marque.service';
import { SnackService } from 'src/app/shared/services/snack.service';
import { SNACKTYPE } from 'src/app/enums/snack-type';
import {ACTIONTYPE} from "../../../../enums/action-type";
import {Marque} from "../marque";
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
    MatSelect,
    MatProgressSpinner
  ],
  templateUrl: './marque-form.component.html',
  styleUrl: './marque-form.component.scss'
})
export class MarqueFormComponent implements OnInit{
  marqueForm!: FormGroup
  puretes: Purete[];
  action : string = ACTIONTYPE.NEW;
  modalTitle : string = "";
  selectedMarque : string | number | null = null;
  isLoading : boolean = false;
  constructor(
    private fb: FormBuilder,
    public matDialogRef: MatDialogRef<MarqueFormComponent>,
    private pureteService: PureteService,
    private marqueService: MarqueService,
    private snackBarService: SnackService,
    @Inject(MAT_DIALOG_DATA) private data: any,
  ) {
    this.action = data.action
    if (this.action == ACTIONTYPE.NEW) {
      this.modalTitle = 'Ajout de produit';
      this.initializeForm(null);
    }else if(this.action == ACTIONTYPE.EDIT){
      this.modalTitle = 'Modification de produit'
      this.initializeForm(data.item);
    }
  }
  ngOnInit() {
    this.getPuretes()
  }

    initializeForm(data : Marque | null): void {
      this.marqueForm = this.fb.group({
        marque: [data ? data.marque : '', [Validators.required]],
        purete: [data ? data.purete.id : '', [Validators.required]],
        prix: [data ? data.prix :'', [Validators.required]],
      });
      this.selectedMarque = data ? data.id : null;
    }

    onSubmit(): void {
      if (this.marqueForm.valid) {
        Swal.fire({
          title: 'Confirmation',
          text: `Voulez-vous vraiment ${this.action === ACTIONTYPE.EDIT ? 'modifier' : 'ajouter'} cette marque ?`,
          showCancelButton: true,
          confirmButtonText: 'Oui',
          cancelButtonText: 'Non'
        }).then((result) => {
          if (result["value"]) {
            this.isLoading = true;
            const request$ = this.action === ACTIONTYPE.EDIT
              ? this.marqueService.update(this.marqueForm.value, this.selectedMarque!)
              : this.marqueService.add(this.marqueForm.value);
            request$.subscribe({
              next: (response) => {
                if (response) {
                  this.snackBarService.sendNotification(this.action === ACTIONTYPE.EDIT ? "Marque modifiée avec succès" : "Marque ajoutée avec succès", SNACKTYPE.SUCCESS);
                  this.matDialogRef.close(response);
                }
                this.isLoading = false;
              },
              error: (error) => {
                this.snackBarService.sendNotification("erreur : " + error?.message, SNACKTYPE.ERROR);
                this.isLoading = false;
              }
            });
          }
        });

      }else{
        return
      }
    }

    getPuretes(){
      this.pureteService.getAll().subscribe({
        next:(response)=>{
          if(response){
            this.puretes = response
          }
        },
        error: (error) => {
          this.snackBarService.sendNotification(error.message, SNACKTYPE.ERROR);
          this.isLoading = false;
        }
      })
    }

    onCancel(): void {
      this.matDialogRef.close();
    }
}

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
import { SnackService } from 'src/app/shared/services/snack.service';
import { SNACKTYPE } from 'src/app/enums/snack-type';
import { ModeleService } from '../services/modele.service';
import {CategorieService} from "../../categories/services/categorie.service";
import {Categorie} from "../../categories/categorie";
import {ACTIONTYPE} from "../../../../enums/action-type";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
  selector: 'app-modele-form',
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
  templateUrl: './modele-form.component.html',
  styleUrl: './modele-form.component.scss'
})
export class ModeleFormComponent implements OnInit{
  modeleForm!: FormGroup
  categories: Categorie[] = [];
  action : string = "";
  modalTitle: string = "";
  isLoading : boolean = false;
  selectedModele : number = 0;
  constructor(
    private fb: FormBuilder,
    public matDialogRef: MatDialogRef<ModeleFormComponent>,
    private categorieService: CategorieService,
    private modeleService: ModeleService,
    private snackBarService: SnackService,
    @Inject(MAT_DIALOG_DATA) private data: any,
  ) {
    this.action = data.action
    if (this.action == ACTIONTYPE.NEW) {
      this.modalTitle = 'Ajout d\'un modele';
      this.initializeForm();
    }else if(this.action == ACTIONTYPE.EDIT){
      this.modalTitle = 'Modification d\'un modele';
      this.initializeForm(data.item);
    }
  }
  ngOnInit() {
    this.getCategories()
  }

    initializeForm(data : any = null): void {
      this.modeleForm = this.fb.group({
        modele: [data ? data?.modele : '', [Validators.required]],
        categorie: [data ? data.categorie.id : '', [Validators.required]],
      });
      this.selectedModele = data ? data.id : 0;
    }

    onSubmit(): void {
      if (this.modeleForm.valid) {
        Swal.fire({
          title: 'Confirmation',
          text: `Voulez-vous vraiment ${this.action === ACTIONTYPE.EDIT ? 'modifier' : 'ajouter'} ce modèle ?`,
          showCancelButton: true,
          confirmButtonText: 'Oui',
          cancelButtonText: 'Non'
        }).then((result) => {
          if (result["value"]) {
            this.isLoading = true;
            const request$ = this.action === ACTIONTYPE.EDIT
              ? this.modeleService.update(this.modeleForm.value, this.selectedModele)
              : this.modeleService.add(this.modeleForm.value);
            request$.subscribe({
              next: (response) => {
                if (response) {
                  this.snackBarService.sendNotification(
                    this.action === ACTIONTYPE.EDIT ? "Modèle modifié avec succès" : "Modèle ajouté avec succès",
                    SNACKTYPE.SUCCESS
                  );
                  this.matDialogRef.close(response);
                }
                this.isLoading = false;
              },
              error: (error) => {
                this.isLoading = false;
                this.snackBarService.sendNotification("Erreur : " + error?.message, SNACKTYPE.ERROR);
              }
            });
          }
        });
      }else{
        return
      }
    }

    getCategories(){
      this.categorieService.getAll().subscribe({
        next:(response)=>{
          if(response){
            this.categories = response
          }
        },
        error:(error)=>{

        }
      })
    }

    onCancel(): void {
      this.matDialogRef.close();
    }
}

import {Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatCard, MatCardContent} from "@angular/material/card";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {NgIf, NgOptimizedImage} from "@angular/common";
import {ACTIONTYPE} from "../../../../enums/action-type";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {SnackService} from "../../../../shared/services/snack.service";
import {CategorieService} from "../services/categorie.service";
import Swal from "sweetalert2";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {SNACKTYPE} from "../../../../enums/snack-type";

@Component({
  selector: 'app-form-categorie',
  standalone: true,
  imports: [
    FormsModule,
    MatButton,
    MatCard,
    MatCardContent,
    MatError,
    MatFormField,
    MatIcon,
    MatInput,
    MatLabel,
    NgIf,
    ReactiveFormsModule,
    MatProgressSpinner
  ],
  templateUrl: './form-categorie.component.html',
  styleUrl: './form-categorie.component.scss'
})
export class FormCategorieComponent {

  modalTitle : string = "Ajout de catégorie";
  categorieForm!: FormGroup
  action: ACTIONTYPE;
  imagePreview: string | ArrayBuffer | null = null;
  isLoading : boolean = false;
  selectedFile: any | null = null;
  selectedFileName : string = "";
  selectedCategorie : string = "";
  choosedImage : any;
  constructor(
    private fb: FormBuilder,
    public matDialogRef: MatDialogRef<FormCategorieComponent>,
    private categorieService: CategorieService,
    private snackBarService: SnackService,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    this.action = data.action
    if (this.action == ACTIONTYPE.NEW) {
      this.modalTitle = "Ajout de catégorie"
      this.initializeForm();
    }else if(this.action == ACTIONTYPE.EDIT){
      this.modalTitle = 'Modification de catégorie'
      this.initializeForm(data.item);
      this.selectedCategorie = data.item.id
    }
  }

  initializeForm(data?: any): void {
    this.categorieForm = this.fb.group({
      nom: [data?.nom ? data?.nom :'', [Validators.required]],
      code : [data?.code ? data?.code :'', Validators.required],
    });
  }

  onSubmit(): void {
    // Vérifier que le formulaire est valide
    if (!this.categorieForm.valid) {
      return;
    }
    const actionText = this.action === ACTIONTYPE.NEW ? 'ajouter' : 'modifier';

    Swal.fire({
      title: 'Confirmation',
      text: `Voulez-vous vraiment ${actionText} cette catégorie ?`,
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non'
    }).then((result) => {
      if (!result.value) {
        return;
      }

      this.isLoading = true;

      const request$ = this.action === ACTIONTYPE.EDIT
          ? this.categorieService.update(this.categorieForm.value, this.selectedCategorie)
          : this.categorieService.add(this.categorieForm.value);
      request$.subscribe({
        next: (response) => {
          if (response) {
            const successMessage = this.action === ACTIONTYPE.EDIT
                ? "Catégorie modifiée avec succès"
                : "Catégorie ajoutée avec succès";
            this.snackBarService.sendNotification(successMessage, SNACKTYPE.SUCCESS);
            this.matDialogRef.close(response);
          }
        },
        error: (error) => {
          this.snackBarService.sendNotification(error.message, SNACKTYPE.ERROR);
          this.isLoading = false;
        }
      });
    });
  }


  onCancel(): void {
    this.matDialogRef.close(null);
  }
}

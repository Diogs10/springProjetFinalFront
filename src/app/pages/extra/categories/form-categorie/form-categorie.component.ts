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
    NgOptimizedImage,
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
    }
  }

  initializeForm(data?: any): void {
    if (this.action == ACTIONTYPE.NEW){
      this.categorieForm = this.fb.group({
        nom: [data?.nom ? data?.nom :'', [Validators.required]],
        image : ["", Validators.required],
      });
    }else {
      this.categorieForm = this.fb.group({
        nom: [data?.nom ? data?.nom :'', [Validators.required]]
      });
    }
    this.selectedCategorie = data ? data.slug : "";
  }

  onSubmit(): void {
    // Vérifier que le formulaire est valide
    if (!this.categorieForm.valid) {
      return;
    }

    console.log("this.choosedImage", this.choosedImage);

    // Préparer le FormData
    const formData = new FormData();
    if (this.action === ACTIONTYPE.NEW || (this.action === ACTIONTYPE.EDIT && this.selectedFile)) {
      formData.append('image', this.selectedFile);
    }
    formData.append('nom', this.categorieForm.get('nom')?.value);
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
          ? this.categorieService.updateWithImage(formData, this.selectedCategorie)
          : this.categorieService.addWithImage(formData);

      request$.subscribe({
        next: (response) => {
          if (response) {
            console.log(`Réponse ${this.action === ACTIONTYPE.EDIT ? 'edit' : 'add'}:`, response);
            const successMessage = this.action === ACTIONTYPE.EDIT
                ? "Mise à jour réussi"
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


  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        // Le résultat est le contenu base64 du fichier
        const base64String = reader.result as string;
        console.log('Base64 String:', base64String);
        this.selectedFileName = base64String;
        this.categorieForm.get('image')?.setValue(base64String)
      };
    }else {
      this.selectedFile = null;
    }
  }


  onCancel(): void {
    this.matDialogRef.close(null);
  }
}

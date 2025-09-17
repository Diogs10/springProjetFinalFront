import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOption, MatOptionModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelect } from '@angular/material/select';
import Swal from 'sweetalert2';
import { SnackService } from 'src/app/shared/services/snack.service';
import { SNACKTYPE } from 'src/app/enums/snack-type';
import { ACTIONTYPE } from 'src/app/enums/action-type';
import { ProduitService } from '../services/produit.service';
import { MATIERES_POSSIBLES } from 'src/app/shared/constantes/matieres';
import { Categorie } from 'src/app/pages/extra/categories/categorie';
import { CategorieService } from 'src/app/pages/extra/categories/services/categorie.service';
import { GENDER_POSSIBLES } from 'src/app/shared/constantes/genders';
import { SELECT } from 'src/app/enums/select-type';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

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
      MatOption,
      MatStepperModule,
      MatProgressSpinner
    ],
  templateUrl: './produit-form.component.html',
  styleUrl: './produit-form.component.scss'
})
export class ProduitFormComponent implements OnInit{
  produitForm!: FormGroup
  action: ACTIONTYPE;
  modalTitle: string | null;
  matieresList: SELECT[] = MATIERES_POSSIBLES;
  categorieList: Categorie[];
  genresPossible: SELECT[] = GENDER_POSSIBLES;
  selectedImage : File;
  selectedProduit : number = 0;
  categories: any[] = [];
  isLoading : boolean = false;
  constructor(
    private fb: FormBuilder,
    public matDialogRef: MatDialogRef<ProduitFormComponent>,
    private produitService: ProduitService,
    private snackBarService: SnackService,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private categorieService: CategorieService,
  ) {
    this.action = data.action
    if (this.action == ACTIONTYPE.NEW) {
      this.modalTitle = 'Ajout de produit';
      this.initializeForm();
    }else if(this.action == ACTIONTYPE.EDIT){
      this.modalTitle = 'Modification de produit'
      this.initializeForm(data.item);
      this.selectedProduit = data.item.id
    }
  }
  ngOnInit(): void {
    this.getCategories();
  }

  getCategories(){
    this.categorieService.list('categories',0,1000).subscribe({
      next:(response)=>{
          this.categories = response.data.content;
      },
      error:(error)=>{
      }
    })
  }

  initializeForm(data?: any): void {
    this.produitForm = this.fb.group({
      code: [data?.code || '', Validators.required],
      nom: [data?.nom || '', Validators.required],
      prix: [data?.prix || '', [Validators.required, Validators.min(0)]],
      categorieId: [data?.categorie?.id || '', Validators.required],
    });

  }

  get code() { return this.produitForm.get('code'); }
  get nom() { return this.produitForm.get('nom'); }
  get prix() { return this.produitForm.get('prix'); }
  get categorieId() { return this.produitForm.get('categorieId'); }

  onSubmit(): void {
    if (this.produitForm.valid) {
      Swal.fire({
        title: 'Confirmation',
        text: `Voulez-vous vraiment ${this.action === ACTIONTYPE.EDIT ? 'modifier' : 'ajouter'} ce produit ?`,
        showCancelButton: true,
        confirmButtonText: 'Oui',
        cancelButtonText: 'Non'
      }).then((result) => {
        if (result["value"]) {
          const request$ = this.action === ACTIONTYPE.EDIT
            ? this.produitService.update(this.produitForm.value, this.selectedProduit)
            : this.produitService.add(this.produitForm.value);
          request$.subscribe({
            next: (response) => {
              if (response) {
                this.snackBarService.sendNotification(this.action === ACTIONTYPE.EDIT ? "Produit modifié avec succès" : "Produit ajouté avec succès", SNACKTYPE.SUCCESS);
                this.matDialogRef.close(response);
              }
            },
            error: (error) => {
              this.snackBarService.sendNotification("Erreur"+error?.message, SNACKTYPE.ERROR);
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

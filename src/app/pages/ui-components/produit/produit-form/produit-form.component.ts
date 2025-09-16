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
import { ModeleService } from 'src/app/pages/extra/modele/services/modele.service';
import { TVA } from 'src/app/shared/constantes/constantes';
import { MarqueService } from 'src/app/pages/extra/marque/services/marque.service';
import { Marque } from 'src/app/pages/extra/marque/marque';
import { Modele } from 'src/app/pages/extra/modele/modele';
import { GENDER_POSSIBLES } from 'src/app/shared/constantes/genders';
import { SELECT } from 'src/app/enums/select-type';
import { PureteService } from 'src/app/pages/extra/purete/services/purete.service';
import { Purete } from 'src/app/pages/extra/purete/purete';
import { MatStepperModule } from '@angular/material/stepper';

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
  marqueList: Marque[];
  modeleList: Modele[];
  pureteList: Purete[];
  genresPossible: SELECT[] = GENDER_POSSIBLES;
  selectedImage : File;
  selectedProduit : number = 0;
  steps={step1:1,step2:2,step3:3,}
  constructor(
    private fb: FormBuilder,
    public matDialogRef: MatDialogRef<ProduitFormComponent>,
    private produitService: ProduitService,
    private snackBarService: SnackService,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private categorieService: CategorieService,
    private marqueService: MarqueService,
    private modeleService: ModeleService,
    private pureteService: PureteService,
  ) {
    this.action = data.action
    if (this.action == ACTIONTYPE.NEW) {
      this.modalTitle = 'Ajout de produit';
      this.initializeForm();
    }else if(this.action == ACTIONTYPE.EDIT){
      this.modalTitle = 'Modification de produit'
      this.initializeForm(data.item);
    }
  }
  ngOnInit(): void {
    this.getCategories();
    this.getMarques();
    this.getModeles();
    this.getPurete();
  }

  getCategories(){
    this.categorieService.getAll().subscribe({
      next:(response)=>{
          this.categorieList = response;
          // this.categorieList = this.categorieList.map((categorie:Categorie)=>{
          //   return {...categorie, image: environment.baseIMGURL+categorie.image}
          // });
      },
      error:(error)=>{
        console.log(error);

      }
    })
  }

  getMarques(){
    this.marqueService.getAll().subscribe({
      next:(response)=>{
          this.marqueList = response;
      },
      error:(error)=>{
        console.log(error);
      }
    })
  }

  getModeles(){
    this.modeleService.getAll().subscribe({
      next:(response)=>{
          this.modeleList = response;
      },
      error:(error)=>{
        console.log(error);
      }
    })
  }

  getPurete(){
    this.pureteService.getAll().subscribe({
      next:(response)=>{
          this.pureteList = response;
      },
      error:(error)=>{
        console.log(error);
      }
    })
  }

  private convertToFormData(formValue: any): FormData {
    const formData = new FormData();
    Object.keys(formValue).forEach(key => {
      console.log("key", key)
      if(key == "image" && this.selectedImage){
        formData.append(key, this.selectedImage);
      }else if(key=="image" && !this.selectedImage){
      }else{
        formData.append(key, formValue[key]);
      }

    });
    console.log("formData", formData);
    return formData;
  }

  initializeForm(data?: any): void {
    if(this.action == ACTIONTYPE.NEW){
      this.produitForm = this.fb.group({
        nom: [data?.nom ? data?.nom :'', [Validators.required]],
        categorie: [data?.categorie ? data?.categorie :'', [Validators.required]],
        marque: [data?.marque ? data?.marque :'', [Validators.required]],
        modele: [data?.modele ? data?.modele :'', [Validators.required]],
        description: [data?.description ? data?.description :'', [Validators.required]],

        purete: [data?.purete ? data?.purete :'', [Validators.required]],
        matiere: [data?.matiere ? data?.matiere :'', [Validators.required]],
        genre: [data?.genre ? data?.genre :'', [Validators.required]],
        image: [data?.image ? data?.image :'', [Validators.required]],

        prix_vente_grammes: [data?.prix_vente_grammes ? data?.prix_vente_grammes :'', [Validators.required]],
        prix_avec_tax: [data?.prix_avec_tax ? data?.prix_avec_tax :'', [Validators.required]],
        quantite_en_stock: [data?.quantite_en_stock ? data?.quantite_en_stock :'', [Validators.required]],
        poids: [data?.poids ? data?.poids :'', [Validators.required]],
        taille: [data?.taille ? data?.taille :'', [Validators.required]],
        status: ['publié', [Validators.required]],
      });
    }else {
      this.produitForm = this.fb.group({
        nom: [data?.nom ? data?.nom :'', [Validators.required]],
        categorie: [data?.categorie ? data?.categorie :'', [Validators.required]],
        marque: [data?.marque ? data?.marque :'', [Validators.required]],
        modele: [data?.modele ? data?.modele :'', [Validators.required]],
        description: [data?.description ? data?.description :'', [Validators.required]],

        purete: [data?.purete ? data?.purete :'', [Validators.required]],
        matiere: [data?.matiere ? data?.matiere :'', [Validators.required]],
        genre: [data?.genre ? data?.genre :'', [Validators.required]],
        image: ['', []],

        prix_vente_grammes: [data?.prix_vente_grammes ? data?.prix_vente_grammes :'', [Validators.required]],
        prix_avec_tax: [data?.prix_avec_tax ? data?.prix_avec_tax :'', [Validators.required]],
        quantite_en_stock: [data?.quantite_en_stock ? data?.quantite_en_stock :'', [Validators.required]],
        poids: [data?.poids ? data?.poids :'', [Validators.required]],
        taille: [data?.taille ? data?.taille :'', [Validators.required]],
        status: ['publié', [Validators.required]],
      });
      this.selectedProduit = data.id;
    }

  }

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
          const formData = this.convertToFormData(this.produitForm.value);
          const request$ = this.action === ACTIONTYPE.EDIT
            ? this.produitService.updateWithImage(formData, this.selectedProduit)
            : this.produitService.addWithImage(formData);
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

  checkStepIsValid(step: number): boolean {
    if (!this.produitForm) {
      throw new Error('Le formulaire n\'est pas initialisé.');
    }

    switch (step) {
      case this.steps.step1:
        const step1Fields = ['nom', 'categorie', 'marque', 'modele', 'description'];
        return step1Fields.every(field => this.produitForm.get(field)?.valid);

      case this.steps.step2:
        const step2Fields = ['purete', 'matiere', 'genre', 'image'];
        return step2Fields.every(field => this.produitForm.get(field)?.valid);

      case this.steps.step3:
        const step3Fields = ['prix_vente_grammes', 'prix_avec_tax', 'quantite_en_stock', 'poids', 'taille', 'status'];
        return step3Fields.every(field => this.produitForm.get(field)?.valid);

      default:
        throw new Error(`Étape ${step} non reconnue.`);
    }
  }

  selectedFileName: any | null = null;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input?.files?.length) {
      const file = input.files[0];
      this.selectedImage = file;

      const reader = new FileReader();
      reader.onload = () => {
        // Le résultat est le contenu base64 du fichier
        const base64String = reader.result as string;
        console.log('Base64 String:', base64String);
        this.selectedFileName = base64String;
       // this.produitForm.get('image')?.setValue(base64String)
      };

      reader.onerror = (error) => {
        console.error('Erreur lors de la conversion du fichier en base64:', error);
      };

      reader.readAsDataURL(file); // Lit le fichier et le convertit en base64
    }
  }


  onCancel(): void {
    this.matDialogRef.close();
  }

  calculateTax(){
    const tax = this.produitForm.get('prix_vente_grammes')?.value * TVA
    this.produitForm.get('prix_avec_tax')?.setValue(this.produitForm.get('prix_vente_grammes')?.value + tax );
  }
}

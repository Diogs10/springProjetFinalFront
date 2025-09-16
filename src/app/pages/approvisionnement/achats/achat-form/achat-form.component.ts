import {Component, Inject, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatCard, MatCardContent} from "@angular/material/card";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {NgForOf, NgIf} from "@angular/common";
import {ACTIONTYPE} from "../../../../enums/action-type";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {SnackService} from "../../../../shared/services/snack.service";
import {Fournisseur} from "../../fournisseurs/fournisseur";
import {SNACKTYPE} from "../../../../enums/snack-type";
import {AchatService} from "../services/achat.service";
import {FournisseurService} from "../../fournisseurs/services/fournisseur.service";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {Produit} from "../../../ui-components/produit/produit";

@Component({
  selector: 'app-achat-form',
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
    MatOption,
    MatSelect,
    NgForOf,
    MatIconButton
  ],
  templateUrl: './achat-form.component.html',
  styleUrl: './achat-form.component.scss'
})
export class AchatFormComponent implements OnInit{

  modalTitle : string = "Faire un approvisionnement de produit"
  achatForm !: FormGroup;
  action: ACTIONTYPE;
  fournisseurs : Fournisseur[] = [];
  productList : Produit[] = [];
  productSelected : number[] = []
  constructor(
    private fb: FormBuilder,
    public matDialogRef: MatDialogRef<AchatFormComponent>,
    private achatService: AchatService,
    private fournisseurService : FournisseurService,
    private snackBarService: SnackService,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
   /* this.action = data.action
    if (this.action == ACTIONTYPE.NEW) {
      this.modalTitle = 'Faire un approvisionnement de produit'
      this.initializeForm();
    }else if(this.action == ACTIONTYPE.EDIT){
      this.modalTitle = 'Modifier les informations de l\' approvisionnement'
      this.initializeForm(data.item);
    }*/
  }


  ngOnInit(): void {
    this.achatForm = this.fb.group({
      fournisseur: ['', Validators.required],
      produits: this.fb.array([])
    });

    this.achatForm.get('produits')?.valueChanges.subscribe((values) => {
      this.productSelected = values.map((p: any) => p.produit).filter((id: any) => id); // Mise à jour des produits sélectionnés
    });

    // Exemple d'initialisation des fournisseurs
    this.fournisseurs = [
      { id: 1, nom: 'Dupont', prenom: 'Jean', telephone  :''},
      { id: 2, nom: 'Martin', prenom: 'Alice', telephone : ''}
    ];
    // Optionnel : Ajouter un produit par défaut
    this.addProduit();

    this.getListProducts();
  }

  get produits(): FormArray {
    return this.achatForm.get('produits') as FormArray;
  }

  addProduit(): void {
    // Vérifier s'il y a déjà un produit dans la liste
    if (this.produits.length > 0) {
      const lastProduit = this.produits.at(this.produits.length - 1) as FormGroup;

      // Vérifier si le dernier produit est valide
      if (!lastProduit.valid) {
        this.snackBarService.sendNotification('Veuillez remplir tous les champs du dernier produit avant d\'ajouter un autre.', SNACKTYPE.ERROR)
        return;
      }
    }

    // Ajouter un nouveau produit
    const produitGroup = this.fb.group({
      produit: ['', Validators.required],
      prixAchat: [0, [Validators.required, Validators.min(1)]],
      quantite: [0, [Validators.required, Validators.min(1)]]
    });
    this.produits.push(produitGroup);
  }


  removeProduit(index: number): void {
    if (this.produits.length > 1) {
      this.produits.removeAt(index);
    }else {
      this.snackBarService.sendNotification('Vous devez selectionner au moins un produit', SNACKTYPE.ERROR)
    }

  }

  onSubmit(): void {
    if (this.achatForm.valid) {
      // Traitement de la soumission du formulaire
      console.log(this.achatForm.value);
    }
  }

  onCancel(): void {
    // Fermer la modale ou réinitialiser le formulaire
    this.matDialogRef.close();
  }

  getListProducts(){
    this.achatService.fetchData<Produit[]>("produit/list").subscribe(
      {
        next : (resp)=>{
          console.log("producs", resp)
          this.productList = resp;
        },
        error:(error)=>{
          console.log("error list produit", error)
          this.snackBarService.sendNotification("Errur sur la liste des produits", SNACKTYPE.ERROR)
        }
      }
    )
  }

  getListFournisseurs(){
    this.achatService.fetchData<Fournisseur[]>("fournisseur/list").subscribe(
      {
        next : (resp)=>{
          console.log("producs", resp)
          this.fournisseurs = resp;
        },
        error:(error)=>{
          console.log("error list produit", error)
          this.snackBarService.sendNotification("Errur sur la liste des produits", SNACKTYPE.ERROR)
        }
      }
    )
  }
}

import {Component, OnInit} from '@angular/core';
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatCard, MatCardContent, MatCardSubtitle, MatCardTitle} from "@angular/material/card";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable, MatTableDataSource
} from "@angular/material/table";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {NgForOf, NgIf} from "@angular/common";
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Fournisseur} from "../../fournisseurs/fournisseur";
import {Produit} from "../../../ui-components/produit/produit";
import {AchatService} from "../services/achat.service";
import {SnackService} from "../../../../shared/services/snack.service";
import {SNACKTYPE} from "../../../../enums/snack-type";
import {Router} from "@angular/router";
import Swal from "sweetalert2";
import {MatProgressBar} from "@angular/material/progress-bar";
import {AlertService} from "../../../../shared/services/alert.service";

@Component({
  selector: 'app-add-purchase',
  standalone: true,
  imports: [
    MatButton,
    MatCard,
    MatCardContent,
    MatCardTitle,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatError,
    MatFormField,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatIcon,
    MatIconButton,
    MatInput,
    MatLabel,
    MatOption,
    MatRow,
    MatRowDef,
    MatSelect,
    MatTable,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    MatCardSubtitle,
    MatHeaderCellDef,
    MatProgressBar
  ],
  templateUrl: './add-purchase.component.html',
  styleUrls: ['./add-purchase.component.scss']
})
export class AddPurchaseComponent implements OnInit{

  achatForm !: FormGroup;
  fournisseurs : Fournisseur[] = [];
  productList : Produit[] = [];
  productSelected : number[] = []
  displayedColumns: string[] = ['produit','prix_achat','quantite','menu'];
  produitDataSource : MatTableDataSource<any> = new MatTableDataSource();
  isLoading : boolean = false;

  constructor(
    private fb: FormBuilder,
    private achatService: AchatService,
    private snackBarService: SnackService,
    private router: Router,
    private alertService : AlertService
  ) {
  }


  ngOnInit(): void {
    this.achatForm = this.fb.group({
      prenom: ['', Validators.required],
      nom : ['', Validators.required],
      telephone : ['', Validators.required],
      produits: this.fb.array([])
    });

    this.achatForm.get('produits')?.valueChanges.subscribe((values) => {
      this.productSelected = values.map((p: any) => p.produit).filter((id: any) => id); // Mise à jour des produits sélectionnés
    });
    this.addProduit();
    this.getListProducts();
  }

  get produits(): FormArray {
    return this.achatForm.get('produits') as FormArray;
  }

  addProduit(): void {
    if (this.produits.length > 0) {
      const lastProduit = this.produits.at(this.produits.length - 1) as FormGroup;
      if (!lastProduit.valid) {
        this.snackBarService.sendNotification('Veuillez remplir tous les champs du dernier produit avant d\'ajouter un autre.', SNACKTYPE.ERROR)
        return;
      }
    }
    const produitGroup = this.fb.group({
      produit: ['', [Validators.required]],
      prixAchat: [0, [Validators.required, Validators.min(1)]],
      quantite: [0, [Validators.required, Validators.min(1)]]
    });
    this.produits.push(produitGroup);
    this.produitDataSource.data = [...this.produits.controls];
  }

  removeProduit(index: number): void {
    if (this.produits.length > 1) {
      this.produits.removeAt(index);
      this.produitDataSource.data = [...this.produits.controls];
    }else {
      this.snackBarService.sendNotification('Vous devez selectionner au moins un produit', SNACKTYPE.ERROR)
    }

  }

  onSubmit(): void {
    if (this.achatForm.valid) {
     /*Swal.fire({
        title: 'Confirmation',
        text: `Voulez-vous vraiment valider cette approvisionnement ?`,
        showCancelButton: true,
        confirmButtonText: 'Oui',
        cancelButtonText: 'Non'
      })*/
      this.alertService.showConfirmation("Confirmation", "Voulez-vous vraiment valider cette approvisionnement ?").then((result) => {
        if (result["value"]) {
          this.isLoading = true;
          let data = {
            "fournisseur" : {
              prenom : this.achatForm.get("prenom")?.value,
              nom : this.achatForm.get("nom")?.value,
              telephone : this.achatForm.get("telephone")?.value,
            },
            "produit" : this.achatForm.get("produits")?.value?.map((produit:any)=>{
              return {...produit,"produit":{"id":produit?.produit}}
            }),
          }
          this.achatService.add(data).subscribe({
              next : (resp : any) => {
                this.snackBarService.sendNotification(resp?.detail, SNACKTYPE.SUCCESS)
                this.achatForm.reset();
                this.produits.clear();
                this.addProduit();
              },
              error : (err : any) => {
                this.snackBarService.sendNotification(err.message, SNACKTYPE.ERROR)
              },
            complete : ()=>{
              this.isLoading = false;
            }
            }
          );
         }
       })
    }
  }

  getListProducts(){
    this.achatService.fetchData<Produit[]>("produit/list").subscribe({
        next : (resp)=>{
          this.productList = resp;
        },
        error:(error)=>{
          this.snackBarService.sendNotification("Errur : "+error.message, SNACKTYPE.ERROR)
        }
      }
    )
  }


}

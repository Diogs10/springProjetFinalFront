import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { ACTIONTYPE } from 'src/app/enums/action-type';
import { VenteService } from '../services/vente.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ProduitService } from '../../produit/services/produit.service';
import { TablerIconsModule } from 'angular-tabler-icons';
import { Produit } from '../../produit/produit';
import { SNACKTYPE } from 'src/app/enums/snack-type';
import { NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent, NgSelectConfig, NgSelectModule } from '@ng-select/ng-select';

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
      TablerIconsModule,
      MatTableModule,
      MatSelect,
      MatOption,
      NgLabelTemplateDirective,
      NgOptionTemplateDirective,
      NgSelectComponent,
      NgSelectModule
    ],
  templateUrl: './vente-form.component.html',
  styleUrl: './vente-form.component.scss'
})
export class VenteFormComponent implements OnInit{
  venteForm!: FormGroup
  action: ACTIONTYPE;
  steps={step1:1,step2:2,step3:3,}
  ventes: MatTableDataSource<any> = new MatTableDataSource();
  displayedColumns: string[] = ['produit','prix_vente_grammes','quantite','menu',];
  produits: Produit[];
  constructor(
    private fb: FormBuilder,
    private venteService: VenteService,
    private snackBarService: SnackService,
    private activateRoute: ActivatedRoute,
    private produitService: ProduitService,
    private router: Router,
    private config: NgSelectConfig
  ) {
  }
  ngOnInit(): void {
    this.initializeForm();
    this.getProduit()
  }

  getProduit(){
    this.produitService.getAll().subscribe({
      next:(response)=>{
        this.produits = response
      },
    })
  }
  initializeForm(): void {
    this.venteForm = this.fb.group({
      prenom: ['', [Validators.required]],
      nom: ['', [Validators.required]],
      produits: this.fb.array([]) // FormArray pour gérer les lignes dynamiques
    });

    this.addVenteNewLine(); // Ajoute une première ligne par défaut
  }
  
  get ventesArray(): FormArray {
    return this.venteForm.get('produits') as FormArray;
  }
  onCancel(): void {
  }

  addVenteNewLine(): void {
    const venteGroup = this.fb.group({
      produit: ['', Validators.required,],
      prix_vente_grammes: [0, [Validators.required, Validators.min(1)]],
      quantite: [1, [Validators.required, Validators.min(1)]]
    });

    this.ventesArray.push(venteGroup);
    this.ventes.data = [...this.ventesArray.controls];
    this.refreshTable();
  }

  refreshTable(): void {
    this.ventes.data = this.ventesArray.value;
  }

  removeVenteLine(index: number): void {
    if(this.ventesArray.length > 1){
      this.ventesArray.removeAt(index);
      this.ventes.data = [...this.ventesArray.controls];
    }else {
      this.snackBarService.sendNotification('Vous devez selectionner au moins un produit', SNACKTYPE.ERROR)
    }
  }

  confirmVente(): void {
    if (this.venteForm.valid) {
      const produits = this.venteForm.get("produits")?.value?.map((produit:any)=>{
        return {...produit,"produit":{"id":produit?.produit}}
      })
      let payload = {
        "client":{
          "prenom": this.venteForm.get("prenom")?.value,
          "nom": this.venteForm.get("nom")?.value,
        },
        produits
      }
      Swal.fire({
        title: 'Confirmation',
        text: 'Voulez-vous vraiment confirmer la vente',
        showCancelButton: true,
        confirmButtonText: 'Oui',
        cancelButtonText: 'Non'
      }).then((result) => {
          if (result["value"] == true) {
            this.venteService.add(payload).subscribe({

              next:(response)=>{
                this.snackBarService.sendNotification("Vente enregistrée avec succès!",SNACKTYPE.SUCCESS)
                this.router.navigate(["ventes-produits/ventes"])
              },
              error:(error:any)=>{
                Swal.fire({
                  icon: 'error',
                  title: 'Erreur',
                  text: error.message
                });
              }
            })
          }
      });


      // Réinitialiser le formulaire après confirmation
      this.venteForm.reset();
      this.ventesArray.clear();
      this.addVenteNewLine();
      this.refreshTable();
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Veuillez remplir toutes les lignes correctement.'
      });
    }
  }
}

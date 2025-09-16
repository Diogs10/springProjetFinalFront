import { Component, OnInit } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MatDialog } from '@angular/material/dialog';
import { ACTIONTYPE } from 'src/app/enums/action-type';
import { environment } from 'src/environments/environment';
import { BadgerService } from 'src/app/shared/services/badger.service';
import { Matiere } from 'src/app/enums/matiere';
import { DisplayPhotoComponent } from 'src/app/shared/display-photo/display-photo.component';
import { Vente } from './vente';
import { VenteService } from './services/vente.service';
import { VenteFormComponent } from './vente-form/vente-form.component';
import { Router } from '@angular/router';
import { ReceiptComponent } from 'src/app/receipt/receipt.component';

@Component({
  selector: 'app-produit',
  standalone: true,
  imports: [
    MaterialModule,
    MatMenuModule,
    MatButtonModule,
    CommonModule,
    TablerIconsModule,
    MatProgressBarModule,
    NgScrollbarModule
  ],
  templateUrl: './vente.component.html',
  styleUrl: './vente.component.scss'
})
export class VenteComponent implements OnInit{
  ventes: Vente[] = [];
  matDialogRef: any;
  isLoading:boolean = false;
  displayedColumns: string[] = ['nom','prix_vente_grammes','matiere','genre','menu',];
  constructor(
    private venteService: VenteService,
    private matDialog: MatDialog,
    private badgerService: BadgerService,
    private router: Router,
  ){}
  ngOnInit(): void {
    this.getVentes()
  }

  getVentes(){
    this.isLoading = true
    this.venteService.getAll().subscribe({
      next:(response)=>{
        if(response){
          this.isLoading = false
          this.ventes = response
        }
      },
      error:(error)=>{
        this.isLoading = false
        console.log('erreur', error);
      }
    })
  }

  goToVenteForm(){
    this.router.navigate(['/ventes-produits/nouvelle-vente'])
  }

  updateProduit(item: Vente){
    // this.matDialogRef = this.matDialog.open(VenteFormComponent, {
    //   panelClass: 'event-form-dialog',
    //   minWidth: '40rem',
    //   height: 'auto',
    //   data:{
    //     action: ACTIONTYPE.EDIT,
    //     item: item
    //   }
    // })
    // this.matDialogRef.afterClosed().subscribe((resp: any) => {
    //   this.getProduits()
    // });
  }

  getFacture(item: Vente) {
    this.matDialogRef = this.matDialog.open(ReceiptComponent, {
      panelClass: 'custom-dialog-container',
      maxWidth: '50vw',
      width: '50vw',
      maxHeight: '80vh',
      data: {
        action: ACTIONTYPE.EDIT,
        item: item
      }
    });
  }
  

  getClassStatus(badge: Matiere){
    return this.badgerService.getClassStatus(badge)
  }

  displayPhoto(image: string){
    this.matDialogRef = this.matDialog.open(DisplayPhotoComponent, {
      panelClass: 'event-form-dialog',
      minWidth: '30rem',
      height: '30rem',
      data:{
        image: image
      }
    })
  }

}

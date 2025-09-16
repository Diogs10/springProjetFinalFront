import { ProduitService } from './services/produit.service';
import {Component, OnInit, ViewChild} from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MatDialog } from '@angular/material/dialog';
import { ACTIONTYPE } from 'src/app/enums/action-type';
import { Produit } from './produit';
import { ProduitFormComponent } from './produit-form/produit-form.component';
import { BadgerService } from 'src/app/shared/services/badger.service';
import { Matiere } from 'src/app/enums/matiere';
import {MatTableDataSource} from "@angular/material/table";
import Swal from "sweetalert2";
import {SNACKTYPE} from "../../../enums/snack-type";
import {SnackService} from "../../../shared/services/snack.service";
import {MatPaginator, PageEvent} from "@angular/material/paginator";

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
    NgScrollbarModule,
  ],
  templateUrl: './produit.component.html',
  styleUrl: './produit.component.scss'
})
export class ProduitComponent implements OnInit{
  @ViewChild('paginator') paginator: MatPaginator;
  produits = [];
  dataSource: MatTableDataSource<any>;
  matDialogRef: any;
  isLoading:boolean = false;
  length: number = 0;
  pageSizeOptions = [5, 10, 25, 100, 500, 1000];
  pageIndex: number = 0;
  pageSize: number = 5;
  displayedColumns: string[] = ['nom','code','prix','categorie','menu',];
  constructor(
    private produitService: ProduitService,
    private matDialog: MatDialog,
    private badgerService: BadgerService,
    private snackBarService: SnackService
  ){}
  ngOnInit(): void {
    this.getProduits(this.pageIndex, this.pageSize);
  }

  getProduits(page:number,pageSize:number){
    this.isLoading = true
    this.produitService.list('produits', page, pageSize).subscribe({
      next:(response)=>{
        if(response){
          this.isLoading = false;
          this.dataSource = new MatTableDataSource(response.data.content);
          this.length = response.data.totalElements;

        }
      },
      error: (error) => {
        this.snackBarService.sendNotification(error.message, SNACKTYPE.ERROR);
        this.isLoading = false;
      }
    })
  }

  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getProduits(this.pageIndex, this.pageSize);
  }

  addProduit(){
    this.matDialogRef = this.matDialog.open(ProduitFormComponent, {
      panelClass: 'event-form-dialog',
      minWidth: '40rem',
      height: 'auto',
      data:{
        action: ACTIONTYPE.NEW
      }
    })
    this.matDialogRef.afterClosed().subscribe((resp: any) => {
      if(resp){
        this.getProduits(this.pageIndex, this.pageSize);
      }
    });
  }

  updateProduit(item: Produit){
    this.matDialogRef = this.matDialog.open(ProduitFormComponent, {
      panelClass: 'event-form-dialog',
      minWidth: '40rem',
      height: 'auto',
      data:{
        action: ACTIONTYPE.EDIT,
        item: item
      }
    })
    this.matDialogRef.afterClosed().subscribe((resp: any) => {
      if(resp){
        this.getProduits(this.pageIndex, this.pageSize);
      }
    });
  }

  getClassStatus(badge: Matiere){
    return this.badgerService.getClassStatus(badge)
  }

  deleteProduit(element : Produit){
    Swal.fire({
      title: 'Confirmation',
      text: `Voulez-vous vraiment supprimer ce produit ?`,
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non'
    }).then((result) => {
      if (result["value"]) {
        this.isLoading = true;
        this.produitService.delete(element.id).subscribe({
          next:(response)=>{
            this.getProduits(this.pageIndex, this.pageSize);
            this.snackBarService.sendNotification("Le produit a bien été supprimé", SNACKTYPE.SUCCESS)
          },
          error: (error) => {
            this.snackBarService.sendNotification(error.message, SNACKTYPE.ERROR);
            this.isLoading = false;
          }
        })
      }
    });

  }

  applyFilter(event: Event): void {
    // const filterValue = (event.target as HTMLInputElement).value;
    // this.produits.filter = filterValue.trim().toLowerCase();
    // if (this.produits.paginator) {
    //   this.produits.paginator.firstPage();
    // }
  }

}

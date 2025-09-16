import { FournisseurService } from './services/fournisseur.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MatDialog } from '@angular/material/dialog';
import { ACTIONTYPE } from 'src/app/enums/action-type';
import { Fournisseur } from './fournisseur';
import { FournisseurFormComponent } from './fournisseur-form/fournisseur-form.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { SnackService } from 'src/app/shared/services/snack.service';
import { SNACKTYPE } from 'src/app/enums/snack-type';

@Component({
  selector: 'app-fournisseur',
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
  templateUrl: './fournisseur.component.html',
  styleUrl: './fournisseur.component.scss'
})
export class FournisseurComponent implements OnInit{
  fournisseurs: MatTableDataSource<Fournisseur> = new MatTableDataSource();
  matDialogRef: any;
  isLoading: boolean = false;
  displayedColumns: string[] = ['prenom','nom','menu'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(
    private fournisseurService: FournisseurService ,
    private matDialog: MatDialog,
    private snackBarService: SnackService,
  ){}
  ngOnInit(): void {
    this.getFournisseurs();
  }

  getFournisseurs(){
    this.isLoading = true
    this.fournisseurService.getAll().subscribe({
      next:(response)=>{
        if(response){
          this.isLoading = false
          this.fournisseurs.data = response.reverse();
        }
      },
      error:(error)=>{
        this.isLoading = false
        console.log('erreur', error);
        this.snackBarService.sendNotification("Erreur : "+error.message, SNACKTYPE.ERROR);
      }
    })
  }

  addPurete(){
    this.matDialogRef = this.matDialog.open(FournisseurFormComponent, {
      panelClass: 'event-form-dialog',
      minWidth: '40rem',
      height: 'auto',
      data:{
        action: ACTIONTYPE.NEW
      }
    })
    this.matDialogRef.afterClosed().subscribe((resp: any) => {
      this.getFournisseurs()
    });
  }

  updatePurete(item: Fournisseur){
    this.matDialogRef = this.matDialog.open(FournisseurFormComponent, {
      panelClass: 'event-form-dialog',
      minWidth: '40rem',
      height: 'auto',
      data:{
        action: ACTIONTYPE.EDIT,
        item: item
      }
    })
    this.matDialogRef.afterClosed().subscribe((resp: any) => {
      this.getFournisseurs()
    });
  }

  deleteFournisseur(item: Fournisseur): void {
      Swal.fire({
        title: 'Confirmation',
        text: `Voulez-vous vraiment supprimer ce fournisseur?`,
        showCancelButton: true,
        confirmButtonText: 'Oui',
        cancelButtonText: 'Non'
    }).then((result) => {
        if (result["value"]) {
          this.fournisseurService.delete(item.id).subscribe({
            next: (response) =>{
                if(response){
                  this.snackBarService.sendNotification("Fournisseur supprimé avec succès",SNACKTYPE.SUCCESS)
                  this.matDialogRef.close()
                }
            },
            error: (error)=>{
              this.snackBarService.sendNotification("Une erreur est survenue ",SNACKTYPE.SUCCESS)
            }
          })
        }
    });
  }

  ngAfterViewInit() {
    this.fournisseurs.paginator = this.paginator;
  }
}

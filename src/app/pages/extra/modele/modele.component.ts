import {Component, OnInit, ViewChild} from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MatDialog } from '@angular/material/dialog';
import { ModeleService } from './services/modele.service';
import { ModeleFormComponent } from './modele-form/modele-form.component';
import { Modele } from './modele';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {ACTIONTYPE} from "../../../enums/action-type";
import Swal from "sweetalert2";
import {SNACKTYPE} from "../../../enums/snack-type";
import {SnackService} from "../../../shared/services/snack.service";

@Component({
  selector: 'app-modele',
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
  templateUrl: './modele.component.html',
  styleUrl: './modele.component.scss'
})
export class ModeleComponent implements OnInit{
  modeles: MatTableDataSource<Modele> = new MatTableDataSource();
  matDialogRef: any;
  displayedColumns: string[] = ['modele', 'categorie', 'menu'];
  isLoading: boolean = false
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.modeles.paginator = this.paginator;
  }
  constructor(
    private modeleService: ModeleService,
    private matDialog: MatDialog,
    private snackBarService: SnackService
  ){}
  ngOnInit(): void {
    this.getModeles()
  }

  getModeles(){
    this.isLoading = true
    this.modeleService.getAll().subscribe({
      next:(response)=>{
        this.isLoading = false
        if(response){
          this.modeles.data = response.reverse()
        }
      },
      error: (error) => {
        this.snackBarService.sendNotification(error.message, SNACKTYPE.ERROR);
        this.isLoading = false;
      }
    })
  }

  addMarque(){
    this.matDialogRef = this.matDialog.open(ModeleFormComponent, {
      panelClass: 'event-form-dialog',
      minWidth: '40rem',
      height: 'auto',
      data : {
        action : ACTIONTYPE.NEW
      }
    })
    this.matDialogRef.afterClosed().subscribe((resp: any) => {
      if(resp){
        this.modeles.data = [resp , ...this.modeles.data]
      }
    });
  }

  updateModele(element : Modele) {
    this.matDialogRef = this.matDialog.open(ModeleFormComponent, {
      panelClass: 'event-form-dialog',
      minWidth: '40rem',
      height: 'auto',
      data : {
        action : ACTIONTYPE.EDIT,
        item : element
      }
    })
    this.matDialogRef.afterClosed().subscribe((resp: any) => {
      console.log("update", this.modeles.data)
      if(resp){
        this.modeles.data = [resp , ...this.modeles.data.filter(modele => modele.id != resp.id)]
      }
    });
  }

  deleteModele(element : Modele) {
    Swal.fire({
      title: 'Confirmation',
      text: `Voulez-vous vraiment supprimer ce modele ?`,
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non'
    }).then((result) => {
      if (result["value"]) {
        this.isLoading = true;
        this.modeleService.delete(element.id).subscribe({
          next:(response)=>{
            this.modeles.data = [...this.modeles.data.filter(modele => modele.id !== element.id)];
            this.snackBarService.sendNotification("Le modele a bien été supprimé", SNACKTYPE.SUCCESS)
          },
          error : (error) =>{
            this.snackBarService.sendNotification("Erreur : "+error.message, SNACKTYPE.ERROR)
            console.error("error", error)
            this.isLoading = false;
          },
          complete : ()=>{
            this.isLoading = false;
          }
        })
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.modeles.filter = filterValue.trim().toLowerCase();
    if (this.modeles.paginator) {
      this.modeles.paginator.firstPage();
    }
  }

}

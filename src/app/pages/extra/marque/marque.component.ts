import {Component, OnInit, ViewChild} from '@angular/core';
import { MarqueService } from './services/marque.service';
import { Marque } from './marque';
import { MaterialModule } from 'src/app/material.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MatDialog } from '@angular/material/dialog';
import { MarqueFormComponent } from './marque-form/marque-form.component';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {ACTIONTYPE} from "../../../enums/action-type";
import {Categorie} from "../categories/categorie";
import Swal from "sweetalert2";
import {SNACKTYPE} from "../../../enums/snack-type";
import {SnackService} from "../../../shared/services/snack.service";

@Component({
  selector: 'app-marque',
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
  templateUrl: './marque.component.html',
  styleUrl: './marque.component.scss'
})
export class MarqueComponent implements OnInit{
  marques: MatTableDataSource<Marque> = new MatTableDataSource();
  matDialogRef: any;
  displayedColumns: string[] = ['marque', 'purete', 'prix', 'menu'];
  isLoading: boolean = false
  constructor(
    private marqueService: MarqueService,
    private matDialog: MatDialog,
    private snackBarService: SnackService,
  ){}

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.marques.paginator = this.paginator;
  }
  ngOnInit(): void {
    this.getMarques()
  }

  getMarques(){
    this.isLoading = true
    this.marqueService.getAll().subscribe({
      next:(response)=>{
        this.isLoading = false
        if(response){
          this.marques.data = response.reverse()
        }
      },
      error: (error) => {
        this.snackBarService.sendNotification(error.message, SNACKTYPE.ERROR);
        this.isLoading = false;
      }
    })
  }

  addMarque(){
    this.matDialogRef = this.matDialog.open(MarqueFormComponent, {
      panelClass: 'event-form-dialog',
      minWidth: '40rem',
      height: 'auto',
      data : {
          item : null,
          action : ACTIONTYPE.NEW
      }
    })
    this.matDialogRef.afterClosed().subscribe((resp: any) => {
      if(resp){
        this.marques.data = [resp, ...this.marques.data]
      }
    });
  }


  updateMarque(element : Marque){
    console.log("marque edit", element)
    this.matDialogRef = this.matDialog.open(MarqueFormComponent, {
      panelClass: 'event-form-dialog',
      minWidth: '40rem',
      height: 'auto',
      data : {
        item : element,
        action : ACTIONTYPE.EDIT
      }
    })
    this.matDialogRef.afterClosed().subscribe((resp: any) => {
      if(resp){
        this.marques.data = [resp, ...this.marques.data.filter(marque => marque.id != element.id)]
      }
    });
  }
  deleteMarque(element : Marque){
    Swal.fire({
      title: 'Confirmation',
      text: `Voulez-vous vraiment supprimer cette catégorie ?`,
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non'
    }).then((result) => {
      if (result["value"]) {
        this.isLoading = true;
        this.marqueService.delete(element.id).subscribe({
          next:(response)=>{
            console.log("res parent", response)
            this.marques.data = [...this.marques.data.filter(marque => marque.id !== element.id)];
            this.snackBarService.sendNotification("La catégorie a bien été supprimée", SNACKTYPE.SUCCESS)
          },
          error: (error) => {
            this.snackBarService.sendNotification(error.message, SNACKTYPE.ERROR);
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
    this.marques.filter = filterValue.trim().toLowerCase();
    if (this.marques.paginator) {
      this.marques.paginator.firstPage();
    }
  }

}

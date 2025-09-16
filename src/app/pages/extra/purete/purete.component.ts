import {PureteService} from './services/purete.service';
import {Component, OnInit, ViewChild} from '@angular/core';
import {MaterialModule} from 'src/app/material.module';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {CommonModule} from '@angular/common';
import {TablerIconsModule} from 'angular-tabler-icons';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {NgScrollbarModule} from 'ngx-scrollbar';
import {MatDialog} from '@angular/material/dialog';
import {PureteFormComponent} from './purete-form/purete-form.component';
import {Purete} from './purete';
import {ACTIONTYPE} from 'src/app/enums/action-type';
import {MatTableDataSource} from "@angular/material/table";
import {SnackService} from "../../../shared/services/snack.service";
import {SNACKTYPE} from "../../../enums/snack-type";
import Swal from "sweetalert2";
import {MatPaginator} from "@angular/material/paginator";

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
  templateUrl: './purete.component.html',
  styleUrl: './purete.component.scss'
})
export class PureteComponent implements OnInit{
  puretes: MatTableDataSource<Purete> = new MatTableDataSource();
  matDialogRef: any;
  displayedColumns: string[] = ['purete','menu'];
  isLoading:boolean = false;
  constructor(
    private pureteService: PureteService,
    private matDialog: MatDialog,
    private snackService : SnackService,
  ){}

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.puretes.paginator = this.paginator;
  }
  ngOnInit(): void {
    this.getPuretes()
  }

  getPuretes(){
    this.pureteService.getAll().subscribe({
      next:(response)=>{
        if(response){
          this.puretes.data = response.reverse()
        }
      },
      error:(error)=>{
        this.snackService.sendNotification("error : "+error?.message , SNACKTYPE.ERROR)
      }
    })
  }

  addPurete(){
    this.matDialogRef = this.matDialog.open(PureteFormComponent, {
      panelClass: 'event-form-dialog',
      minWidth: '40rem',
      height: 'auto',
      data:{
        action: ACTIONTYPE.NEW
      }
    })
    this.matDialogRef.afterClosed().subscribe((resp: any) => {
      if(resp){
        this.puretes.data = [resp, ...this.puretes.data]
      }
    });
  }

  updatePurete(item: Purete){
    this.matDialogRef = this.matDialog.open(PureteFormComponent, {
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
        this.puretes.data = [resp, ...this.puretes.data.filter(purete => purete.id != item.id)]
      }
    });
  }

  deletePurete(element : Purete) {
    Swal.fire({
      title: 'Confirmation',
      text: `Voulez-vous vraiment supprimer cette pureté ?`,
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non'
    }).then((result) => {
      if (result["value"]) {
        this.isLoading = true;
        this.pureteService.delete(element.id).subscribe({
          next:(response)=>{
            console.log("res parent", response)
            this.puretes.data = [...this.puretes.data.filter(purete => purete.id !== element.id)];
            this.snackService.sendNotification("La pureté a bien été supprimée", SNACKTYPE.SUCCESS)
          },
          error : (error) =>{
            this.snackService.sendNotification("Une érreur s'est produite", SNACKTYPE.ERROR)
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
    this.puretes.filter = filterValue.trim().toLowerCase();
    if (this.puretes.paginator) {
      this.puretes.paginator.firstPage();
    }
  }
}

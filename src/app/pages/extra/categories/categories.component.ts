import {Component, OnInit, ViewChild} from '@angular/core';
import {MaterialModule} from '../../../material.module';
import {CategorieService} from './services/categorie.service';
import {Categorie} from './categorie';
import {CommonModule} from '@angular/common';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {TablerIconsModule} from 'angular-tabler-icons';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {NgScrollbarModule} from 'ngx-scrollbar';
import {BadgerService} from 'src/app/shared/services/badger.service';
import {environment} from 'src/environments/environment';
import {MatDialog} from '@angular/material/dialog';
import {DisplayPhotoComponent} from 'src/app/shared/display-photo/display-photo.component';
import {ACTIONTYPE} from "../../../enums/action-type";
import {FormCategorieComponent} from "./form-categorie/form-categorie.component";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import Swal from "sweetalert2";
import {SNACKTYPE} from "../../../enums/snack-type";
import {SnackService} from "../../../shared/services/snack.service";

@Component({
  selector: 'app-categories',
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
  templateUrl: './categories.component.html',
})

export class CategorieComponent implements OnInit{
  constructor(
    private categorieService: CategorieService,
    private badgerService: BadgerService,
    private matDialog: MatDialog,
    private snackBarService: SnackService,
  ){}
  displayedColumns: string[] = [ 'nom', 'code', 'dateCreation', 'menu'];
  isLoading: boolean = false
  categories:  MatTableDataSource<Categorie> = new MatTableDataSource();
  matDialogRef:any;
  length: number = 0;
  pageSizeOptions = [5, 10, 25, 100, 500, 1000];
  pageIndex: number = 0;
  pageSize: number = 5;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.getCategories(this.pageIndex, this.pageSize);
  }

  ngAfterViewInit() {
    // this.categories.paginator = this.paginator;
  }

  getCategories(page:number,pageSize:number){
    this.isLoading = true
    this.categorieService.list('categories', page, pageSize).subscribe({
      next:(response)=>{
          this.isLoading = false
          this.categories = new MatTableDataSource(response.data.content);
          this.length = response.data.totalElements;
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
    this.getCategories(this.pageIndex, this.pageSize);
  }

  getClassStatus(status: string){
    return this.badgerService.getClassStatus(status)
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

    addCategory(){
      this.matDialogRef = this.matDialog.open(FormCategorieComponent, {
        panelClass: 'event-form-dialog',
        minWidth: '40rem',
        height: 'auto',
        data:{
          action: ACTIONTYPE.NEW
        }
      })
      this.matDialogRef.afterClosed().subscribe((resp: any) => {
        if(resp != null){
          this.getCategories(this.pageIndex, this.pageSize);
        }
      });
    }


  updateCategorie(element : Categorie){
    this.matDialogRef = this.matDialog.open(FormCategorieComponent, {
      panelClass: 'event-form-dialog',
      minWidth: '40rem',
      height: 'auto',
      data:{
        action: ACTIONTYPE.EDIT,
        item: element
      }
    })

    this.matDialogRef.afterClosed().subscribe((resp: any) => {
      if(resp != null){
        this.getCategories(this.pageIndex, this.pageSize);
      }
    });
  }

  deleteCategorie(element : Categorie){
    Swal.fire({
      title: 'Confirmation',
      text: `Voulez-vous vraiment supprimer cette catégorie ?`,
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non'
    }).then((result) => {
      if (result["value"]) {
        this.isLoading = true;
        this.categorieService.delete(element.id).subscribe({
          next:(response)=>{
            this.getCategories(this.pageIndex, this.pageSize);
            this.snackBarService.sendNotification("La catégorie a bien été supprimée", SNACKTYPE.SUCCESS)
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
    const filterValue = (event.target as HTMLInputElement).value;
    this.categories.filter = filterValue.trim().toLowerCase();
    if (this.categories.paginator) {
      this.categories.paginator.firstPage();
    }
  }
}

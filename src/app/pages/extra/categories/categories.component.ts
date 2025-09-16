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
import {MatPaginator} from "@angular/material/paginator";
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
  displayedColumns: string[] = ['image', 'nom', 'active', 'menu'];
  isLoading: boolean = false
  categories:  MatTableDataSource<Categorie> = new MatTableDataSource();
  matDialogRef:any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.getCategories();
  }

  ngAfterViewInit() {
    this.categories.paginator = this.paginator;
  }

  getCategories(){
    this.isLoading = true
    this.categorieService.getAll().subscribe({
      next:(response)=>{
          this.isLoading = false
        response = response.map((categorie:Categorie)=>{
          return {...categorie, image: environment.baseIMGURL+categorie.image}
        });
          this.categories.data = response.reverse();

      },
      error: (error) => {
        this.snackBarService.sendNotification(error.message, SNACKTYPE.ERROR);
        this.isLoading = false;
      }
    })
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
        console.log("resr parent", resp)
        if(resp != null){
            resp = {...resp, image: environment.baseIMGURL+resp.image}
            this.categories.data = [...this.categories.data, resp];
        }
      });
    }


  updateCategorie(element : Categorie){
    console.log(element);
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
      console.log("resr parent", resp)
      if(resp != null){
          resp = {...resp, image: environment.baseIMGURL+resp.image}
          this.categories.data = this.categories.data.filter(categorie => categorie.slug != resp.slug);
          this.categories.data = [...this.categories.data, resp];
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
        this.categorieService.delete(element.slug).subscribe({
          next:(response)=>{
            this.categories.data = [...this.categories.data.filter(categorie => categorie.slug !== element.slug)];
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

  updateStatus(element : Categorie){
    Swal.fire({
      title: 'Confirmation',
      text: `Voulez-vous vraiment ${!element.active ? "Activer" : "Désactiver"} la catégorie ${element.nom} ?`,
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non'
    }).then((result) => {
      if (result["value"]) {
        this.isLoading = true;
        this.categorieService.update({"active":!element.active}, element.slug).subscribe({
          next:(response)=>{
            response = {...response, image: environment.baseIMGURL+response.image}
            this.categories.data = [response,...this.categories.data.filter(categorie => categorie.slug !== element.slug)];
            this.snackBarService.sendNotification(`La catégorie a bien été ${response.active ? 'activée' : 'désactivée'}`, SNACKTYPE.SUCCESS)
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
    this.categories.filter = filterValue.trim().toLowerCase();
    if (this.categories.paginator) {
      this.categories.paginator.firstPage();
    }
  }





}

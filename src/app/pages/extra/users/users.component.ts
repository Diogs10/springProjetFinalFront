import {Component, OnInit, ViewChild} from '@angular/core';
import {MaterialModule} from '../../../material.module';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {CommonModule} from '@angular/common';
import {TablerIconsModule} from 'angular-tabler-icons';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {NgScrollbarModule} from 'ngx-scrollbar';
import {UserService} from './services/user.service';
import {User} from './user';
import {BadgerService} from 'src/app/shared/services/badger.service';
import {MatDialog} from '@angular/material/dialog';
import {UserFormComponent} from './user-form/user-form.component';
import {MatTableDataSource} from "@angular/material/table";
import {SnackService} from "../../../shared/services/snack.service";
import {SNACKTYPE} from "../../../enums/snack-type";
import {ACTIONTYPE} from "../../../enums/action-type";
import Swal from "sweetalert2";
import {Categorie} from "../categories/categorie";
import {environment} from "../../../../environments/environment";
import {MatPaginator} from "@angular/material/paginator";


@Component({
  selector: 'app-users',
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
  templateUrl: './users.component.html',
})
export class UsersComponent implements OnInit {
  displayedColumns: string[] = ['fullname', 'email', 'role','active' ,'menu'];
  usersList : MatTableDataSource<User> = new MatTableDataSource();
  matDialogRef:any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  private isLoading: boolean = false;
  constructor(
    private userService: UserService,
    private badger: BadgerService,
    private matDialog: MatDialog,
    private snackBarService : SnackService
  ){

  }
  ngOnInit(): void {
    this.getUsers()
  }
  ngAfterViewInit() {
    this.usersList.paginator = this.paginator;
  }

  getUsers(){
    this.userService.getAll().subscribe({
      next:(response: User[])=>{
        this.usersList.data = response.reverse()
      },
      error: (error: Error)=>{
      this.snackBarService.sendNotification("Erreur : "+error.message, SNACKTYPE.ERROR)
      }
    })
  }

  getClassStatus(status: string){
    return this.badger.getClassStatus(status)
  }

  openModal(element : User |null = null){
    this.matDialogRef = this.matDialog.open(UserFormComponent, {
      panelClass: 'event-form-dialog',
      minWidth: '40rem',
      height: 'auto',
      data :{
        action : element ? ACTIONTYPE.EDIT : ACTIONTYPE.NEW,
        item : element
      }
    })

    this.matDialogRef.afterClosed().subscribe((resp: any) => {
      if(resp){
        //this.usersList.data = [resp, ...this.usersList.data.filter(user => user.id !== resp.id)];
        this.getUsers();
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.usersList.filter = filterValue.trim().toLowerCase();
    if (this.usersList.paginator) {
      this.usersList.paginator.firstPage();
    }
  }


  updateStatus(element : User){
    Swal.fire({
      title: 'Confirmation',
      text: `Voulez-vous vraiment ${!element.is_active ? "Activer" : "Désactiver"} l'utilisateur :  ${element.first_name + ' '+element.last_name} ?`,
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non'
    }).then((result) => {
      if (result["value"]) {
        this.isLoading = true;
        this.userService.update({"active":!element.is_active}, element.id).subscribe({
          next:(response)=>{
            this.usersList.data = [response,...this.usersList.data.filter(user => user.id !== element.id)];
            this.snackBarService.sendNotification(`L'utilisateur a bien été ${response.is_active ? 'activé' : 'désactivé'}`, SNACKTYPE.SUCCESS)
          },
          error: (error) => {
            this.snackBarService.sendNotification(error.message, SNACKTYPE.ERROR);
            this.isLoading = false;
          }
        })
      }
    });
  }

  deleteUser(element : User) {
    Swal.fire({
      title: 'Confirmation',
      text: `Voulez-vous vraiment supprimer cet utilisateur ?`,
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non'
    }).then((result) => {
      if (result["value"]) {
        this.isLoading = true;
        this.userService.delete(element.id).subscribe({
          next:(response)=>{
            this.usersList.data = [...this.usersList.data.filter(user => user.id !== element.id)];
            this.snackBarService.sendNotification("L' utilisateur a bien été supprimé", SNACKTYPE.SUCCESS)
          },
          error: (error) => {
            this.snackBarService.sendNotification(error.message, SNACKTYPE.ERROR);
            this.isLoading = false;
          }
        })
      }
    });
  }
}

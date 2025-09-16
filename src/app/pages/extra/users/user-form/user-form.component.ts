import {Component, Inject, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { Roles } from "src/app/enums/roles";
import { User } from '../user';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelect } from '@angular/material/select';
import Swal from 'sweetalert2';
import {ACTIONTYPE} from "../../../../enums/action-type";
import {UserService} from "../services/user.service";
import {SnackService} from "../../../../shared/services/snack.service";
import {SNACKTYPE} from "../../../../enums/snack-type";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
  selector: 'app-user-form',
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
    MatSelect,
    MatProgressSpinner
  ],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  userForm!: FormGroup;
  roles: any = [
    {id:1,name:"admin"},
  ];
  action : string = "";
  modalTitle : string = "";
  selectedUser : User | null = null;
  isLoading : boolean = false;

  constructor(
    private fb: FormBuilder,
    public matDialogRef: MatDialogRef<UserFormComponent>,
    private userService : UserService,
    private snackBarService: SnackService,
    @Inject(MAT_DIALOG_DATA) private data: any,
  ) {
    this.action = data.action
    if (this.action == ACTIONTYPE.NEW) {
      this.modalTitle = 'Ajout de produit';
      this.initializeForm();
    }else if(this.action == ACTIONTYPE.EDIT){
      this.modalTitle = 'Modification de produit'
      this.initializeForm(data.item);
    }
  }

  ngOnInit(): void {
 //   this.initializeForm();
  }

  initializeForm(data : User | null = null): void {
    this.userForm = this.fb.group({
      username: [data ? data.username : '', [Validators.required]],
      first_name: [data ? data.first_name : '', [Validators.required]],
      last_name: [ data ? data.last_name: '', [Validators.required]],
      email: [data ? data.email:'', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: [data ? data?.phone : '', [Validators.required, Validators.pattern(/^(77|78|75|76|70)[0-9]{7}$/)]],
      dateNaiss: [data ? data.dateNaiss :'', [Validators.required]],
      bijouterie: [data ? data.bijouterie :'',],
      user_role: [data ? data.user_role.id: '', [Validators.required]],
      is_active: [true],
    });
    this.selectedUser = data;
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      Swal.fire({
        title: 'Confirmation',
        text: `Voulez-vous vraiment ${this.action === ACTIONTYPE.EDIT ? 'modifier' : 'ajouter'} cet utilisateur ?`,
        showCancelButton: true,
        confirmButtonText: 'Oui',
        cancelButtonText: 'Non'
      }).then((result) => {
        if (result["value"]) {
          const user: User = {
            ...this.userForm.value,
            is_superuser: false,
            is_staff: false,
            last_login: this.action === ACTIONTYPE.EDIT && this.selectedUser ? this.selectedUser.last_login : '',
            date_joined: this.action === ACTIONTYPE.EDIT && this.selectedUser ? this.selectedUser.date_joined : new Date().toISOString(),
            created_at: this.action === ACTIONTYPE.EDIT && this.selectedUser ? this.selectedUser.created_at : new Date().toISOString(),
            updated_at: new Date().toISOString(),
            groups: this.userForm.value.groups || [],
            user_permissions: this.userForm.value.user_permissions || []
          };
          const request$ = (this.action === ACTIONTYPE.EDIT && this.selectedUser)
            ? this.userService.updateUser(user, this.selectedUser?.id)
            : this.userService.addUser(user);
          request$.subscribe({
            next: (response ) => {
              console.log("response", response)
              this.matDialogRef.close(response.data);
              this.snackBarService.sendNotification(
                this.action === ACTIONTYPE.EDIT ? "Utilisateur modifié avec succès" : "Utilisateur ajouté avec succès",
                SNACKTYPE.SUCCESS
              );
            },
            error: (error) => {
              console.log("error user", error)
              this.snackBarService.sendNotification("Erreur : "+error.meesage, SNACKTYPE.ERROR);
            }
          });
        }
      });


    }else{
      return
    }
  }

  onCancel(): void {
    this.matDialogRef.close();
  }
}

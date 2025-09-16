import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import Swal from 'sweetalert2';
import { SnackService } from 'src/app/shared/services/snack.service';
import { SNACKTYPE } from 'src/app/enums/snack-type';
import { ACTIONTYPE } from 'src/app/enums/action-type';
import { FournisseurService } from '../services/fournisseur.service';
import { Fournisseur } from '../fournisseur';

@Component({
  selector: 'app-fournisseur-form',
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
    ],
  templateUrl: './fournisseur-form.component.html',
  styleUrl: './fournisseur-form.component.scss'
})
export class FournisseurFormComponent implements OnInit{
  fournisseurForm!: FormGroup
  action: ACTIONTYPE;
  modalTitle: string | null;
  item: Fournisseur;
  constructor(
    private fb: FormBuilder,
    public matDialogRef: MatDialogRef<FournisseurFormComponent>,
    private fournisseurService: FournisseurService,
    private snackBarService: SnackService,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    this.action = data.action
    if (this.action == ACTIONTYPE.NEW) {
      this.modalTitle = 'Ajout de fournisseur'
      this.initializeForm();
    }else if(this.action == ACTIONTYPE.EDIT){
      this.modalTitle = 'Modification de fournisseur'
      this.item = data.item;
      this.initializeForm(data.item);
    }
  }
  ngOnInit(): void {
  }

    initializeForm(data?: Fournisseur): void {
      this.fournisseurForm = this.fb.group({
        prenom: [data?.prenom ? data?.prenom :'', [Validators.required]],
        nom: [data?.nom ? data?.nom :'', [Validators.required]]
      });
    }
  
    onSubmit(): void {
      if (this.fournisseurForm.valid) {
        let verb = this.action == ACTIONTYPE.EDIT ? "modifier": "ajouter"
        Swal.fire({
          title: 'Confirmation',
          text: `Voulez-vous vraiment ${verb} ce fournisseur?`,
          showCancelButton: true,
          confirmButtonText: 'Oui',
          cancelButtonText: 'Non'
      }).then((result) => {
          if (result["value"]) {
            if (this.action == ACTIONTYPE.NEW) {
              this.fournisseurService.add(this.fournisseurForm.value).subscribe({
                next: (response) =>{
                    if(response){
                      this.snackBarService.sendNotification("Fournisseur ajouté avec succès",SNACKTYPE.SUCCESS)
                      this.matDialogRef.close()
                    }
                },
                error: (error)=>{
                  this.snackBarService.sendNotification("Une erreur est survenue ",SNACKTYPE.SUCCESS)
                }
              }) 
            }          else{
              console.log('modification');
              
              this.fournisseurService.update(this.fournisseurForm.value, this.item.id).subscribe({
                next: (response) =>{
                    if(response){
                      this.snackBarService.sendNotification("Fournisseur modifié avec succès",SNACKTYPE.SUCCESS)
                      this.matDialogRef.close()
                    }
                },
                error: (error)=>{
                  this.snackBarService.sendNotification("Une erreur est survenue ",SNACKTYPE.SUCCESS)
                }
              })
            }
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

import {Component, ViewChild} from '@angular/core';
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatCard, MatCardContent, MatCardSubtitle, MatCardTitle} from "@angular/material/card";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable, MatTableDataSource
} from "@angular/material/table";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {MatMenu, MatMenuTrigger} from "@angular/material/menu";
import {MatPaginator} from "@angular/material/paginator";
import {MatProgressBar} from "@angular/material/progress-bar";
import {NgIf} from "@angular/common";
import {TablerIconsModule} from "angular-tabler-icons";
import {MatDialog} from "@angular/material/dialog";
import {SnackService} from "../../../shared/services/snack.service";
import {SNACKTYPE} from "../../../enums/snack-type";
import {ACTIONTYPE} from "../../../enums/action-type";
import Swal from "sweetalert2";
import {AchatService} from "./services/achat.service";
import {Achat} from "./achat";
import {AchatFormComponent} from "./achat-form/achat-form.component";
import {Router} from "@angular/router";
import {AlertService} from "../../../shared/services/alert.service";

@Component({
  selector: 'app-achats',
  standalone: true,
  imports: [
    MatButton,
    MatCard,
    MatCardContent,
    MatCardSubtitle,
    MatCardTitle,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatFormField,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatIcon,
    MatIconButton,
    MatInput,
    MatLabel,
    MatMenu,
    MatPaginator,
    MatProgressBar,
    MatRow,
    MatRowDef,
    MatTable,
    NgIf,
    TablerIconsModule,
    MatHeaderCellDef,
    MatMenuTrigger
  ],
  templateUrl: './achats.component.html',
  styleUrl: './achats.component.scss'
})
export class AchatsComponent {

  achats: MatTableDataSource<Achat> = new MatTableDataSource();
  matDialogRef: any;
  displayedColumns: string[] = ['date achat', 'fournisseur','prix total' ,'menu'];
  isLoading: boolean = false
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.achats.paginator = this.paginator;
  }
  constructor(
    private achatService: AchatService,
    private matDialog: MatDialog,
    private snackBarService: SnackService,
    private router: Router,
    private alertService : AlertService
  ){}
  ngOnInit(): void {
    this.getAchats()
  }

  getAchats(){
    this.isLoading = true
    this.achatService.getAll().subscribe({
      next:(response)=>{
        this.isLoading = false
        if(response){
          this.achats.data = response.reverse()
        }
      },
      error: (error) => {
        this.snackBarService.sendNotification(error.message, SNACKTYPE.ERROR);
        this.isLoading = false;
      }
    })
  }



  updateAchat(element : Achat) {
    this.matDialogRef = this.matDialog.open(AchatFormComponent, {
      panelClass: 'event-form-dialog',
      minWidth: '40rem',
      height: 'auto',
      data : {
        action : ACTIONTYPE.EDIT,
        item : element
      }
    })
    this.matDialogRef.afterClosed().subscribe((resp: any) => {
      console.log("update", this.achats.data)
      if(resp){
        this.achats.data = [resp , ...this.achats.data.filter(achat => achat.id != resp.id)]
      }
    });
  }

  deleteAchat(element : Achat) {
    this.alertService.showConfirmation('Confirmation', 'Voulez-vous vraiment supprimer ce achat ?' ).then((result) => {
      if (result["value"]) {
        this.isLoading = true;
        this.achatService.delete(element.id).subscribe({
          next:(response)=>{
            this.achats.data = [...this.achats.data.filter(achat => achat.id !== element.id)];
            this.snackBarService.sendNotification("Le achat a bien été supprimé", SNACKTYPE.SUCCESS)
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
    this.achats.filter = filterValue.trim().toLowerCase();
    if (this.achats.paginator) {
      this.achats.paginator.firstPage();
    }
  }

  getTotalByAchat(achat : Achat){
    return achat.achats.reduce((acc, curr) => acc + curr.prix_achat, 0);

  }

  goToAchatForm(){
    this.router.navigate(['/approvisionnement/achat-form']).then(()=>{
      console.log("errr")
    })
  }

}

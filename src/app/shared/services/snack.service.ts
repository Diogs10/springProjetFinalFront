import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SNACKTYPE } from 'src/app/enums/snack-type';

@Injectable({
  providedIn: 'root'
})
export class SnackService {
  constructor(private snackBar: MatSnackBar) {}


  /**
   * Cette fonction permet d'afficher les snackbar
   * @param message 
   * @param snackType 
   */
  sendNotification(message:string,snackType:SNACKTYPE){
    let classe = '';
    switch (snackType) {
      case SNACKTYPE.SUCCESS:
        classe = 'mycssSnackbarGreen'
        break;
      case SNACKTYPE.ERROR:
        classe = 'mycssSnackbarRed'
        break; 
      case SNACKTYPE.WARNING:
        classe = 'mycssSnackbarYellow'
        break;  
      default:
        classe = 'mycssSnackbarYellow'
        break;
    }
    this.snackBar.open(message,'OK',
      {
          verticalPosition: 'bottom',
          duration: 5000,
          panelClass: [classe],
      }
  );
  }
}

import { Injectable } from '@angular/core';
import { GENDER } from 'src/app/enums/gender';
import { Matiere } from 'src/app/enums/matiere';
import { Status } from 'src/app/enums/status';

@Injectable({
  providedIn: 'root'
})
export class BadgerService {

  constructor() { }

  getClassStatus(status: string | boolean){
    switch (status) {
      case Status.ADMIN:
        return 'bg-light-success text-success'
        break;
      case Status.CAISSIER:
        return 'bg-light-warning text-warning'
      case Status.MANAGER:
        return 'bg-light-error text-error'
      case Status.VENDEUR:
        return 'bg-light-primary text-primary'
      case Matiere.OR:
        return 'bg-light-warning text-warning'
      case Matiere.ARGENT:
        return 'bg-light text-black'
      case Matiere.MIXTE:
        return 'bg-light-success text-success'
      case GENDER.FEMME:
        return 'bg-light-pink text-pink'
      case GENDER.HOMME:
        return 'bg-light-primary text-primary'   
      case GENDER.ENFANT:
        return 'bg-light-success text-success'     
      default:
        return 'no-status text-no-status'
        break;
    }
  }
}

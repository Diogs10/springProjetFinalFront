import { Injectable } from '@angular/core';
import { GenericService } from 'src/app/shared/services/generic.service';
import { Fournisseur } from '../fournisseur';

@Injectable({
  providedIn: 'root'
})
export class FournisseurService extends GenericService<Fournisseur>{
  protected override uriGet(): string {
    return "fournisseurs-list/"
  }
  protected override uriPost(): string {
    return "fournisseur"
  }
  protected override uriPut(): string {
    return "fournisseur-update/"
  }

}

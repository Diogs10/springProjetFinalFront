import { Injectable } from '@angular/core';
import { GenericService } from 'src/app/shared/services/generic.service';
import { Produit } from '../produit';

@Injectable({
  providedIn: 'root'
})
export class ProduitService extends GenericService<Produit>{
  protected override uriGet(): string {
    return "produits"
  }
  protected override uriPost(): string {
    return "produits"
  }
  protected override uriPut(): string {
    return "produits/"
  }


}

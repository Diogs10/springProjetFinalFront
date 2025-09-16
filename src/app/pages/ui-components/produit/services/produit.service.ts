import { Injectable } from '@angular/core';
import { GenericService } from 'src/app/shared/services/generic.service';
import { Produit } from '../produit';

@Injectable({
  providedIn: 'root'
})
export class ProduitService extends GenericService<Produit>{
  protected override uriGet(): string {
    return "produit/list"
  }
  protected override uriPost(): string {
    return "produit/list"
  }
  protected override uriPut(): string {
    return "produit/update/"
  }


}

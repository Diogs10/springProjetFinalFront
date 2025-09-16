import { Injectable } from '@angular/core';
import { GenericService } from 'src/app/shared/services/generic.service';
import { Vente } from '../vente';

@Injectable({
  providedIn: 'root'
})
export class VenteService extends GenericService<Vente>{
  protected override uriGet(): string {
    return "vente/list-produit"
  }
  protected override uriPost(): string {
    return "vente/add-vente"
  }
  protected override uriPut(): string {
    return "produit/list"
  }
}

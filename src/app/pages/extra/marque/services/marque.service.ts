import { Injectable } from '@angular/core';
import { GenericService } from 'src/app/shared/services/generic.service';
import { Marque } from '../marque';

@Injectable({
  providedIn: 'root'
})
export class MarqueService extends GenericService<Marque>{
  protected override uriGet(): string {
    return "marque/list"
  }
  protected override uriPost(): string {
    return "marque/list"
  }
  protected override uriPut(): string {
    return "marque/"
  }

}

import { Injectable } from '@angular/core';
import { GenericService } from 'src/app/shared/services/generic.service';
import { Modele } from '../modele';

@Injectable({
  providedIn: 'root'
})
export class ModeleService extends GenericService<Modele>{
  protected override uriGet(): string {
    return "modele/list"
  }
  protected override uriPost(): string {
    return "modele/list"
  }
  protected override uriPut(): string {
    return "modele/"
  }

}

import { Injectable } from '@angular/core';
import { GenericService } from 'src/app/shared/services/generic.service';
import { Purete } from '../purete';

@Injectable({
  providedIn: 'root'
})
export class PureteService extends GenericService<Purete>{
  protected override uriGet(): string {
    return "purete/list"
  }
  protected override uriPost(): string {
    return "purete/list"
  }
  protected override uriPut(): string {
    return "purete/"
  }

}

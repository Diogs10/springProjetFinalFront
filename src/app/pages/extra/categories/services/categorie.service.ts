import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GenericService } from 'src/app/shared/services/generic.service';
import { Categorie } from '../categorie';
import {tap} from "rxjs";
import {environment} from "../../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CategorieService extends GenericService<Categorie>{
  protected override uriGet(): string {
    return "categories"
  }
  protected override uriPost(): string {
    return "categories"
  }
  protected override uriPut(): string {
    return "categories/"
  }


  constructor(public httpClient: HttpClient) {
    super(httpClient)
  }

}

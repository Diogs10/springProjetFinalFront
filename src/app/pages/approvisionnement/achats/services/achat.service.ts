import { Injectable } from '@angular/core';
import {GenericService} from "../../../../shared/services/generic.service";
import {Achat} from "../achat";
import {Observable, tap} from "rxjs";
import {environment} from "../../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AchatService extends GenericService<Achat>{


  protected uriGet(): string {
    return "achats-produit";
  }

  protected uriPost(): string {
    return "achat-produit/Add-or-Update";
  }

  protected uriPut(): string {
    return "achat-produit/";
  }



  fetchData<T>(uri: string): Observable<T> {
    return this.getHttp.get<T>(`${environment.baseURL}/${uri}`).pipe(
      tap(response => {
        console.log("response", response);
      })
    );
  }





}

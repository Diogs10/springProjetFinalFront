import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GenericService } from 'src/app/shared/services/generic.service';
import { User } from '../user';
import {map, Observable, tap} from "rxjs";
import * as http from "node:http";
import {UserResponse} from "../interfaces/user-response";
import {environment} from "../../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UserService extends GenericService<User> {
  protected override uriGet(): string {
    return "user/list"
  }
  protected override uriPost(): string {
    return "register/"
  }
  protected override uriPut(): string {
    return "user/"
  }

  constructor(public httpClient: HttpClient) {
    super(httpClient)
  }

   addUser(objet: object): Observable<UserResponse> {
    return this.httpClient.post<UserResponse>(`${environment.baseURL}/${this.uriPost()}`, objet);
  }
  updateUser(objet: object, id : number | string): Observable<UserResponse> {
    return this.httpClient.put<UserResponse>(`${environment.baseURL}/${this.uriPut()+id.toString()}`, objet);
  }
}

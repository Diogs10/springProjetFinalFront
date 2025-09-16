import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { catchError, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private jwtHelper = new JwtHelperService();
  private tokenCheckInterval: any;

  constructor(private _httpClient: HttpClient, private router: Router) {}

  /**
   * Ce service checker le token par intervalle de 30 minutes
   *
   */
  startTokenExpirationCheck() {
    this.tokenCheckInterval = setInterval(() => {
      this.checkTokenExpiration();
    }, 30 * 60 * 1000);
  }

  /**
   * Ce service savoir si le token est valide
   *
   */
  checkTokenExpiration() {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken && this.jwtHelper.isTokenExpired(accessToken)) {
      this.handleTokenExpired();
    }
  }

  /**
   * Fonction pour gérer l'expiration du token
   */
  private handleTokenExpired() {
    this.logout();
  }


  isAuthenticated(): boolean {
    const accessToken = localStorage.getItem('access_token');
    return !!(accessToken && !this.jwtHelper.isTokenExpired(accessToken));
  }

  signIn(credentials: { username: string; password: string }): Observable<any> {
    const body = {
      username: credentials.username,
      password: credentials.password,
    };
    return this._httpClient.post(`${environment.baseURL}/auth/signin`, body);
  }

  /**
   * Cette fonction retourne le jeton d'acces stocke dans le navigateur
   * @returns
   */
  getToken() {
    return JSON.parse(localStorage.getItem('access_token')!);
  }

/**
 * Cette fonction permet d'avoir l'utilisateur connecte
 * @returns
 */
  getConnectdUser(){
    return JSON.parse(localStorage.getItem('user')!)
  }

  /**
   * fonction utilisée pour la déconnexion
   */
  logout() {
    localStorage.clear();
    clearInterval(this.tokenCheckInterval);
    window.location.reload();
  }

  signUp(objet: object): Observable<any> {
    const header = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this._httpClient.post(
      `${environment.baseURL}register`,
      objet,
      { headers: header }
    );
  }

  setItemInlocalStorage(key:string, value:any){
    value = JSON.stringify(value);
    return localStorage.setItem(key,value);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export abstract class GenericService <T>{
  protected abstract uriGet(): string;
  protected abstract uriPost(): string;
  protected abstract uriPut(): string;

  constructor(protected http:HttpClient) { }

  getAll(): Observable<T[]> {
    return this.http.get<T[]>(`${environment.baseURL}/${this.uriGet()}`).pipe(
      tap(response => {
      })
    );
  }

  list(url:string, page:number, size:number) {
    return this.http.get<any>(environment.baseURL+ '/' + url + '?page=' + page + '&size=' + size + '&sortBy=dateCreation&sortDir=desc').pipe(
        tap((response) => {
      })
    );
  }

  add(objet:object): Observable<T>{
    const header = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post<T>(`${environment.baseURL}/${this.uriPost()}`,objet,{headers:header}).pipe(
      tap(response=>{
      })
    )
  }

  delete(id:number | string): Observable<T> {
    return this.http.delete<T>(`${environment.baseURL}/${this.uriPut()}${id}`).pipe(
      tap(response=>{
      }
    ))
  }

  update(objet:object, id : string | number): Observable<T>{
    const header = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.put<T>(`${environment.baseURL}/${this.uriPut()+id.toString()}`,objet,{headers:header}).pipe(
      tap(response=>{
      })
    )
  }

  addWithImage(data : object) : Observable<T>{
    return this.http.post<T>(`${environment.baseURL}/${this.uriPost()}`, data).pipe(
      tap(res=>{
        console.log("res", res)
      })
    )
  }
  updateWithImage(data : object, id : string | number) : Observable<T>{
    return this.http.put<T>(`${environment.baseURL}/${this.uriPut()+id.toString()}`, data).pipe(
      tap(res=>{
        console.log("res", res)
      })
    )
  }

  // @ts-ignore
  get getHttp() : HttpClient{
    return this.http;
  }


  // show(id:number):Observable<T>{
  //   return this.http.get<T>(`${environment.baseURL}/${this.uri()}/${id}`).pipe(
  //     tap(response=>{
  //     })
  //   )
  // }
}

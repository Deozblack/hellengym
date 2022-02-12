import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { AuthResponse, Trabajador, getTrabajadores } from '../interfaces/interfaces';
import {catchError, filter, map, tap} from 'rxjs/operators';
import { of, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = environment.baseUrl;
  private _trabajador!: Trabajador;
  
  get trabajador(){
    return {...this._trabajador};
  }

  constructor(private http: HttpClient) { }

  login(user: string, password: string){
    const url = `${this.baseUrl}/auth `;
    const body = {user,password};
  
    return this.http.post<AuthResponse>(url, body).pipe(
      tap(resp => {
        if(resp.ok){
          localStorage.setItem('token',resp.token!);
            this._trabajador = {
              uid: resp.uid!,
              name: resp.name!,
              lastName: resp.lastName!,
              role: resp.role!,
              phoneNumber: resp.phoneNumber!
            }
        }
      }),
      map(resp => resp.ok),
      catchError(err => of(err.error.msg))
    )
  }

  validarToken(): Observable<boolean>{
    const headers = new HttpHeaders()
      .set('x-token', localStorage.getItem('token') || '');

    const url = `${this.baseUrl}/auth/renew`;

    return this.http.get<AuthResponse>(url, { headers })
      .pipe(
        map( resp => {
          localStorage.setItem('token',resp.token!);
            this._trabajador = {
              uid: resp.uid!,
              name: resp.name!,
              lastName: resp.lastName!,
              phoneNumber: resp.phoneNumber!,
              role: resp.role!
            }
          return resp.ok;
        }),
        catchError(err => of(false))
      )
  }

  logout(){
    localStorage.removeItem('token');
  }

  crearTrabajador(name: string, lastName: string, phoneNumber:number, user:string, password:string, role:string){
    const url = `${this.baseUrl}/auth/nuevo-trabajador `;
    const body = {name, lastName, phoneNumber, user, password, role};

    return this.http.post<AuthResponse>(url, body).pipe(
      map(resp => resp.ok),
      catchError(err => of(err.error.msg))
    )
  }

  getTrabajadores(){
    const headers = new HttpHeaders()
    .set('x-token', localStorage.getItem('token') || '');

    const url = `${this.baseUrl}/auth/trabajadores `;
    return this.http.get<{trabajadores:any}>(url, {headers});
  }

  getTrabajador(id: string){
    const headers = new HttpHeaders()
    .set('x-token', localStorage.getItem('token') || '');

    const url = `${this.baseUrl}/auth/trabajadores/nuevo-trabajador/${id} `;
    return this.http.get<{trabajador:Trabajador}>(url, {headers})
  }
  actualizarTrabajador(trabajador:Trabajador){
    const headers = new HttpHeaders()
    .set('x-token', localStorage.getItem('token') || '');

    const url = `${this.baseUrl}/auth/trabajadores/nuevo-trabajador/${trabajador._id} `;
    return this.http.put(url,trabajador, {headers});
  }
  
  deleteTrabajador(trabajador: Trabajador){

    const headers = new HttpHeaders()
    .set('x-token', localStorage.getItem('token') || '');
  
    const url = `${this.baseUrl}/auth/trabajadores/${trabajador._id} `;
    console.log(trabajador._id);
    return this.http.delete(url, {headers});
  }


}

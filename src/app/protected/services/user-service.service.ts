import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';
import { Usuario } from '../../auth/interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  private baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) { }


  crearUsuario(name: string, lastName: string, phoneNumber:number, signedUp:string, dateStart:Date, dateEnd:Date){
    const url = `${this.baseUrl}/users/nuevo-usuario `;
    const body = {name, lastName, phoneNumber, signedUp, dateStart, dateEnd};

    return this.http.post<Usuario>(url, body).pipe(
      map(resp => resp.ok),
      catchError(err => of(err.error.msg))
    )
  }

  getUsuarios(){
    const url = `${this.baseUrl}/users/usuarios `;
    return this.http.get<{usuarios:any}>(url);
  }
  getUsuario(id: string){
    const url = `${this.baseUrl}/users/usuarios/nuevo-usuario/${id} `;
    return this.http.get<{usuario:Usuario}>(url)
  }

  deleteUsuario(usuario:Usuario){
  
    const url = `${this.baseUrl}/users/usuarios/${usuario._id} `;
    console.log(usuario._id);
    return this.http.delete(url);
  }
}

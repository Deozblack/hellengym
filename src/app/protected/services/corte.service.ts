import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';
import { Corte } from '../../auth/interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class CorteService {

  private baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  crearCorte(fecha: Date, corte: number, estatus:boolean){
    const url = `${this.baseUrl}/cortes/ `;
    const body = {fecha, corte, estatus};

    return this.http.post<Corte>(url, body).pipe(
      map(resp => resp.ok),
      catchError(err => of(err.error.msg))
    )
  }

  getCortes(){
    const url = `${this.baseUrl}/cortes/cortes`;
    return this.http.get<{cortes:any}>(url);
  }

  deleteCorte(corte: Corte){
    const url = `${this.baseUrl}/cortes/cortes/${corte._id} `;
    return this.http.delete(url);
  }


}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Caja } from 'src/app/auth/interfaces/interfaces';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class CajaService {
  
  private baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) { }


  actualizarCaja(caja:Caja){
    const url = `${this.baseUrl}/caja/retiro/${caja._id} `;
    return this.http.put(url,caja);
  }
  actualizarCajaAgregar(caja:Caja){
    const url = `${this.baseUrl}/caja/ingresar/${caja._id} `;
    return this.http.put(url,caja);
  }

  getCaja(){
    const url = `${this.baseUrl}/caja/caja`;
    return this.http.get<{caja:any}>(url);
  }


}

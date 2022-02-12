import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Deuda } from 'src/app/auth/interfaces/interfaces';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class DeudaService {

  private baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  crearDeuda(producto: string, cantidad: number, precio: number, perdida: number, concepto: string, fecha: Date, deudor:string ){
    const url = `${this.baseUrl}/deudas/nuevo `;
    const body = {producto, cantidad, precio, perdida, concepto, fecha, deudor};

    return this.http.post<Deuda>(url, body).pipe(
      map(resp => resp.ok),
      catchError(err => of(err.error.msg))
    )
  }
  getDeudas(){
    const url = `${this.baseUrl}/deudas/deudas `;
    return this.http.get<{deudas:any}>(url);
  }
  getDeuda(id: string){
    const url = `${this.baseUrl}/deudas/deudas/nuevo/${id} `;
    return this.http.get<{deuda:Deuda}>(url)
  }
  actualizarDeuda(deuda:Deuda){
    const url = `${this.baseUrl}/deudas/deudas/nuevo/${deuda._id} `;
    return this.http.put(url,deuda);
  }
  revertirDeuda(deuda:Deuda){
    const url = `${this.baseUrl}/deudas/deudas/${deuda._id} `;
    return this.http.put(url,deuda);
  }
  deleteDeuda(deuda: Deuda){
    const url = `${this.baseUrl}/deudas/deudas/${deuda._id} `;
    return this.http.delete(url);
  }
}

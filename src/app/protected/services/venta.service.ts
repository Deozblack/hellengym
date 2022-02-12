import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';
import { Producto, Venta } from '../../auth/interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class VentaService {

  private baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  crearVenta(nombre: string, cantidad: number, precio: number, ganancia: number, concepto: string, fecha: Date, id_INS:number,id_DE:string ){
    const url = `${this.baseUrl}/sales/nuevo `;
    const body = {nombre, cantidad, precio, ganancia, concepto, fecha, id_INS, id_DE};

    return this.http.post<Venta>(url, body).pipe(
      map(resp => resp.ok),
      catchError(err => of(err.error.msg))
    )
  }

  actualizarProducto(producto:Producto){
    const url = `${this.baseUrl}/sales/ventas/nuevo/${producto._id} `;
    return this.http.put(url,producto);
  }
  revertirProducto(producto:Producto){
    const url = `${this.baseUrl}/sales/ventas/${producto._id} `;
    return this.http.put(url,producto);
  }

  getVentas(){
    const url = `${this.baseUrl}/sales/ventas `;
    return this.http.get<{ventas:any}>(url);
  }
  getGanancias(){
    const url = `${this.baseUrl}/sales/ventas `;
    return this.http.get<{ventas:any}>(url);
  }

  getVenta(id: Date){
    const url = `${this.baseUrl}/sales/ventas/nuevo/${id} `;
    return this.http.get<{venta:Venta}>(url)
  }
  getVentaID(id: string){
    const url = `${this.baseUrl}/sales/ventas/nuevo/${id} `;
    return this.http.get<{venta:Venta}>(url)
  }

  deleteVenta(venta: Venta){
    const url = `${this.baseUrl}/sales/ventas/${venta._id} `;
    console.log(venta._id);
    return this.http.delete(url);
  }

  
}

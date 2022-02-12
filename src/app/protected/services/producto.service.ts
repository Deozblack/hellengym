import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Producto } from 'src/app/auth/interfaces/interfaces';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  crearProducto(nombre: string,presentacion: string, tipo: string, cantidad: number, precio:number, fecha:Date){
    const url = `${this.baseUrl}/products/nuevo `;
    const body = {nombre, presentacion, tipo, cantidad, precio, fecha};

    return this.http.post<Producto>(url, body).pipe(
      map(resp => resp.ok),
      catchError(err => of(err.error.msg))
    )
  }

  actualizarProducto(producto:Producto){
    const url = `${this.baseUrl}/products/productos/nuevo/${producto._id} `;
    return this.http.put(url,producto);
  }

  getProductos(){
    const url = `${this.baseUrl}/products/productos `;
    return this.http.get<{productos:any}>(url);
  }

  getProducto(id: string){
    const url = `${this.baseUrl}/products/productos/nuevo/${id} `;
    return this.http.get<{producto:Producto}>(url)
  }

  deleteProducto(producto: Producto){
    const url = `${this.baseUrl}/products/productos/${producto._id} `;
    console.log(producto._id);
    return this.http.delete(url);
  }

}

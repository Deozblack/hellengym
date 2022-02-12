import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Producto } from '../../../auth/interfaces/interfaces';
import { ProductoService } from '../../services/producto.service';

@Component({
  selector: 'app-lista-producto',
  templateUrl: './lista-producto.component.html',
  styleUrls: ['./lista-producto.component.css']
})
export class ListaProductoComponent implements OnInit {

  productos:any[] = [];

  constructor(private productService: ProductoService) { }

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(){
    this.productService.getProductos().subscribe( ({productos}) =>{
      this.productos = productos;
    });
  }

  deleteProducto(producto: Producto){
    Swal.fire({
      title: '¿Borrar producto?',
      text: `${producto.nombre} será eliminado permanentemente`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.productService.deleteProducto(producto).subscribe( resp => {
          this.cargarProductos();
          Swal.fire(
            {
              title: 'Trabajador eliminado',
              icon: 'success',
              text: `${producto.nombre} fue eliminado correctamente`

            }
          );
        })
      }
    })
  }

}

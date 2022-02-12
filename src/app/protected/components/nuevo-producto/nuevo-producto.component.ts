import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Producto } from 'src/app/auth/interfaces/interfaces';
import Swal from 'sweetalert2';
import { ProductoService } from '../../services/producto.service';

@Component({
  selector: 'app-nuevo-producto',
  templateUrl: './nuevo-producto.component.html',
  styleUrls: ['./nuevo-producto.component.css']
})
export class NuevoProductoComponent implements OnInit {

  FechaHoy = new Date();
  productoSeleccionado:Producto | undefined;
  tipos:any[] = ['Básico','Suplemento, Otro..'];

  miFormulario: FormGroup = this.fb.group({
    nombre: ['',[Validators.required, Validators.min(4)]],
    presentacion: ['',[Validators.required]],
    tipo: ['',[Validators.required, ]],
    cantidad: ['',[Validators.required ]],
    precio: ['',[Validators.required]],
    fecha: [this.FechaHoy,[Validators.required]]
  });  

  constructor(private fb: FormBuilder, private router: Router, private productoService: ProductoService,
    private routerAtivate:ActivatedRoute) { }

  ngOnInit(): void {

    this.routerAtivate.params.subscribe( ({id}) =>{
      this.cargarTrabajador(id);
    });


    this.miFormulario = this.fb.group({
      nombre: ['',[Validators.required, Validators.min(4)]],
      presentacion: ['',[Validators.required]],
      tipo: ['',[Validators.required, ]],
      cantidad: ['',[Validators.required ]],
      precio: ['',[Validators.required]],
      fecha: [this.FechaHoy,[Validators.required]]
    });  
  }

  cargarTrabajador(id:string){
      
    if (id === 'id') {
      return;
    }

      this.productoService.getProducto(id).subscribe( ({producto}) =>{
        console.log(producto);
        if (!producto) {
          this.router.navigateByUrl('dashboard/inventario');
        }
        let {nombre,presentacion, tipo, cantidad, precio, fecha} = producto;
        fecha = new Date();
        this.productoSeleccionado = producto;
        this.miFormulario.setValue({nombre, presentacion, tipo, cantidad, precio, fecha})
      })
  }

  crearProducto(){
    if (this.productoSeleccionado) {
      console.log(this.productoSeleccionado); 
      // actualizar trabajador
      const data = {
          ...this.miFormulario.value,
          _id: this.productoSeleccionado._id
      }
        this.productoService.actualizarProducto(data).subscribe( resp =>{
          console.log(resp);
          Swal.fire(
            {
              title: 'Producto actualizado',
              text: `${data.nombre} se ha actualizado correctamente`,
              icon: 'success',
              confirmButtonColor: '#8dc641',
              confirmButtonText: 'Aceptar'
            }
          ).then((result) =>{
            if (result.value) {
              this.router.navigateByUrl('dashboard/inventario');
            }
          })
        })
    } else {
      // Crear trabajador
    const {nombre, presentacion, tipo, cantidad, precio, fecha} = this.miFormulario.value;
    this.productoService.crearProducto(nombre,presentacion, tipo, cantidad, precio, fecha)
    .subscribe(ok =>{
      console.log(ok);
      if (ok === true) {
        Swal.fire(
          {
            title: 'Producto creado',
            text: ok.name,
            icon: 'success',
            confirmButtonColor: '#8dc641',
            confirmButtonText: 'Aceptar'
          }
        ).then((result) =>{
          if (result.value) {
            this.router.navigateByUrl('dashboard/inventario');
          }
        })
      }else{
        Swal.fire(
          {
            title: 'Error',
            text: ok,
            icon: 'error',
            confirmButtonColor: '#8dc641',
            confirmButtonText: 'Aceptar'
          }
        )
      }
    })
    }
  }

}

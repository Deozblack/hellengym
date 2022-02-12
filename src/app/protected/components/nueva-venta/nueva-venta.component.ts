import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { VentaService } from '../../services/venta.service';
import { Producto } from 'src/app/auth/interfaces/interfaces';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-nueva-venta',
  templateUrl: './nueva-venta.component.html',
  styleUrls: ['./nueva-venta.component.css']
})
export class NuevaVentaComponent implements OnInit {
  producto: Producto [] = [];
  productos:any[] = [];
  productoSeleccionado: Producto | any;

  minCan:number = 1;
  maxCan:number = 0;

  fechaHoy = new Date();



  miFormulario: FormGroup = this.fb.group({
    nombre: ['',[Validators.required, Validators.min(4)]],
    cantidad: ['',[Validators.required ]],
    precio: ['',[Validators.required]],
    concepto: ['',[]],
    ganancia: [,[Validators.required]],
    fecha: [this.fechaFiltrada(this.fechaHoy),[]],
    id_INS:['',[]]
  }); 

  constructor(private fb: FormBuilder, private router: Router, private ventaService: VentaService,
    private routerAtivate:ActivatedRoute, private productoService: ProductoService) { }

  ngOnInit(): void {

    this.cargarProductos();
    console.log(this.fechaHoy.toDateString());

    this.miFormulario = this.fb.group({
      nombre: ['',[Validators.required, Validators.min(4)]],
      cantidad: ['',[Validators.required]],
      precio: ['',[Validators.required]],
      concepto: ['',[]],
      ganancia: [,[Validators.required]],
      fecha: [this.fechaFiltrada(this.fechaHoy),[]],
      id_INS:['',[]],
      id_DE:['',[]]
    }); 
    
    // this.miFormulario.controls['precio'].disable();
    // this.miFormulario.controls['ganancia'].disable();


    this.miFormulario.get('nombre')?.valueChanges.subscribe(
      nombreID => {
        this.productoSeleccionado = this.productos.find( p => p.nombre === nombreID);
        this.maxCan = this.productoSeleccionado.cantidad;
        this.productoSeleccionado.cantidad = 1;
     }
    )
  }

  cargarProductos(){
    this.productoService.getProductos().subscribe( ({productos}) =>{
      this.productos = productos;
      this.productos = this.productos.filter(n => n.cantidad > 0);
    });
  }

  fechaFiltrada(fechaActual: Date){
    const mes = ['01','02', '03','04', '05', '06', '07','08','09',
                  '10','11','12'];
    let hoy = fechaActual.getDate();
    let mesActual = fechaActual.getMonth();
    let anioActual = fechaActual.getFullYear();

    let fecha = `${anioActual}/${mes[mesActual]}/${hoy}`;
    let fechaFinal = new Date(fecha);
    return fechaFinal.toISOString();
    
  }

  crearVenta(){
      // Crear trabajador
      let {nombre, cantidad, precio, ganancia, concepto, fecha, id_INS,id_DE} = this.miFormulario.value;
      precio = this.productoSeleccionado.precio;
      ganancia = cantidad * precio;
      let gananciaN = ganancia;
      this.ventaService.crearVenta(nombre, cantidad, precio, gananciaN, concepto, fecha,id_INS,id_DE )
      .subscribe(ok =>{
        console.log(ok);
        if (ok === true) {
          this.ventaService.actualizarProducto(this.productoSeleccionado).subscribe();
          Swal.fire(
            {
              title: 'Venta realizada',
              text: ok.name,
              icon: 'success',
              confirmButtonColor: '#8dc641',
              confirmButtonText: 'Aceptar'
            }
          ).then((result) =>{
            if (result.value) {
              this.router.navigateByUrl('dashboard/ventas');
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

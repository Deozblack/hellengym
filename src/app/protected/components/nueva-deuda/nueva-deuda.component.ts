import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Producto } from 'src/app/auth/interfaces/interfaces';
import Swal from 'sweetalert2';
import { DeudaService } from '../../services/deuda.service';
import { ProductoService } from '../../services/producto.service';
import { UserServiceService } from '../../services/user-service.service';
import { VentaService } from '../../services/venta.service';

@Component({
  selector: 'app-nueva-deuda',
  templateUrl: './nueva-deuda.component.html',
  styleUrls: ['./nueva-deuda.component.css']
})
export class NuevaDeudaComponent implements OnInit {

fechaHoy = new Date();
productos:any[] = [];
users:any[] = [];
productoSeleccionado: Producto | any;
tipoSeleccionado: Producto | any;
minCan:number = 1;
maxCan:number = 0;
tipos:any[] = ['Producto','Otro...']


  miFormulario: FormGroup = this.fb.group({
    producto: ['',[Validators.required, Validators.min(4)]],
    cantidad: ['',[Validators.required ]],
    precio: ['',[Validators.required]],
    concepto: ['',[]],
    predida: [,[Validators.required]],
    fecha: [this.fechaFiltrada(this.fechaHoy),[]],
    deudor:['',[Validators.required ]]
  }); 

  constructor(private fb: FormBuilder,
    private productoService:ProductoService,
    private userService:UserServiceService,
    private deudaService:DeudaService,
    private ventaService:VentaService,
    private router: Router) { }

  ngOnInit(): void {
    this.cargarProductos();
    this.cargarUsuarios();

    this.miFormulario.get('producto')?.valueChanges.subscribe(
      nombreID => {
        console.log(nombreID);
          this.productoSeleccionado = this.productos.find( p => p.nombre === nombreID);
          console.log(this.productoSeleccionado);
          this.maxCan = this.productoSeleccionado.cantidad;
          this.productoSeleccionado.cantidad = 1;
     }
    )
  }

  tipoDeuda(event:Event){
      console.log(event);
  }

  cargarProductos(){
    this.productoService.getProductos().subscribe( ({productos}) =>{
      this.productos = productos;
      this.productos = this.productos.filter(n => n.cantidad > 0);
    });
  }
  cargarUsuarios(){
    this.userService.getUsuarios().subscribe(
      ({usuarios})=>{
        this.users = usuarios
      }
    )
  }

  crearDeuda(){
    // Crear trabajador
    let { producto, cantidad, precio, perdida, concepto, fecha, deudor} = this.miFormulario.value;
    precio = this.productoSeleccionado.precio;
    perdida = cantidad * precio;
    let perdidaN = perdida;
    this.deudaService.crearDeuda(producto, cantidad, precio, perdidaN, concepto, fecha,deudor )
    .subscribe(ok =>{
      console.log(ok);
      if (ok === true) {
        this.ventaService.actualizarProducto(this.productoSeleccionado).subscribe();
        Swal.fire(
          {
            title: 'Deuda creada',
            text: ok.deudor,
            icon: 'success',
            confirmButtonColor: '#8dc641',
            confirmButtonText: 'Aceptar'
          }
        ).then((result) =>{
          if (result.value) {
            this.router.navigateByUrl('dashboard/deudas');
          }
        })
      }else{
        Swal.fire(
          {
            title: 'Error',
            text: ok.msg,
            icon: 'error',
            confirmButtonColor: '#8dc641',
            confirmButtonText: 'Aceptar'
          }
        )
      }
    })
}
  fechaFiltrada(fechaActual: Date){
    const mes = ['01','02', '03','04', '05', '06', '07','08','09',
                  '10','11','12'];
    let hoy = fechaActual.getDate();
    let mesActual = fechaActual.getMonth();
    let anioActual = fechaActual.getFullYear();

    return `${anioActual}/${mes[mesActual]}/${hoy}`;
    
    
  }


}

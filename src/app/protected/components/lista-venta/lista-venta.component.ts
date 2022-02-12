import { Component, OnInit } from '@angular/core';
import { Producto, Venta, Usuario, Corte, Deuda, Caja } from '../../../auth/interfaces/interfaces';
import { VentaService } from '../../services/venta.service';
import { ProductoService } from '../../services/producto.service';
import Swal from 'sweetalert2';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { CorteService } from '../../services/corte.service';
import { UserServiceService } from '../../services/user-service.service';
import { DeudaService } from '../../services/deuda.service';
import { CajaService } from '../../services/caja.service';
import { min } from 'rxjs/operators';

@Component({
  selector: 'app-lista-venta',
  templateUrl: './lista-venta.component.html',
  styleUrls: ['./lista-venta.component.css']
})
export class ListaVentaComponent implements OnInit {

  ventas:any[] = [];
  cajas:any[] = [];
  caja:Caja | any;
  cantidadCaja:number = 0;
  cortes:any[] = [];
  deudas:any[] = [];
  deuda:Deuda | any;
  corte:Corte | any;
  estadoCorte:any;
  usuarios:any[] = [];
  usuario: Usuario | any;
  productos:any[] = [];
  productosInventario:any[] = [];
  productosUpdate:Producto | any;
  fechaHoy = new Date();


  ganancias:any[] = [];
  suma:number = 0;

  miFormulario: FormGroup = this.fb.group({
    fecha: [this.fechaFiltrada(this.fechaHoy),[Validators.required]],
    corte: ['',[Validators.required ]],
    estatus: [true,[Validators.required]]
  }); 


  constructor(private fb: FormBuilder, 
    private ventasService: VentaService, 
    private productosService: ProductoService,
    private corteService: CorteService,
    private router: Router,
    private userService: UserServiceService,
    private corteS: CorteService,
    private deudaService:DeudaService,
    private cajaService:CajaService) { }

  ngOnInit(): void {
    this.cargarVentas(this.fechaHoy);
    this.cargarProductos();
    this.sumarVentas(this.fechaHoy);
    this.cargarCorte(this.fechaHoy);
    this.cargarCaja();
    console.log(this.fechaFiltrada(this.fechaHoy));
  }

  sumarVentas(fechaHoy:Date){
    this.ventasService.getGanancias().subscribe(
      ({ventas}) =>{
       
        this.ganancias = ventas;
        this.ganancias = this.ganancias.filter( n => n.fecha == this.fechaFiltrada(fechaHoy))
       
          this.ganancias.forEach(element => { 
          
            this.suma += element.ganancia
              
            });
      }
    )
    
  }
  cargarCaja(){
    this.cajaService.getCaja().subscribe(
      ({caja})=>{
        this.cajas = caja
        this.caja = this.cajas[0]
        this.cantidadCaja = this.caja.cantidad
      }
    )
  }

  cargarVentas(fechaHoy:Date){
    // let fechaObtenida = new Date(this.fechaFiltrada(fechaHoy));
    this.ventasService.getVentas().subscribe( ({ventas}) =>{
      this.ventas = ventas;
      this.ventas = this.ventas.filter(n => n.fecha === this.fechaFiltrada(fechaHoy))
      console.log(this.ventas);
    });
  }
  cargarProductos(){
    this.productosService.getProductos().subscribe( ({productos}) =>{
      this.productosInventario = productos;
      this.productosInventario = this.productosInventario.filter( n =>  n.cantidad > 0 && n.tipo === 'Básico' )
    });
  }
  cargarCorte(fechaHoy:Date){
    let fechaObtenida = new Date(this.fechaFiltrada(fechaHoy));
    this.corteS.getCortes().subscribe( ({cortes}) =>{
      this.cortes = cortes;
      this.cortes = this.cortes.filter( n => n.fecha == fechaObtenida.toISOString()); 
      this.corte = this.cortes[0];
      if (!this.corte) {
        this.estadoCorte = false
      }else{
        this.estadoCorte = this.corte.estatus
      }

    });
  }
  deleteIF(venta:Venta){
      if (venta.nombre === 'Inscripción') {
        this.deleteIns(venta);
      }else if(venta.nombre === 'Abono'){
        this.deleteDeuda(venta);
      }else if(venta.nombre === 'Gasto'){
        this.deleteGasto(venta);
      }else{
        this.deleteVenta(venta);
      }
  }

  deleteCorte(corte:Corte){
    Swal.fire({
      title: '¿Deshacer corte?',
      text: `El corte de ${corte.fecha} será eliminado...`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.corteService.deleteCorte(corte).subscribe( resp => {
          this.cargarVentas(this.fechaHoy);
          this.cargarProductos();

          let cajaActualizar:Caja|any;
          this.cajaService.getCaja().subscribe(({caja})=>{
            cajaActualizar = caja
            cajaActualizar[0].cantidad = corte.corte
            console.log(cajaActualizar);
           this.cajaService.actualizarCaja(cajaActualizar[0]).subscribe();
          
          })
    
          Swal.fire(
            {
              title: 'Corte eliminado',
              icon: 'success',
              text:`El corte fue eliminado`,
              confirmButtonColor: '#8dc641',
              confirmButtonText: 'Aceptar'
            }
          ).then((result) =>{
            if (result.value) {
              this.router.navigateByUrl('dashboard/ventas');
              window.location.reload();
            }
          })
        })
      }
    })
  }

  deleteGasto(venta:Venta){
    Swal.fire({
      title: '¿Borrar venta?',
      text: `El ${venta.nombre} será eliminado permanentemente`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.ventasService.deleteVenta(venta).subscribe( resp => {
          this.cargarVentas(this.fechaHoy);
          this.cargarProductos();
          this.suma = this.suma - venta.ganancia;
    
          Swal.fire(
            {
              title: 'Venta eliminada',
              icon: 'success',
              text: `${venta.nombre} fue eliminado correctamente`,
              showConfirmButton: false,
              timer: 1500
            }
          )
        })
      }
    })
  }

  deleteDeuda(venta:Venta){
    this.deudaService.getDeudas().subscribe(
      ({deudas})=>{
        this.deudas = deudas
        this.deudas = this.deudas.filter(n => n._id === venta.id_DE);
        this.deuda = this.deudas[0];
        console.log("Aqui ando");
        console.log(this.deudas);

        Swal.fire({
          title: '¿Borrar venta?',
          text: `El ${venta.nombre} será eliminado permanentemente`,
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, Eliminar!',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.value) {
            this.deuda.perdida = venta.ganancia
            this.deudaService.revertirDeuda(this.deuda).subscribe();
            this.ventasService.deleteVenta(venta).subscribe( resp => {
              this.cargarVentas(this.fechaHoy);
              this.cargarProductos();
              this.suma = this.suma - venta.ganancia;
        
              Swal.fire(
                {
                  title: 'Venta eliminada',
                  icon: 'success',
                  text: `${venta.nombre} fue eliminado correctamente`,
                  showConfirmButton: false,
                  timer: 1500
                }
              )
            })
          }
        })
      }
    );
  }


  deleteIns(venta:Venta){
    this.userService.getUsuarios().subscribe(
      ({usuarios})=>{
        this.usuarios = usuarios
        this.usuarios = this.usuarios.filter(n => n.phoneNumber === venta.id_INS);
        this.usuario = this.usuarios[0];
        console.log("Aqui ando");
        console.log(this.usuario);

        Swal.fire({
          title: '¿Borrar venta?',
          text: `${venta.nombre} será eliminado permanentemente`,
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, Eliminar!',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.value) {
            this.userService.deleteUsuario(this.usuario).subscribe();
            this.ventasService.deleteVenta(venta).subscribe( resp => {
              this.cargarVentas(this.fechaHoy);
              this.cargarProductos();
              this.suma = this.suma - venta.ganancia;
        
              Swal.fire(
                {
                  title: 'Venta eliminada',
                  icon: 'success',
                  text: `${venta.nombre} fue eliminado correctamente`,
                  showConfirmButton: false,
                  timer: 1500
                }
              )
            })
          }
        })
      }
    );
  }

  deleteVenta(venta: Venta){
    this.productosService.getProductos().subscribe( ({productos}) => {
      this.productos = productos;
        this.productos = this.productos.filter( n => n.nombre === venta.nombre);
        this.productos[0].cantidad = venta.cantidad;
      this.productosUpdate = this.productos[0];
      Swal.fire({
        title: '¿Borrar venta?',
        text: `${venta.nombre} será eliminado permanentemente`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Eliminar!',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.value) {
          this.ventasService.revertirProducto(this.productosUpdate).subscribe();
          this.ventasService.deleteVenta(venta).subscribe( resp => {
            this.cargarVentas(this.fechaHoy);
            this.cargarProductos();
            this.suma = this.suma - venta.ganancia;
      
            Swal.fire(
              {
                title: 'Venta eliminada',
                icon: 'success',
                text: `${venta.nombre} fue eliminado correctamente`,
                showConfirmButton: false,
                timer: 1500
              }
            )
          })
        }
      })


    })
    
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

  crearCorte(){
    const {fecha, estatus} = this.miFormulario.value;
    console.log(fecha);
    this.corteService.crearCorte(fecha, this.suma, estatus)
    .subscribe(ok =>{
      console.log(ok);
      let cajaActualizar:Caja|any;
      let fecha = new Date(this.fechaFiltrada(this.fechaHoy))
      this.cajaService.getCaja().subscribe(({caja})=>{
        cajaActualizar = caja
        cajaActualizar[0].cantidad = this.suma
        console.log(cajaActualizar);
       this.cajaService.actualizarCajaAgregar(cajaActualizar[0]).subscribe();
      })
      if (ok === true) {
        Swal.fire(
          {
            title: 'Corte creado',
            text: ok.fecha,
            icon: 'success',
            confirmButtonColor: '#8dc641',
            confirmButtonText: 'Aceptar'
          }
        ).then((result) =>{
          if (result.value) {
            this.router.navigateByUrl('dashboard/inventario');
            window.location.reload();
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


  tipoVenta(){
    Swal.fire({
      title: '¿Que desea realizar?',
      text:'Selecciona una de las alternativas',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonColor: '#3cbca3',
      denyButtonColor: '#1670a5',
      cancelButtonColor: '#ff0000',
      confirmButtonText: 'Venta',
      denyButtonText: `Gasto`,
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigateByUrl('dashboard/ventas/nuevo'); 
      } else if (result.isDenied) {
        this.router.navigateByUrl('dashboard/ventas/gasto'); 
      }
    })
  }

  retirarEfectivo(){
    Swal.fire({
      title: 'Ingrese la cantidad a retirar',
      input: 'number',
      inputAttributes: {
        autocapitalize: 'off',
        min: '1'
      },
      showCancelButton: true,
      confirmButtonText: 'Retirar',
      showLoaderOnConfirm: true,
      preConfirm: (cantidadRetiro) => {
        let cajaActualizar:Caja|any;
        let fecha = new Date(this.fechaFiltrada(this.fechaHoy))
        this.cajaService.getCaja().subscribe(({caja})=>{
          cajaActualizar = caja
          if(cantidadRetiro > cajaActualizar[0].cantidad){
            Swal.fire(
              {
                title: 'Error',
                text: 'No puedes retirar esa cantidad, sobre pasa los fondos',
                icon: 'error',
                confirmButtonColor: '#8dc641',
                confirmButtonText: 'Aceptar'
              }
            )
            this.cargarCaja();
              return;
          }
          cajaActualizar[0].cantidad = cantidadRetiro
          console.log(cajaActualizar);
         this.cajaService.actualizarCaja(cajaActualizar[0]).subscribe();
         this.ventasService.crearVenta(
           'Retiro de caja',
           1,
           0,
           0,
           `Se realizo un retiro en caja por el valor de ${cantidadRetiro}.00 MXN.`,
           fecha,
           0,
           '').subscribe( resp =>{
              this.cargarCaja();
              this.cargarVentas(this.fechaHoy);
           });
        })
      
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((cantidadRetiro) => {
      if (cantidadRetiro.isConfirmed) {
        Swal.fire({
          title: `Caja actualizada!`,
          text: `Se hizo un retiro de ${cantidadRetiro.value}.00 MXN.`
        })
      }
    })
  }

  

}

import { Component, OnInit, LOCALE_ID } from '@angular/core';
import { Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Corte, Deuda } from '../../../auth/interfaces/interfaces';
import { DeudaService } from '../../services/deuda.service';
import { VentaService } from '../../services/venta.service';
import { filter } from 'rxjs/operators';
import { NgStyle } from '@angular/common';
import { Resolve, Router } from '@angular/router';
import { CorteService } from '../../services/corte.service';

@Component({
  selector: 'app-lista-deuda',
  templateUrl: './lista-deuda.component.html',
  styleUrls: ['./lista-deuda.component.css']
})
export class ListaDeudaComponent implements OnInit {
  deudas:any[] = [];
  totalDeudas:any[] = [];
  totalD:Deuda | any;
  deudasC:any[] = [];
  deuda:Deuda | any;
  deudaS:Deuda | any[]=[];
  deudaSelect: any;
  fechaHoy = new Date();
  cortes:any [] = [];
  corte:Corte | any;
  suma:number = 0;
  constructor(private deudaService:DeudaService,
    private ventaService:VentaService,
    private router:Router,
    private corteS:CorteService) { }

  ngOnInit(): void {
    this.obtenerDeudas();
    this.sumarPerdidas();
    this.cargarCorte(this.fechaHoy);
  }

  sumarPerdidas(){
    this.deudaService.getDeudas().subscribe(
      ({deudas}) =>{
        this.totalDeudas = deudas;
        this.totalDeudas = this.totalDeudas
       
          this.totalDeudas.forEach(element => {
          
            this.suma += element.perdida
              
            });
      }
    )
    
  }
  obtenerDeudas(){
    this.deudaService.getDeudas().subscribe(
      ({deudas})=>{
        this.deudas = deudas
        this.deudas = this.deudas.filter( n => n.perdida > 0)
      }
    )
  }
  deleteDeuda(deuda:Deuda){
    Swal.fire({
      title: 'Estas seguro que quieres liquidar esta deuda?',
      text: "La deuda sera liquidada y mostrada en las ventas",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deudaS = deuda;
        this.deudaSelect = this.deudaS;
        let fechaF = new Date(this.fechaFiltrada(this.fechaHoy))

        this.ventaService.crearVenta(
          'Abono', 
          this.deudaSelect.cantidad,
          this.deudaSelect.precio,
          this.deudaSelect.perdida,
          `Deuda liquidada de: ${this.deudaSelect.deudor}.
          Por: ${this.deudaSelect.producto}.`,
          fechaF,
          0,
          this.deudaSelect._id
        ).subscribe();
        this.deudaService.deleteDeuda(this.deudaSelect).subscribe( resp => {
          this.obtenerDeudas();
          Swal.fire(
            'Liquidado!',
            `La deuda por ${this.deudaSelect.producto} - ${this.deudaSelect.precio} MXN fue liquidada`,
            'success'
          )
        });
      }
    })
  }
  abonarDeuda(deuda:string){
  
    Swal.fire({
      title: '¿Cuanto quieres abonar?',
      input: 'number',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Abonar',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      preConfirm: (ganancia) => {
        // this.ventaService.crearVenta(nombre, cantidad: number, precio: number, ganancia: number, concepto: string, fecha: Date, id_INS:number)
        this.deudaService.getDeuda(deuda).subscribe(
          ({deuda})=>{
            let id_INS = 0;
            let fechaF = new Date(this.fechaFiltrada(this.fechaHoy))

              this.deudaS = deuda;
              this.deudaSelect = this.deudaS;

              if (ganancia > this.deudaSelect.perdida) {
                Swal.fire({
                  title: `Abono cancelado`,
                  text: `El aboono es mayor a la deuda indicada`,
                  icon: 'error',
                  showConfirmButton: true
                })
                return
              }

              this.ventaService.crearVenta(
                'Abono', 
                1,
                ganancia,
                ganancia,
                `Abono de: ${this.deudaSelect.deudor}.
                Por: ${this.deudaSelect.producto}.`,
                fechaF,
                id_INS,
                this.deudaSelect._id
              ).subscribe();
              this.deudaSelect.perdida = ganancia;
              this.deudaService.actualizarDeuda(this.deudaSelect).subscribe(
                resp =>{
                  this.obtenerDeudas();
                }
              );

              
          }
        )
      }
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: `Abono realizado`,
          text: `por: ${result.value} MXN.`,
          icon: 'success',
          showConfirmButton: false,
          timer: 1500
        })
      }else{
        Swal.fire({
          title: `Abono cancelado`,
          text: `El aboono se cancelo o hubo un error`,
          icon: 'error',
          showConfirmButton: false,
          timer: 1500
        })
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
  cargarCorte(fechaHoy:Date){
    let fechaObtenida = new Date(this.fechaFiltrada(fechaHoy));
    this.corteS.getCortes().subscribe( ({cortes}) =>{
      this.cortes = cortes;
      this.cortes = this.cortes.filter( n => n.fecha == fechaObtenida.toISOString()); 
      this.corte = this.cortes[0];

    });
  }
  
  tipoDeuda(){

    let fechaDelDia = new Date(this.fechaFiltrada(this.fechaHoy));
    console.log(this.corte);
    if (!this.corte) {
      Swal.fire({
        title: 'Tipo de deuda',
        text:'Escoge el tipo de deuda a realizar',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonColor: '#3cbca3',
        denyButtonColor: '#1670a5',
        cancelButtonColor: '#ff0000',
        confirmButtonText: 'Normal',
        denyButtonText: `Personalizada`,
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigateByUrl('dashboard/deudas/nuevo'); 
        } else if (result.isDenied) {
          this.router.navigateByUrl('dashboard/deudas/personalizada'); 
        }
      })
    }else if(this.corte.fecha == fechaDelDia.toISOString()){
      Swal.fire(
        {
          title: 'El corte ha sido generado.',
          text: 'ya no puedes generar mas deudas hasta mañana.',
          icon: 'error',
          confirmButtonColor: '#8dc641',
          confirmButtonText: 'Aceptar'
        }
      )
      return;
    }

  }
 

}

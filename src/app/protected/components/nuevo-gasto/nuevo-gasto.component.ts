import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { VentaService } from '../../services/venta.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nuevo-gasto',
  templateUrl: './nuevo-gasto.component.html',
  styleUrls: ['./nuevo-gasto.component.css']
})
export class NuevoGastoComponent implements OnInit {

  fechaHoy = new Date();

  miFormulario: FormGroup = this.fb.group({
    nombre: ['Gasto',[Validators.required, Validators.min(4)]],
    cantidad: ['',[Validators.required ]],
    precio: ['',[Validators.required]],
    concepto: ['',[]],
    ganancia: [,[Validators.required]],
    fecha: [this.fechaFiltrada(this.fechaHoy),[]],
    id_INS:['',[]]
  }); 

  constructor( private fb: FormBuilder,
    private ventaService:VentaService,
    private router:Router) { }

  ngOnInit(): void {
  }

  crearGasto(){
    // Crear trabajador
    let {nombre, cantidad, precio, ganancia, concepto, fecha, id_INS,id_DE} = this.miFormulario.value;
    cantidad = 1
    ganancia = (-ganancia)
    precio = ganancia
    let gananciaN = ganancia;
    this.ventaService.crearVenta(nombre, cantidad, precio, ganancia, concepto, fecha,id_INS,id_DE )
    .subscribe(ok =>{
      console.log(ok);
      if (ok === true) {
        Swal.fire(
          {
            title: 'Gasto realizado',
            text: `Gasto generado por ${ok.ganancia}`,
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

}

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { DeudaService } from '../../services/deuda.service';
import { UserServiceService } from '../../services/user-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nueva-deuda-pz',
  templateUrl: './nueva-deuda-pz.component.html',
  styleUrls: ['./nueva-deuda-pz.component.css']
})
export class NuevaDeudaPzComponent implements OnInit {
  
  fechaHoy = new Date();
  users:any[] = [];

  miFormulario: FormGroup = this.fb.group({
    producto: ['',[Validators.required, Validators.min(4)]],
    cantidad: ['',[Validators.required ]],
    precio: ['',[Validators.required]],
    concepto: ['',[]],
    perdida: [,[Validators.required]],
    fecha: [this.fechaFiltrada(this.fechaHoy),[]],
    deudor:['',[Validators.required ]]
  }); 

  constructor(private fb: FormBuilder,
    private userService:UserServiceService,
    private deudaService:DeudaService,
    private router:Router) { }

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  crearDeuda(){
    // Crear trabajador
    let { producto, cantidad, precio, perdida, concepto, fecha, deudor} = this.miFormulario.value;
    cantidad = 1
    precio = perdida
    this.deudaService.crearDeuda(producto, cantidad, precio, perdida, concepto, fecha,deudor )
    .subscribe(ok =>{
      console.log(ok);
      if (ok === true) {
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

  cargarUsuarios(){
    this.userService.getUsuarios().subscribe(
      ({usuarios})=>{
        this.users = usuarios
      }
    )
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

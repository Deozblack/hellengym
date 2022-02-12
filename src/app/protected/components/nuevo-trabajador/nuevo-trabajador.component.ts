import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import Swal from 'sweetalert2';
import { Trabajador } from '../../../auth/interfaces/interfaces';

@Component({
  selector: 'app-nuevo-trabajador',
  templateUrl: './nuevo-trabajador.component.html',
  styleUrls: ['./nuevo-trabajador.component.css']
})
export class NuevoTrabajadorComponent implements OnInit {
  valueIconLeft: any;
  trabajadorSeleccionado:Trabajador | undefined;

  miFormulario: FormGroup = this.fb.group({
    name: ['',[Validators.required, Validators.min(4)]],
    lastName: ['',[Validators.required, Validators.min(4)]],
    phoneNumber: ['',[Validators.required, Validators.min(4)]],
    user:['', [Validators.required]],
    password: ['',[Validators.required, Validators.min(6)]],
    role: ['trabajador',[]]
  });
  

  constructor(private fb: FormBuilder, private router: Router, private authServices: AuthService,
    private routerAtivate:ActivatedRoute) { }
  ngOnInit(): void {
    this.routerAtivate.params.subscribe( ({id}) =>{
      this.cargarTrabajador(id);
    });

    this.miFormulario = this.fb.group({
      name: ['',[Validators.required, Validators.min(4)]],
      lastName: ['',[Validators.required, Validators.min(4)]],
      phoneNumber: ['',[Validators.required, Validators.min(4)]],
      user:['', [Validators.required]],
      password: ['',[Validators.required, Validators.min(6)]],
      role: ['trabajador',[]]
    });
  }

  cargarTrabajador(id:string){
      
    if (id === 'nuevo') {
      return;
    }

      this.authServices.getTrabajador(id).subscribe( ({trabajador}) =>{
        console.log(trabajador);
        if (!trabajador) {
          this.router.navigateByUrl('dashboard/trabajadores');
        }
        const {name,lastName,phoneNumber,user,password,role} = trabajador;
        this.trabajadorSeleccionado = trabajador;
        this.miFormulario.setValue({name,lastName,phoneNumber,user,password,role})
      })
  }

  crearTrabajador(){
    if (this.trabajadorSeleccionado) {
      console.log(this.trabajadorSeleccionado); 
      // actualizar trabajador
      const data = {
          ...this.miFormulario.value,
          _id: this.trabajadorSeleccionado._id
      }
        this.authServices.actualizarTrabajador(data).subscribe( resp =>{
          console.log(resp);
          Swal.fire(
            {
              title: 'Trabajador actualizado',
              text: `${data.name} se ha actualizado correctamente`,
              icon: 'success',
              confirmButtonColor: '#8dc641',
              confirmButtonText: 'Aceptar'
            }
          ).then((result) =>{
            if (result.value) {
              this.router.navigateByUrl('dashboard/trabajadores');
            }
          })
        })
    } else {
      // Crear trabajador
      const {name, lastName, phoneNumber, user, password, role} = this.miFormulario.value;
      this.authServices.crearTrabajador(name, lastName, phoneNumber, user, password, role)
      .subscribe(ok =>{
        console.log(ok);
        if (ok === true) {
          Swal.fire(
            {
              title: 'Trabajador creado',
              text: ok.name,
              icon: 'success',
              confirmButtonColor: '#8dc641',
              confirmButtonText: 'Aceptar'
            }
          ).then((result) =>{
            if (result.value) {
              this.router.navigateByUrl('dashboard/trabajadores');
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
      
    }//terminar else
  }

}

import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';

import { getTrabajadores, Trabajador } from '../../../auth/interfaces/interfaces';
import { delay, filter } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-lista-trabajador',
  templateUrl: './lista-trabajador.component.html',
  styleUrls: ['./lista-trabajador.component.css']
})
export class ListaTrabajadorComponent implements OnInit {

  first = 0;
  rows = 10;
  display: boolean = false;


  trabajadores:any[] = [];

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
     this.cargarTrabajadores();
  }

  cargarTrabajadores(){
    this.auth.getTrabajadores().subscribe( ({trabajadores}) =>{

      this.trabajadores = trabajadores;
      this.trabajadores = this.trabajadores.filter(n => n.role !== 'admin')

    });
  }
  deleteTrabajador(trabajador: Trabajador){
    Swal.fire({
      title: '¿Borrar trabajador?',
      text: `${trabajador.name} será eliminado permanentemente`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.auth.deleteTrabajador(trabajador).subscribe( resp => {
          this.cargarTrabajadores();
          Swal.fire(
            {
              title: 'Trabajador eliminado',
              icon: 'success',
              text: `${trabajador.name} fue eliminado correctamente`

            }
          );
        })
      }
    })
  }

}

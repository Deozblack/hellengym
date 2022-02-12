import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Usuario } from '../../../auth/interfaces/interfaces';
import { UserServiceService } from '../../services/user-service.service';

@Component({
  selector: 'app-lista-usuario',
  templateUrl: './lista-usuario.component.html',
  styleUrls: ['./lista-usuario.component.css']
})
export class ListaUsuarioComponent implements OnInit {
  first = 0;
  rows = 10;
  display: boolean = false;
  usuarios:any[] = [];
  usuariosEliminar:any[] = [];
  fechaHoy = new Date();

  constructor(private userServices: UserServiceService) { }

  ngOnInit(): void {
    this.cargarUsuarios();
    this.deleteInsAutomatico(this.fechaHoy);
  }

  cargarUsuarios(){
    this.userServices.getUsuarios().subscribe( ({usuarios}) =>{
      this.usuarios = usuarios;

    });
  }

  fechaFiltrada(fechaActual: Date){
    const mes = ['01','02', '03','04', '05', '06', '07','08','09',
                  '10','11','12'];
    let hoy = fechaActual.getDate();
    let mesActual = fechaActual.getMonth();
    let anioActual = fechaActual.getFullYear();

    return `${anioActual}/${mes[mesActual]}/${hoy}`;
    
    
  }
  
  deleteInsAutomatico(fechaHoy: Date){
      let dateHoy = new Date(this.fechaFiltrada(fechaHoy));
    this.userServices.getUsuarios().subscribe(({usuarios})=>{
      this.usuariosEliminar = usuarios;
      this.usuariosEliminar = this.usuarios.filter( n => n.dateEnd == dateHoy.toISOString() )
      this.userServices.deleteUsuario(this.usuariosEliminar[0]).subscribe();
    })
  }

  deleteUsuario(usuario:Usuario){
    Swal.fire({
      title: '¿Borrar Usuario?',
      text: `${usuario.name} será eliminado permanentemente`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.userServices.deleteUsuario(usuario).subscribe( resp => {
          this.cargarUsuarios();
          Swal.fire(
            {
              title: 'Inscripción eliminada',
              icon: 'success',
              text: `${usuario.name} fue eliminado correctamente`

            }
          );
        })
      }
    })
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import Swal from 'sweetalert2';
import { UserServiceService } from '../../services/user-service.service';
import { Corte, Usuario } from '../../../auth/interfaces/interfaces';
import { VentaService } from '../../services/venta.service';
import { CorteService } from '../../services/corte.service';

@Component({
  selector: 'app-nuevo-usuario',
  templateUrl: './nuevo-usuario.component.html',
  styleUrls: ['./nuevo-usuario.component.css']
})
export class NuevoUsuarioComponent implements OnInit {
  
  public date1: Date | undefined;
  
  es: any;
  invalidDates: Array<Date> | undefined;

  usuarioSleccionado:Usuario | undefined;
  tipoIns:string[] = ['Mensualidad','Quincena', 'Semana'];
  cortes:any[] = [];
  corte:Corte | any;
  fechaHoy = new Date();
  fechaHoyQ = new Date();
  fechaHoyS = new Date();
  fechaHoyEnd = new Date();

  usuarios: any[] = [];

  constructor(private fb: FormBuilder, private router: Router, private userService: UserServiceService,
    private routerAtivate:ActivatedRoute,
    private ventasServices: VentaService,
    private corteS: CorteService) { }
    
  
  miFormulario: FormGroup = this.fb.group({
    name: ['',[Validators.required, Validators.min(4)]],
    lastName: ['',[Validators.required, Validators.min(4)]],
    phoneNumber: ['',[Validators.required, Validators.min(4)]],
    signedUp: ['',[Validators.required]],
    dateStart: [,[]],
    dateEnd: [,[]]
  });

  ngOnInit(): void {
    this.cargarCorte(this.fechaHoy);
    this.obtenerFechaEnd(this.fechaHoyEnd);
    this.deleteInsAutomatico(this.fechaHoy);

    // this.miFormulario = this.fb.group({
    //   name: ['',[Validators.required, Validators.min(4)]],
    //   lastName: ['',[Validators.required, Validators.min(4)]],
    //   phoneNumber: ['',[Validators.required, Validators.min(4)]],
    //   signedUp: ['',[Validators.required]],
    //   dateStart: [this.fechaHoy,[Validators.required]],
    //   dateEnd: [this.fechaHoy,[]]
    // });

  }

  // cargarUsuario(id:string){
      
  //   if (id === 'nuevo') {
  //     return;
  //   }

  //     this.userService.getUsuario(id).subscribe( ({usuario}) =>{
  //       console.log(usuario);
  //       if (!usuario) {
  //         this.router.navigateByUrl('dashboard/mensualidades');
  //       }
  //       const {name,lastName,phoneNumber,signedUp,dateStart,dateEnd} = usuario;
  //       this.usuarioSleccionado = usuario;
  //       this.miFormulario.setValue({name,lastName,phoneNumber,signedUp,dateStart,dateEnd})
  //     })
  // }
  cargarCorte(fechaHoy:Date){
    let fechaObtenida = new Date(this.fechaFiltrada(fechaHoy));
    this.corteS.getCortes().subscribe( ({cortes}) =>{
      this.cortes = cortes;
      this.cortes = this.cortes.filter( n => n.fecha == fechaObtenida.toISOString()); 
      this.corte = this.cortes[0];

    });
  } 

  sumarDias(fecha: Date, dias:number){
    fecha.setDate(fecha.getDate() + dias);
    return fecha;
  }

  obtenerFechaEnd(fechaActualEnd: Date){
    const mes = ['01','02', '03','04', '05', '06', '07','08','09',
    '10','11','12'];
    let hoy = fechaActualEnd.getDate();
    let mesActual = fechaActualEnd.getMonth();
    let anioActual = fechaActualEnd.getFullYear();

    let fecha = `${anioActual}/${mes[mesActual + 1]}/${hoy}`;
    let fechaFinal = new Date(fecha);
    return fechaFinal.toISOString();
   
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

  validacionCrear(){
    let fechaDelDia = new Date(this.fechaFiltrada(this.fechaHoy));
    if (!this.corte) {
      this.crearUsuario();
    }else if(this.corte.fecha == fechaDelDia.toISOString()){
      Swal.fire(
        {
          title: 'El corte ha sido generado.',
          text: 'ya no puedes generar mas inscripciones hasta mañana.',
          icon: 'error',
          confirmButtonColor: '#8dc641',
          confirmButtonText: 'Aceptar'
        }
      )
      return;
    }
  }

  deleteInsAutomatico(fechaHoy: Date){
    this.userService.getUsuarios().subscribe(({usuarios})=>{
      this.usuarios = usuarios;
      this.usuarios = this.usuarios.filter( n => n.dateEnd == this.fechaFiltrada(this.fechaHoy))
      // this.userService.deleteUsuario()
      console.log(this.usuarios);
    })
  }

  crearUsuario(){
    

    let {name, lastName, phoneNumber, signedUp, dateStart, dateEnd} = this.miFormulario.value;
    let fechaHoy = new Date();
    let valorIns:number = 0;
    if (signedUp === 'Mensualidad') {
      valorIns = 30;
      let end = new Date();
      dateEnd = this.obtenerFechaEnd(end);
    }else if(signedUp === 'Quincena'){
      valorIns = 15;
      let quincena = this.sumarDias(this.fechaHoyQ, valorIns);
      dateEnd = this.fechaFiltrada(quincena);
    }else if(signedUp === 'Semana'){
      valorIns = 7;
      let semana = this.sumarDias(this.fechaHoyS, valorIns);
      dateEnd = this.fechaFiltrada(semana);
    }

    let precioIns = 0;
    if (signedUp === 'Mensualidad') {
      precioIns = 250;
    }else if(signedUp === 'Quincena'){
      precioIns = 180;
     
    }else if(signedUp === 'Semana'){
      precioIns = 25;
      
    }


    dateStart = new Date();
    
    let fechaFor = new Date(this.fechaFiltrada(dateStart));
    dateStart = fechaFor
   

    console.log(this.miFormulario.value);
  
    this.userService.crearUsuario(name, lastName, phoneNumber, signedUp, dateStart, dateEnd)
    .subscribe(ok =>{
      console.log(ok);
      if (ok === true) {
        this.ventasServices.crearVenta('Inscripción', 
        1, 
        precioIns, 
        precioIns, 
        `Nueva ${signedUp} para: ${name} ${lastName}`, 
        fechaFor, 
        phoneNumber,
        '').subscribe();
        Swal.fire(
          {
            title: 'Inscripción creada',
            text: ok.name,
            icon: 'success',
            confirmButtonColor: '#8dc641',
            confirmButtonText: 'Aceptar'
          }
        ).then((result) =>{
          if (result.value) {
            this.router.navigateByUrl('dashboard/mensualidades');
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

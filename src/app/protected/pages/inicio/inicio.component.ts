import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { Corte, Usuario } from 'src/app/auth/interfaces/interfaces';
import { AuthService } from 'src/app/auth/services/auth.service';
import { CorteService } from '../../services/corte.service';
import { DeudaService } from '../../services/deuda.service';
import { UserServiceService } from '../../services/user-service.service';
import { VentaService } from '../../services/venta.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  get trabajador(){
    return this.auth.trabajador;
  }
  
  usuarios:any[] = [];
  deudas:any[] = [];
  ganancias:any[] = [];
  usuario: Usuario | any;
  fechaVentas = new Date();
  fechaDeudas = new Date();
  fechaHoy = new Date();
  fechaHoy2 = new Date();
  fecha:Date | any;
  suma:number = 0;
  sumaVentas=0;

  cortes:any[] = [];
  corte:Corte | any;

  

  constructor(private auth:AuthService,
    private users: UserServiceService,
    private deudaService:DeudaService,
    private corteS:CorteService,
    private ventasService:VentaService) {
      
     }

  ngOnInit(): void {
    this.getMensualidades();
    this.sumarDeudas(this.fechaDeudas);
    this.sumarVentas(this.fechaVentas);
    this.obtenerFechaAviso(this.fechaHoy)
  }

  

  // getCortes(){
  //   this.corteS.getCortes().subscribe(
  //     ({cortes})=>{
  //       this.cortes = cortes;
  //       this.corte = this.cortes[0];

  //       const values = Object.values(this.meses)
  //       this.barChartData.datasets.push({ data: [20,12,42], label: 'Abril' });
  //       console.log(this.barChartData.labels);
  //     }
  //   )
  // }

  obtenerFechaAviso(fechaDB: Date){
    const mesFormat = ['01','02', '03','04', '05', '06', '07','08','09',
    '10','11','12'];
        let dia = fechaDB.getDate();
        let mes = fechaDB.getMonth();
        let anio = fechaDB.getFullYear();
        dia = dia + 3;
        let fechaAviso = new Date(`${anio}/${mesFormat[mes]}/${dia}`)
        console.log(fechaAviso);
        return fechaAviso
        

  }

  getMensualidades(){
    this.users.getUsuarios().subscribe(
      ({usuarios})=>{
        let fechaDosdias = new Date(this.sumarDias(this.fechaHoy, 2))
        let fechaUnDia = new Date(this.sumarDias(this.fechaHoy2, 1))

        let fechaDosdiasF = new Date(this.fechaFiltrada(fechaDosdias));
        let fechaUnDiaF = new Date(this.fechaFiltrada(fechaUnDia));
        

         this.usuarios = usuarios;
        //  this.usuarios = this.usuarios.filter(n => n.dateEnd === this.obtenerFechaAviso(fechaActual) || n.dateEnd === this.obtenerFechaAviso(fechaActual2) || n.dateEnd === this.obtenerFechaAviso(fechaActual3) )
        this.usuarios = this.usuarios.filter(n => n.dateEnd === fechaDosdiasF.toISOString() || n.dateEnd === fechaUnDiaF.toISOString())
      }
    )
  }

  enviar( usuario:Usuario){
    this.usuario = usuario
    let numero = usuario.phoneNumber;
    let nombre = usuario.name;
    let fecha = Date.parse(this.usuario.dateEnd);
    let fechaHoy = new Date(fecha);

    window.open(`https://wa.me/521${numero}?text= Hola ${nombre}, Se te informa que tu inscripción se vencera el día: ${fechaHoy.toLocaleDateString()}. favor de pasar a pagar.. att: HellenGym `);
     
  }

  sumarDeudas(fechaHoy:Date){
    this.deudaService.getDeudas().subscribe(
      ({deudas}) =>{
        let fechaObtenida = new Date(this.fechaFiltrada(fechaHoy));
        this.deudas = deudas;
        this.deudas = this.deudas.filter( n => n.fecha <= fechaObtenida.toISOString())
       
          this.deudas.forEach(element => { 
          
            this.suma += element.perdida
              
            });
      }
    )
    
  }

  sumarVentas(fechaHoy:Date){
    this.ventasService.getGanancias().subscribe(
      ({ventas}) =>{
        let fechaObtenida = new Date(this.fechaFiltrada(fechaHoy));
        this.ganancias = ventas;
        this.ganancias = this.ganancias.filter( n => n.fecha == fechaObtenida.toISOString())
       
          this.ganancias.forEach(element => { 
          
            this.sumaVentas += element.ganancia
              
            });
      }
    )
    
  }

  sumarDias(fecha: Date, dias:number){
    fecha.setDate(fecha.getDate() + dias);
    return fecha;
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

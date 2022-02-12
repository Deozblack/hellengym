import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CorteService } from '../../services/corte.service';
import { VentaService } from '../../services/venta.service';
import { filter } from 'rxjs/operators';
import { Corte } from '../../../auth/interfaces/interfaces';

@Component({
  selector: 'app-lista-historial',
  templateUrl: './lista-historial.component.html',
  styleUrls: ['./lista-historial.component.css']
})
export class ListaHistorialComponent implements OnInit {

  fechaHoy = new Date();
  ventas:any[] = [];
  cortes:any[] = [];
  corte: any;
  ventaMostrar:[] = [];

  constructor(private ventasService: VentaService,
    private routerActivate: ActivatedRoute,
    private corteS:CorteService) { }

  ngOnInit(): void {
    this.routerActivate.params.subscribe( ({id}) =>{
     this.cargarVenta(id);
     this.cargarCorte(id);
    });

    // this.cargarVentas();
  }

  cargarVenta(id:Date){
      
    this.ventasService.getVentas().subscribe(
      ({ventas})=> {
        this.ventas = ventas;
        this.ventas = this.ventas.filter( n => n.fecha == id)
        console.log(this.ventas);
      }
    )

  }
  cargarCorte(id:Date){
    this.corteS.getCortes().subscribe(
      ({cortes})=>{
        console.log(cortes);
          this.cortes = cortes;
          this.cortes = this.cortes.filter(n => n.fecha == id);
          this.corte = this.cortes[0];
          console.log(this.cortes);
      }
    )
  }

  // cargarVentas(){
  //   this.ventasService.getVentas().subscribe(({ventas}) =>{
  //     this.ventas = ventas
  //   })
  // }

}

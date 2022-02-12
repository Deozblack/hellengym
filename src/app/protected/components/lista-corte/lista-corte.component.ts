import { Component, OnInit } from '@angular/core';
import { Corte } from '../../../auth/interfaces/interfaces';
import { CorteService } from '../../services/corte.service';

@Component({
  selector: 'app-lista-corte',
  templateUrl: './lista-corte.component.html',
  styleUrls: ['./lista-corte.component.css']
})
export class ListaCorteComponent implements OnInit {

  cortes:any[] = [];

  constructor(private cortesServices: CorteService) { }

  ngOnInit(): void {
    this.cargarCortes();
  }
  cargarCortes(){
    this.cortesServices.getCortes().subscribe(({cortes}) => {
      this.cortes = cortes;
        console.log(cortes);
    });
  }
  deleteCorte(corte:Corte){

  }

}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-trabajadores',
  templateUrl: './trabajadores.component.html',
  styleUrls: ['./trabajadores.component.css']
})
export class TrabajadoresComponent implements OnInit {
  
   btnCancelar:boolean = true;
   btnCrear:boolean = true;

  constructor() { }

  ngOnInit(): void {
    
  }

}

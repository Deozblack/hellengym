import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { Trabajador } from '../../auth/interfaces/interfaces';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  get trabajador(){
    return this.auth.trabajador;
  }

  constructor(private router:Router, private auth:AuthService) { }

  ngOnInit(): void {
  }
  
}

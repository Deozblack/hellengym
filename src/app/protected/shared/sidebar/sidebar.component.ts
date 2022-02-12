import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {


  get trabajador(){
    return this.auth.trabajador;
  }
 
  constructor(private auth:AuthService, private router:Router) { }

  ngOnInit(): void {
    
  }

  logout(){
    this.router.navigateByUrl('/auth');
    this.auth.logout();
  }

  ariaExpanded(){
    
  }

  

}

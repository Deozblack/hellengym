import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  miFormulario: FormGroup = this.fb.group({
    user:['', [Validators.required]],
    password: ['',[Validators.required, Validators.min(6)]]
  });
  constructor(private fb: FormBuilder, private router: Router, private authServices: AuthService) { }

  
  ngOnInit(): void {
  }
  
  login(){
    const {user, password} = this.miFormulario.value;
    this.authServices.login(user,password)
    .subscribe(ok =>{
      console.log(ok);
      if (ok === true) {
        this.router.navigateByUrl('/dashboard/inicio');
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

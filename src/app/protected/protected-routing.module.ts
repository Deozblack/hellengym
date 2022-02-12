import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TrabajadoresComponent } from './pages/trabajadores/trabajadores.component';
import { MensualidadesComponent } from './pages/mensualidades/mensualidades.component';
import { VentasComponent } from './pages/ventas/ventas.component';
import { ListaTrabajadorComponent } from './components/lista-trabajador/lista-trabajador.component';
import { NuevoTrabajadorComponent } from './components/nuevo-trabajador/nuevo-trabajador.component';
import { ListaUsuarioComponent } from './components/lista-usuario/lista-usuario.component';
import { NuevoUsuarioComponent } from './components/nuevo-usuario/nuevo-usuario.component';
import { InventariosComponent } from './pages/inventarios/inventarios.component';
import { ListaProductoComponent } from './components/lista-producto/lista-producto.component';
import { NuevoProductoComponent } from './components/nuevo-producto/nuevo-producto.component';
import { ListaVentaComponent } from './components/lista-venta/lista-venta.component';
import { NuevaVentaComponent } from './components/nueva-venta/nueva-venta.component';
import { ListaCorteComponent } from './components/lista-corte/lista-corte.component';
import { CortesComponent } from './pages/cortes/cortes.component';
import { ListaHistorialComponent } from './components/lista-historial/lista-historial.component';
import { DeudasComponent } from './pages/deudas/deudas.component';
import { ListaDeudaComponent } from './components/lista-deuda/lista-deuda.component';
import { NuevaDeudaComponent } from './components/nueva-deuda/nueva-deuda.component';
import { NuevaDeudaPzComponent } from './components/nueva-deuda-pz/nueva-deuda-pz.component';
import { NuevoGastoComponent } from './components/nuevo-gasto/nuevo-gasto.component';
import { InicioComponent } from './pages/inicio/inicio.component';

const routes: Routes = [
  {
    path:'',
    component: DashboardComponent,
    children:[
      {
        path: 'inicio',
        component:InicioComponent
      },
      {
        path: 'trabajadores',
        component:TrabajadoresComponent,
        children: [
          {
            path:'',
            component: ListaTrabajadorComponent
          },
          {
            path:'nuevo-trabajador',
            component: NuevoTrabajadorComponent
          },
          {
            path:'nuevo-trabajador/:id',
            component: NuevoTrabajadorComponent
          }
        ]
      },
      {
        path: 'mensualidades',
        component:MensualidadesComponent,
        children: [
          {
            path:'',
            component: ListaUsuarioComponent
          },
          {
            path:'nuevo',
            component: NuevoUsuarioComponent
          },
          {
            path:'nuevo/:id',
            component: NuevoUsuarioComponent
          }
        ]
      },
      {
        path: 'inventario',
        component:InventariosComponent,
        children: [
          {
            path:'',
            component: ListaProductoComponent
          },
          {
            path:'nuevo',
            component: NuevoProductoComponent
          },
          {
            path:'nuevo/:id',
            component: NuevoProductoComponent
          }
        ]
      },
      {
        path: 'ventas',
        component:VentasComponent,
        children: [
          {
            path:'',
            component: ListaVentaComponent
          },
          {
            path:'nuevo',
            component: NuevaVentaComponent
          },
          {
            path:'gasto',
            component: NuevoGastoComponent
          },
          {
            path:'nuevo/:id',
            component: NuevaVentaComponent
          }
        ]
      },
      {
        path: 'cortes',
        component:CortesComponent,
        children: [
          {
            path:'',
            component: ListaCorteComponent
          },
          {
            path:'historial/:id',
            component: ListaHistorialComponent
          }
        ]
      },
      {
        path: 'deudas',
        component:DeudasComponent,
        children: [
          {
            path:'',
            component: ListaDeudaComponent
          },
          {
            path:'nuevo',
            component: NuevaDeudaComponent
          },
          {
            path:'personalizada',
            component: NuevaDeudaPzComponent
          },
          {
            path:'nuevo/:id',
            component: NuevaDeudaComponent
          }
        ]
      },
      {
        path:'**',
        redirectTo: ''
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProtectedRoutingModule { }

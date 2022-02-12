import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule} from '@angular/forms';

import { NgChartsModule } from 'ng2-charts';

import { ProtectedRoutingModule } from './protected-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { TrabajadoresComponent } from './pages/trabajadores/trabajadores.component';
import { NuevoTrabajadorComponent } from './components/nuevo-trabajador/nuevo-trabajador.component';
import { ListaTrabajadorComponent } from './components/lista-trabajador/lista-trabajador.component';
import { VentasComponent } from './pages/ventas/ventas.component';
import { MensualidadesComponent } from './pages/mensualidades/mensualidades.component';
import { ListaUsuarioComponent } from './components/lista-usuario/lista-usuario.component';
import { NuevoUsuarioComponent } from './components/nuevo-usuario/nuevo-usuario.component';
import { NuevoProductoComponent } from './components/nuevo-producto/nuevo-producto.component';
import { ListaProductoComponent } from './components/lista-producto/lista-producto.component';
import { InventariosComponent } from './pages/inventarios/inventarios.component';
import { HeaderComponent } from './shared/header/header.component';
import { ListaVentaComponent } from './components/lista-venta/lista-venta.component';
import { NuevaVentaComponent } from './components/nueva-venta/nueva-venta.component';
import { ListaCorteComponent } from './components/lista-corte/lista-corte.component';
import { CortesComponent } from './pages/cortes/cortes.component';
import { ListaHistorialComponent } from './components/lista-historial/lista-historial.component';
import { NuevaDeudaComponent } from './components/nueva-deuda/nueva-deuda.component';
import { ListaDeudaComponent } from './components/lista-deuda/lista-deuda.component';
import { DeudasComponent } from './pages/deudas/deudas.component';
import { NuevaDeudaPzComponent } from './components/nueva-deuda-pz/nueva-deuda-pz.component';
import { NuevoGastoComponent } from './components/nuevo-gasto/nuevo-gasto.component';
import { InicioComponent } from './pages/inicio/inicio.component';


@NgModule({
  declarations: [
    DashboardComponent,
    SidebarComponent,
    TrabajadoresComponent,
    NuevoTrabajadorComponent,
    ListaTrabajadorComponent,
    VentasComponent,
    MensualidadesComponent,
    ListaUsuarioComponent,
    NuevoUsuarioComponent,
    NuevoProductoComponent,
    ListaProductoComponent,
    InventariosComponent,
    HeaderComponent,
    ListaVentaComponent,
    NuevaVentaComponent,
    ListaCorteComponent,
    CortesComponent,
    ListaHistorialComponent,
    NuevaDeudaComponent,
    ListaDeudaComponent,
    DeudasComponent,
    NuevaDeudaPzComponent,
    NuevoGastoComponent,
    InicioComponent
  ],
  imports: [
    CommonModule,
    ProtectedRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgChartsModule
  ]
})
export class ProtectedModule { }

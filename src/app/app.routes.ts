import { Routes } from '@angular/router';
import { Bono } from './models/bono';
import { BonoComponent } from './components/bono/bono.component';
import { CreaditabonoComponent } from './components/bono/creaditabono/creaditabono.component';
import { AppComponent } from './app.component';
import { ListarComponent } from './components/resultados/listarResultados/listar.component';
import { ManualuserComponent } from './components/home/manualuser/manualuser.component';
import { InicioComponent } from './components/home/inicio/inicio.component';
import { LoginComponent } from './components/login/login.component';
import { FlujocajaComponent } from './components/flujocaja/flujocaja.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'inicio', component: InicioComponent },
  {
    path: 'bonos',
    component: BonoComponent,
    children: [
      {
        path: 'nuevo',
        component: CreaditabonoComponent,
      },
      { path: 'ediciones/:id', component: CreaditabonoComponent }
    ],
  },
  { path: 'resultados', component: ListarComponent },
  { path: 'resultados/:idBono', component: ListarComponent },
  { path: 'flujo-caja', component: FlujocajaComponent },
  { path: 'flujocaja/:idBono', component: FlujocajaComponent },
  { path: 'manual', component: ManualuserComponent }
];

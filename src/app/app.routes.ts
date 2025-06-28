import { Routes } from '@angular/router';
import { Bono } from './models/bono';
import { BonoComponent } from './components/bono/bono.component';
import { CreaditabonoComponent } from './components/bono/creaditabono/creaditabono.component';
import { AppComponent } from './app.component';
import { ListarComponent } from './components/resultados/listarResultados/listar.component';
import { ManualuserComponent } from './components/home/manualuser/manualuser.component';
import { InicioComponent } from './components/home/inicio/inicio.component';

export const routes: Routes = [
  { path: '', redirectTo: '/inicio', pathMatch: 'full' },
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
  { path: 'manual', component: ManualuserComponent }
];

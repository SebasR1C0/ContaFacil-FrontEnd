import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet, NavigationEnd } from '@angular/router';
import { BonoComponent } from './components/bono/bono.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    RouterModule,
    CommonModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'FrontConta';
  showHeader = true;
  currentUser: any = null;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Escuchar cambios de ruta para determinar si mostrar el header
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        // Ocultar header en la página de login
        this.showHeader = event.url !== '/login';
        
        // Cargar información del usuario desde localStorage
        if (this.showHeader) {
          this.loadCurrentUser();
        }
      });
      
    // Cargar usuario al inicializar
    this.loadCurrentUser();
  }

  loadCurrentUser() {
    // Verificar si estamos en el navegador antes de acceder a localStorage
    if (isPlatformBrowser(this.platformId)) {
      const userData = localStorage.getItem('currentUser');
      if (userData) {
        this.currentUser = JSON.parse(userData);
      } else {
        this.currentUser = null;
      }
    }
  }

  logout() {
    // Verificar si estamos en el navegador antes de acceder a localStorage
    if (isPlatformBrowser(this.platformId)) {
      // Limpiar datos del usuario
      localStorage.removeItem('currentUser');
    }
    this.currentUser = null;
    
    // Redirigir al login
    this.router.navigate(['/login']);
  }
}

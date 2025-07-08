import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet, NavigationEnd } from '@angular/router';
import { BonoComponent } from './components/bono/bono.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { ChatbotComponent } from './components/chatbot/chatbot.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatDividerModule,
    RouterModule,
    CommonModule,
    ChatbotComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'FrontConta';
  showHeader = true;
  currentUser: any = null;
  isDarkMode = false;

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
    this.loadTheme();
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

  loadTheme() {
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem('darkMode');
      this.isDarkMode = savedTheme === 'true';
      this.applyTheme();
    }
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('darkMode', this.isDarkMode.toString());
    }
    this.applyTheme();
  }

  applyTheme() {
    if (isPlatformBrowser(this.platformId)) {
      const body = document.body;
      if (this.isDarkMode) {
        body.classList.add('dark-theme');
        body.classList.remove('light-theme');
      } else {
        body.classList.add('light-theme');
        body.classList.remove('dark-theme');
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

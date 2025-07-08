import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
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
export class AppComponent implements AfterViewInit {
  @ViewChild('header', { static: false }) header?: ElementRef<HTMLElement>;
  
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
          // Aplicar tema cuando se muestre el header
          setTimeout(() => {
            this.applyTheme();
          }, 150);
        }
      });
      
    // Cargar usuario al inicializar
    this.loadCurrentUser();
    this.loadTheme();
  }

  ngAfterViewInit() {
    // Aplicar el tema después de que la vista se haya inicializado
    setTimeout(() => {
      this.applyTheme();
    }, 100);
    
    // Observar cambios en showHeader para aplicar tema cuando aparezca
    this.observeHeaderChanges();
  }
  
  private observeHeaderChanges() {
    // Solo ejecutar en el navegador, no en el servidor
    if (isPlatformBrowser(this.platformId) && typeof MutationObserver !== 'undefined') {
      // Crear un observer para detectar cuando el header aparece/desaparece
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList') {
            const header = document.querySelector('.main-header') as HTMLElement;
            if (header && this.showHeader) {
              setTimeout(() => {
                this.applyTheme();
              }, 100);
            }
          }
        });
      });
      
      // Observar cambios en el DOM
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
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
      
      // Escuchar cambios en el localStorage para el tema
      if (typeof window !== 'undefined') {
        window.addEventListener('storage', (e) => {
          if (e.key === 'darkMode') {
            this.isDarkMode = e.newValue === 'true';
            this.applyTheme();
          }
        });
      }
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
      const host = document.querySelector('app-root');
      
      if (this.isDarkMode) {
        body.classList.add('dark-theme');
        body.classList.remove('light-theme');
        if (host) {
          host.classList.add('dark-theme');
          host.classList.remove('light-theme');
        }
      } else {
        body.classList.add('light-theme');
        body.classList.remove('dark-theme');
        if (host) {
          host.classList.add('light-theme');
          host.classList.remove('dark-theme');
        }
      }
      
      // Aplicar estilos específicos al header usando ViewChild y fallback
      this.applyHeaderStyles();
    }
  }
  
  private applyHeaderStyles() {
    // Solo ejecutar en el navegador
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    
    const applyStyles = (headerElement: HTMLElement) => {
      if (this.isDarkMode) {
        headerElement.style.setProperty('background-color', '#000000', 'important');
        headerElement.style.setProperty('border-bottom-color', '#333333', 'important');
        headerElement.style.setProperty('box-shadow', '0 2px 12px rgba(0, 0, 0, 0.8)', 'important');
        headerElement.classList.add('dark-theme-header');
        headerElement.classList.remove('light-theme-header');
      } else {
        headerElement.style.setProperty('background-color', '#ffffff', 'important');
        headerElement.style.setProperty('border-bottom-color', '#e0e0e0', 'important');
        headerElement.style.setProperty('box-shadow', '0 2px 12px rgba(0, 0, 0, 0.1)', 'important');
        headerElement.classList.add('light-theme-header');
        headerElement.classList.remove('dark-theme-header');
      }
    };
    
    // Usar ViewChild si está disponible
    if (this.header?.nativeElement) {
      applyStyles(this.header.nativeElement);
    }
    
    // Fallback usando querySelector con múltiples intentos
    let attempts = 0;
    const maxAttempts = 10;
    
    const tryApplyStyles = () => {
      const header = document.querySelector('.main-header') as HTMLElement;
      if (header) {
        applyStyles(header);
      } else if (attempts < maxAttempts) {
        attempts++;
        setTimeout(tryApplyStyles, 100);
      }
    };
    
    setTimeout(tryApplyStyles, 50);
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

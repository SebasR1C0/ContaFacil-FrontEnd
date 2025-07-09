import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  imports: [CommonModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent implements OnInit {
  userName: string = 'Usuario';
  
  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.loadUserName();
  }

  private loadUserName() {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const userStr = localStorage.getItem('currentUser');
        if (userStr) {
          const user = JSON.parse(userStr);
          this.userName = user.nombre || user.username || 'Usuario';
        }
      } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
        this.userName = 'Usuario';
      }
    }
  }

  goToRegisterBond() {
    this.router.navigate(['/bonos/nuevo']);
  }

  goToManual() {
    this.router.navigate(['/manual']);
  }

  onImageError(event: any) {
    console.error('Error cargando imagen:', event);
    console.log('Ruta de imagen:', event.target.src);
  }

  onImageLoad(event: any) {
    console.log('Imagen cargada correctamente:', event.target.src);
  }
}

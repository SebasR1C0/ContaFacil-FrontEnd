import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  imports: [CommonModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {
  
  constructor(private router: Router) {}

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

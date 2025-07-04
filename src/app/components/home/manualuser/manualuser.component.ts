import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-manualuser',
  imports: [MatIcon],
  templateUrl: './manualuser.component.html',
  styleUrl: './manualuser.component.css'
})
export class ManualuserComponent {
  private imageAttempts = 0;
  private imagePaths = [
    'Manual.png',
    'assets/images/Manual.png',
    './assets/images/Manual.png',
    '/assets/images/Manual.png'
  ];

  onImageLoad(event: any) {
    console.log('Imagen cargada correctamente:', event.target.src);
  }

  onImageError(event: any) {
    console.error('Error al cargar la imagen:', event.target.src);
    this.imageAttempts++;
    
    if (this.imageAttempts < this.imagePaths.length) {
      console.log('Intentando con ruta alternativa:', this.imagePaths[this.imageAttempts]);
      event.target.src = this.imagePaths[this.imageAttempts];
    } else {
      console.error('No se pudo cargar la imagen desde ninguna ruta');
      event.target.alt = 'Imagen no disponible - Manual.png no encontrado';
      event.target.style.display = 'none';
    }
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  usuario: string = '';
  password: string = '';

  constructor(private router: Router) {}

  onLogin() {
    // Validar credenciales específicas
    if (this.usuario === 'usuario' && this.password === 'contraseña') {
      // Credenciales correctas, navegar a inicio
      this.router.navigate(['/inicio']);
    } else if (!this.usuario || !this.password) {
      // Campos vacíos
      alert('Por favor completa todos los campos');
    } else {
      // Credenciales incorrectas
      alert('Usuario o contraseña incorrectos');
    }
  }
}
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
    // Aquí puedes agregar validaciones si quieres
    if (this.usuario && this.password) {
      // Navegar a inicio después del login
      this.router.navigate(['/inicio']);
    } else {
      alert('Por favor completa todos los campos');
    }
  }
}
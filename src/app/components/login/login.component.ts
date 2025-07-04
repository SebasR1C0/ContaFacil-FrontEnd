import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { User } from '../../models/users';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';

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
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private usersService: UsersService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  onLogin() {
    // Validar que los campos no estén vacíos
    if (!this.usuario || !this.password) {
      alert('Por favor completa todos los campos');
      return;
    }

    this.isLoading = true;

    // Obtener todos los usuarios para validar credenciales
    this.usersService.list().subscribe({
      next: (users: User[]) => {
        // Buscar usuario por username
        const user = users.find(u => u.username === this.usuario);
        
        if (user && user.password === this.password && user.enabled) {
          // Credenciales correctas y usuario habilitado
          // Guardar información del usuario en localStorage solo si estamos en el navegador
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('currentUser', JSON.stringify({
              id: user.idUser,
              username: user.username,
              nombre: user.nombre,
              apellido: user.apellido,
              email: user.email
            }));
          }
          
          this.router.navigate(['/inicio']);
        } else if (user && !user.enabled) {
          alert('Usuario deshabilitado. Contacta al administrador.');
        } else if (user && user.password !== this.password) {
          alert('Contraseña incorrecta');
        } else {
          alert('Usuario no encontrado');
        }
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al validar credenciales:', error);
        alert('Error de conexión. Verifica que el servidor esté funcionando.');
        this.isLoading = false;
      }
    });
  }
}
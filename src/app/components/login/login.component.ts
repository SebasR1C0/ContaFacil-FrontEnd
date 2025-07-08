import { Component, OnInit } from '@angular/core';
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
export class LoginComponent implements OnInit {
  usuario: string = '';
  password: string = '';
  isLoading: boolean = false;
  isRegistering: boolean = false;
  isRegisteringLoading: boolean = false;
  isLoadingUsers: boolean = false;
  
  newUser: User = {
    idUser: 0,
    username: '',
    email: '',
    password: '',
    nombre: '',
    apellido: '',
    direccion: '',
    genero: '',
    fechaRegistro: new Date(),
    enabled: true
  };

  // Lista de usuarios existentes para validación
  existingUsers: User[] = [];

  constructor(
    private router: Router,
    private usersService: UsersService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.loadExistingUsers();
  }

  toggleForm(event: Event) {
    event.preventDefault();
    this.isRegistering = !this.isRegistering;
    // Limpiar formularios al cambiar
    this.usuario = '';
    this.password = '';
    this.resetNewUser();
  }

  private resetNewUser() {
    this.newUser = {
      idUser: 0,
      username: '',
      email: '',
      password: '',
      nombre: '',
      apellido: '',
      direccion: '',
      genero: '',
      fechaRegistro: new Date(),
      enabled: true
    };
  }

  // Método para obtener usuarios existentes
  private loadExistingUsers() {
    this.isLoadingUsers = true;
    this.usersService.list().subscribe({
      next: (users: User[]) => {
        this.existingUsers = users;
        this.isLoadingUsers = false;
      },
      error: (error) => {
        console.error('Error al cargar usuarios existentes:', error);
        this.isLoadingUsers = false;
      }
    });
  }

  // Validar si el username ya existe
  checkUserExists(username: string): boolean {
    return this.existingUsers.some(user => user.username === username);
  }

  // Validar si el email ya existe
  checkEmailExists(email: string): boolean {
    return this.existingUsers.some(user => user.email === email);
  }

  // Validaciones en tiempo real
  validateUsername(username: string): string {
    if (!username) return '';
    if (username.length < 3) return 'El usuario debe tener al menos 3 caracteres';
    if (this.checkUserExists(username)) return 'Este usuario ya existe';
    return '';
  }

  validateEmail(email: string): string {
    if (!email) return '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Email inválido';
    if (this.checkEmailExists(email)) return 'Este email ya está registrado';
    return '';
  }

  validatePassword(password: string): string {
    if (!password) return '';
    if (password.length < 4) return 'La contraseña debe tener al menos 4 caracteres';
    return '';
  }

  // Getters para validaciones
  get usernameError(): string {
    return this.validateUsername(this.newUser.username);
  }

  get emailError(): string {
    return this.validateEmail(this.newUser.email);
  }

  get passwordError(): string {
    return this.validatePassword(this.newUser.password);
  }

  get canRegister(): boolean {
    return !this.usernameError && !this.emailError && !this.passwordError &&
           !!this.newUser.username && !!this.newUser.email && !!this.newUser.password &&
           !!this.newUser.nombre && !!this.newUser.apellido && !!this.newUser.direccion &&
           !!this.newUser.genero;
  }

  onRegister() {
    // Validar que todos los campos estén completos
    if (!this.newUser.username || !this.newUser.email || !this.newUser.password || 
        !this.newUser.nombre || !this.newUser.apellido || !this.newUser.direccion || 
        !this.newUser.genero) {
      alert('Por favor completa todos los campos');
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.newUser.email)) {
      alert('Por favor ingresa un email válido');
      return;
    }

    // Validar longitud de contraseña
    if (this.newUser.password.length < 4) {
      alert('La contraseña debe tener al menos 4 caracteres');
      return;
    }

    // Validar si el usuario ya existe
    if (this.checkUserExists(this.newUser.username)) {
      alert('El nombre de usuario ya existe. Por favor elige otro.');
      return;
    }

    // Validar si el email ya existe
    if (this.checkEmailExists(this.newUser.email)) {
      alert('El email ya está registrado. Por favor usa otro email.');
      return;
    }

    this.isRegisteringLoading = true;

    // Preparar el usuario para el registro
    this.newUser.username = this.newUser.username.trim();
    this.newUser.email = this.newUser.email.trim().toLowerCase();
    this.newUser.nombre = this.newUser.nombre.trim();
    this.newUser.apellido = this.newUser.apellido.trim();
    this.newUser.direccion = this.newUser.direccion.trim();
    this.newUser.fechaRegistro = new Date();
    this.newUser.enabled = true;
    this.newUser.idUser = 0; // Asegurar que sea 0 para nuevo usuario

    console.log('Datos a enviar:', this.newUser); // Para debugging

    this.usersService.insert(this.newUser).subscribe({
      next: (response) => {
        console.log('Respuesta del servidor:', response);
        alert('¡Usuario registrado exitosamente! Ahora puedes iniciar sesión.');
        this.isRegistering = false;
        this.resetNewUser();
        this.isRegisteringLoading = false;
        // Recargar la lista de usuarios existentes
        this.loadExistingUsers();
      },
      error: (error) => {
        console.error('Error al registrar usuario:', error);
        console.error('Detalles del error:', error.error);
        
        let errorMessage = 'Error al registrar usuario.';
        if (error.status === 500) {
          errorMessage = 'Error interno del servidor. Verifica que todos los campos estén correctos.';
        } else if (error.error && error.error.message) {
          errorMessage = error.error.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        alert(errorMessage + ' Por favor intenta nuevamente.');
        this.isRegisteringLoading = false;
      }
    });
  }

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
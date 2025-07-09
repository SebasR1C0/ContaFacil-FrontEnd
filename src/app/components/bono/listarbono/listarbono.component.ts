import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Bono } from '../../../models/bono';
import { BonoService } from '../../../services/bono.service';
import {MatIconModule} from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute } from '@angular/router';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-listarbono',
  imports: [MatTableModule, MatIconModule, MatButtonModule, RouterModule, CommonModule, MatSnackBarModule],
  templateUrl: './listarbono.component.html',
  styleUrl: './listarbono.component.css'
})
export class ListarbonoComponent implements OnInit {
  dataSource: MatTableDataSource<Bono> = new MatTableDataSource();
  displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8'];


  constructor(
    private bS: BonoService,
    private snackBar: MatSnackBar,
    @Inject(PLATFORM_ID) private platformId: Object
  ){}
  
  ngOnInit(): void {
    this.loadUserBonos();
    this.bS.getlist().subscribe((data) => {
      // Filtrar por usuario actual y ordenar por ID de menor a mayor
      const filteredData = this.filterBonosByCurrentUser(data);
      const sortedData = filteredData.sort((a, b) => a.idBono - b.idBono);
      this.dataSource = new MatTableDataSource(sortedData);
    });
  }

  private loadUserBonos(): void {
    if (isPlatformBrowser(this.platformId)) {
      const currentUserStr = localStorage.getItem('currentUser');
      if (currentUserStr) {
        try {
          const currentUser = JSON.parse(currentUserStr);
          const userId = currentUser.id;
          
          // Llamar al método listarxbono con el ID del usuario
          this.bS.listarxbono(userId).subscribe((data) => {
            // Ordenar por ID de menor a mayor
            const sortedData = data.sort((a, b) => a.idBono - b.idBono);
            this.dataSource = new MatTableDataSource(sortedData);
          });
        } catch (error) {
          console.error('Error al parsear datos del usuario:', error);
          this.dataSource = new MatTableDataSource<Bono>([]);
        }
      } else {
        console.warn('No se encontró usuario logueado');
        this.dataSource = new MatTableDataSource<Bono>([]);
      }
    }
  }

  private filterBonosByCurrentUser(bonos: Bono[]): Bono[] {
    if (isPlatformBrowser(this.platformId)) {
      const currentUserStr = localStorage.getItem('currentUser');
      if (currentUserStr) {
        try {
          const currentUser = JSON.parse(currentUserStr);
          const userId = currentUser.id;
          return bonos.filter(bono => bono.idUsers?.idUser === userId);
        } catch (error) {
          console.error('Error al filtrar bonos por usuario:', error);
          return [];
        }
      }
    }
    return [];
  }

  eliminarBono(idBono: number): void {
    const confirmacion = window.confirm('¿Estás seguro de que deseas eliminar este bono?');
    
    if (confirmacion) {
      this.bS.delete(idBono).subscribe({
        next: (response) => {
          console.log('Bono eliminado correctamente:', response);
          this.snackBar.open('Bono eliminado exitosamente', 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          });
          // Recargar la lista de bonos después de eliminar
          this.loadUserBonos();
        },
        error: (error) => {
          console.error('Error al eliminar el bono:', error);
          this.snackBar.open('Error al eliminar el bono. Por favor, inténtalo de nuevo.', 'Cerrar', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          });
        }
      });
    }
  }

  emitirBono(idBono: number): void {
    const confirmacion = window.confirm('¿Estás seguro de que deseas emitir este bono?');
    
    if (confirmacion) {
      // Primero obtener los datos actuales del bono
      this.bS.listId(idBono).subscribe({
        next: (bonoData) => {
          // Crear una copia del bono con emitido = true
          const bonoActualizado = { ...bonoData, emitido: true };
          
          // Actualizar el bono usando el método update existente
          this.bS.update(bonoActualizado).subscribe({
            next: (response) => {
              console.log('Bono emitido correctamente:', response);
              this.snackBar.open('Bono emitido exitosamente', 'Cerrar', {
                duration: 3000,
                horizontalPosition: 'center',
                verticalPosition: 'bottom'
              });
              // Recargar la lista de bonos después de emitir
              this.loadUserBonos();
            },
            error: (error) => {
              console.error('Error al emitir el bono:', error);
              this.snackBar.open('Error al emitir el bono. Por favor, inténtalo de nuevo.', 'Cerrar', {
                duration: 5000,
                horizontalPosition: 'center',
                verticalPosition: 'bottom'
              });
            }
          });
        },
        error: (error) => {
          console.error('Error al obtener los datos del bono:', error);
          this.snackBar.open('Error al obtener los datos del bono.', 'Cerrar', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          });
        }
      });
    }
  }
}
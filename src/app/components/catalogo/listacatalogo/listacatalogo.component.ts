import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CatalogoMoneda } from '../../../models/catalogomoneda';
import { CatalogomonedaService } from '../../../services/catalogomoneda.service';

@Component({
  selector: 'app-listacatalogo',
  imports: [CommonModule, MatTableModule, MatIconModule, MatButtonModule, RouterModule, MatSnackBarModule],
  templateUrl: './listacatalogo.component.html',
  styleUrl: './listacatalogo.component.css'
})
export class ListacatalogoComponent implements OnInit {
  dataSource: MatTableDataSource<CatalogoMoneda> = new MatTableDataSource();
  displayedColumns: string[] = ['c1', 'c2', 'c3']
  
  constructor(
    private cS: CatalogomonedaService,
    private snackBar: MatSnackBar
  ) {}
  
  ngOnInit(): void {
    this.loadCatalogo();
    this.cS.getlist().subscribe((data) => {
      const sortedData = data.sort((a, b) => a.idCatalogoMoneda - b.idCatalogoMoneda);
      this.dataSource = new MatTableDataSource(sortedData);
    });
  }

  private loadCatalogo(): void {
    this.cS.list().subscribe((data) => {
      const sortedData = data.sort((a, b) => a.idCatalogoMoneda - b.idCatalogoMoneda);
      this.dataSource = new MatTableDataSource(sortedData);
    });
  }

  eliminarMoneda(idCatalogoMoneda: number): void {
    const confirmacion = window.confirm('¿Estás seguro de que deseas eliminar esta moneda?');
    
    if (confirmacion) {
      this.cS.delete(idCatalogoMoneda).subscribe({
        next: (response) => {
          console.log('Moneda eliminada correctamente:', response);
          this.snackBar.open('Moneda eliminada exitosamente', 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          });
          this.loadCatalogo();
        },
        error: (error) => {
          console.error('Error al eliminar la moneda:', error);
          this.snackBar.open('Error al eliminar la moneda. Por favor, inténtalo de nuevo.', 'Cerrar', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          });
        }
      });
    }
  }
}

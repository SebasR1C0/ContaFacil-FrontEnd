import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Bono } from '../../../models/bono';
import { BonoService } from '../../../services/bono.service';
import {MatIconModule} from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-listarbono',
  imports: [MatTableModule, MatIconModule, RouterModule],
  templateUrl: './listarbono.component.html',
  styleUrl: './listarbono.component.css'
})
export class ListarbonoComponent implements OnInit {
  dataSource: MatTableDataSource<Bono> = new MatTableDataSource();
  displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6','c7', 'c8'];


  constructor(
    private bS: BonoService,
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
  
}
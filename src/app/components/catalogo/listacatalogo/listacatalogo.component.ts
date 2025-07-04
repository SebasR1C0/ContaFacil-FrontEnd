import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { CatalogoMoneda } from '../../../models/catalogomoneda';
import { CatalogomonedaService } from '../../../services/catalogomoneda.service';

@Component({
  selector: 'app-listacatalogo',
  imports: [CommonModule, MatTableModule, MatIconModule, RouterModule],
  templateUrl: './listacatalogo.component.html',
  styleUrl: './listacatalogo.component.css'
})
export class ListacatalogoComponent implements OnInit {
  dataSource: MatTableDataSource<CatalogoMoneda> = new MatTableDataSource();
  displayedColumns: string[] = ['c1', 'c2']
  constructor(private cS: CatalogomonedaService) {}
  ngOnInit(): void {
      this.cS.list().subscribe((data) => {
        // Ordenar por ID de menor a mayor
        const sortedData = data.sort((a, b) => a.idCatalogoMoneda - b.idCatalogoMoneda);
        this.dataSource = new MatTableDataSource(sortedData);
      });
      this.cS.getlist().subscribe((data) => {
        // Ordenar por ID de menor a mayor
        const sortedData = data.sort((a, b) => a.idCatalogoMoneda - b.idCatalogoMoneda);
        this.dataSource = new MatTableDataSource(sortedData);
      });
  }

}

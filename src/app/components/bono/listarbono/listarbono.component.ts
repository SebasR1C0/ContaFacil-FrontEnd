import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Bono } from '../../../models/bono';
import { BonoService } from '../../../services/bono.service';
import {MatIconModule} from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-listarbono',
  imports: [MatTableModule, MatIconModule, RouterModule],
  templateUrl: './listarbono.component.html',
  styleUrl: './listarbono.component.css'
})
export class ListarbonoComponent implements OnInit {
  dataSource: MatTableDataSource<Bono> = new MatTableDataSource();
  displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6','c7'];


  constructor(private bS: BonoService){}
  ngOnInit(): void {
    this.bS.list().subscribe((data) => {
      // Ordenar por ID de menor a mayor
      const sortedData = data.sort((a, b) => a.idBono - b.idBono);
      this.dataSource = new MatTableDataSource(sortedData);
    });
    this.bS.getlist().subscribe((data) => {
      // Ordenar por ID de menor a mayor
      const sortedData = data.sort((a, b) => a.idBono - b.idBono);
      this.dataSource = new MatTableDataSource(sortedData);
    });
  }
  
}
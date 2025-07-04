import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ResultadosFinancieros } from '../../../models/resultados';
import { ResultadosService } from '../../../services/resultados.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-listar',
  imports: [MatTableModule, MatIconModule],
  templateUrl: './listar.component.html',
  styleUrl: './listar.component.css'
})

export class ListarComponent implements OnInit{
  dataSource: MatTableDataSource<ResultadosFinancieros> = new MatTableDataSource();
  displayedColumns: string[] = ['c2', 'c3', 'c4', 'c5', 'c6','c7','c8','c9','c10','c11'];
  constructor(private bS: ResultadosService, private route: ActivatedRoute){}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const bonoId = params.get('idBono');
      if (bonoId) {
        this.listarPorBono(+bonoId);
      } else {
        this.dataSource = new MatTableDataSource<ResultadosFinancieros>([]); 
      }
    });
  }

  listarPorBono(id: number) {
    this.bS.listarxbono(id).subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
    });
  }
} 
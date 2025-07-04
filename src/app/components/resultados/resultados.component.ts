import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ResultadosFinancieros } from '../../models/resultados';
import { ResultadosService } from '../../services/resultados.service';

@Component({
  selector: 'app-resultados',
  imports: [CommonModule],
  templateUrl: './resultados.component.html',
  styleUrl: './resultados.component.css'
})
export class ResultadosComponent implements OnInit {
  resultado: ResultadosFinancieros | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private resultadosService: ResultadosService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const bonoId = params.get('idBono');
      if (bonoId) {
        this.cargarResultado(+bonoId);
      }
    });
  }

  cargarResultado(id: number) {
    this.resultadosService.listarxbono(id).subscribe((data) => {
      if (data && data.length > 0) {
        this.resultado = data[0]; // Tomar el primer resultado
      }
    });
  }

  goBack() {
    this.router.navigate(['/bonos']);
  }
}

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
    console.log('🚀 Componente Resultados inicializado');
    
    this.route.paramMap.subscribe(params => {
      const bonoId = params.get('idBono');
      console.log('📋 ID del bono obtenido de la ruta:', bonoId);
      
      if (bonoId) {
        this.cargarResultado(+bonoId);
      } else {
        console.error('❌ No se encontró ID del bono en la ruta');
      }
    });
  }

  cargarResultado(id: number) {
    console.log('📊 Iniciando carga de resultados para bono ID:', id);
    
    this.resultadosService.listarxbono(id).subscribe({
      next: (data) => {
        console.log('✅ Datos recibidos del servicio:', data);
        if (data && data.length > 0) {
          this.resultado = data[0]; // Tomar el primer resultado
          console.log('✅ Resultado asignado:', this.resultado);
        } else {
          console.log('⚠️ No hay datos en la respuesta del servicio');
        }
      },
      error: (error) => {
        console.error('❌ Error al cargar resultados:', error);
      },
      complete: () => {
        console.log('🏁 Carga de resultados completada');
      }
    });
  }

  goBack() {
    this.router.navigate(['/bonos']);
  }
}
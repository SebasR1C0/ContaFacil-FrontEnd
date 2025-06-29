import { Component, OnInit, OnDestroy, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FlujoCajaService } from '../../services/flujo-caja.service';
import { FlujoCaja } from '../../models/flujo-caja';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-flujo-caja-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './flujo-caja-list.component.html',
  styleUrls: ['./flujo-caja-list.component.css']
})
export class FlujoCajaListComponent implements OnInit, OnDestroy, OnChanges {
  @Input() bonoId: number | null = null; // ID del bono para filtrar
  
  flujos: FlujoCaja[] = [];
  
  // Estados de la aplicación
  isLoading = false;
  hasError = false;
  errorMessage = '';
  
  // Observable para manejar la destrucción del componente
  private destroy$ = new Subject<void>();
  
  constructor(private flujoCajaService: FlujoCajaService, private router: Router) {}
  
  ngOnInit(): void {
    this.loadFlujos();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    // Recargar datos cuando cambie el bonoId
    if (changes['bonoId'] && !changes['bonoId'].firstChange) {
      this.loadFlujos();
    }
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  /**
   * Carga los flujos de caja (todos o por bono específico)
   */
  loadFlujos(): void {
    this.isLoading = true;
    this.hasError = false;
    this.errorMessage = '';
    
    // Decidir qué servicio usar según si hay bonoId
    const serviceCall = this.bonoId 
      ? this.flujoCajaService.getFlujosByBonoId(this.bonoId)
      : this.flujoCajaService.getAllFlujos();
    
    serviceCall
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (flujos) => {
          this.flujos = flujos;
          this.isLoading = false;
          
          const mensaje = this.bonoId 
            ? `✅ Flujos del bono ${this.bonoId} cargados exitosamente: ${flujos.length}`
            : `✅ Flujos cargados exitosamente: ${flujos.length}`;
          console.log(mensaje);
        },
        error: (error) => {
          this.hasError = true;
          this.errorMessage = error;
          this.isLoading = false;
          
          const errorMsg = this.bonoId 
            ? `❌ Error al cargar flujos del bono ${this.bonoId}: ${error}`
            : `❌ Error al cargar flujos: ${error}`;
          console.error(errorMsg);
          
          // Información adicional para debugging
          if (this.bonoId) {
            console.log('🔧 Endpoints probados automáticamente:');
            console.log(`1. http://localhost:8081/flujo/bono/${this.bonoId}`);
            console.log(`2. http://localhost:8081/bono/${this.bonoId}/flujos`);
            console.log(`3. http://localhost:8081/flujocaja/bono/${this.bonoId}`);
            console.log(`4. http://localhost:8081/flujo/cajaxbono/${this.bonoId}`);
            console.log('💡 Verifica que el backend tenga alguno de estos endpoints implementado.');
          }
        }
      });
  }
  
  /**
   * Actualiza los datos
   */
  refresh(): void {
    this.loadFlujos();
  }

  /**
   * Prueba diferentes endpoints para debugging
   */
  testEndpoints(): void {
    if (!this.bonoId) {
      console.log('No hay bonoId para probar');
      return;
    }

    console.log(`🔍 Probando endpoints para bono ID: ${this.bonoId}`);
    this.flujoCajaService.testEndpoints(this.bonoId)
      .subscribe({
        next: (result) => {
          console.log('📊 Endpoints para probar manualmente:', result.endpoints);
          console.log('💡 Abre las herramientas de desarrollador y ve a la pestaña Network');
          console.log('🔍 Luego haz clic en "Reintentar" para ver qué endpoints devuelven 404');
        },
        error: (error) => {
          console.error('Error al probar endpoints:', error);
        }
      });
  }
  
  /**
   * Navega de vuelta a la lista de bonos
   */
  goBackToBonos(): void {
    this.router.navigate(['/bonos']);
  }
  
  /**
   * Formatea una fecha para mostrar
   * @param date - Fecha a formatear
   * @returns string con la fecha formateada
   */
  formatDate(date: string | Date): string {
    if (!date) return 'N/A';
    
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return dateObj.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      return 'Fecha inválida';
    }
  }
  
  /**
   * Formatea un valor monetario para mostrar
   * @param value - Valor a formatear
   * @returns string con el valor formateado
   */
  formatCurrency(value: number): string {
    if (value === null || value === undefined) return 'N/A';
    
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  }
  
  /**
   * Formatea un número para mostrar
   * @param value - Valor a formatear
   * @param decimals - Número de decimales
   * @returns string con el número formateado
   */
  formatNumber(value: number, decimals: number = 2): string {
    if (value === null || value === undefined) return 'N/A';
    
    return new Intl.NumberFormat('es-PE', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value);
  }
  
  /**
   * Cargar datos de demostración para mostrar el diseño
   */
  loadDemoData(): void {
    // Datos de ejemplo para demostración
    this.flujos = [
      {
        idFlujoCaja: 1,
        periodo: 1,
        fechaProgramada: '2024-01-15',
        plazoGracia: 'N/A',
        bono: 1,
        bonoIndexado: 1250.50,
        cuponInteres: 0.08,
        cuota: 1250.50,
        amortizacion: 850.30,
        prima: 0,
        escudo: 0,
        flujoEmisor: 2100.80,
        flujoEmisorEscudo: 2100.80,
        flujoBonista: 2100.80,
        flujoAct: 1950.75,
        faPlazo: 1.08,
        convexidad: 0.15,
        bonos: null
      },
      {
        idFlujoCaja: 2,
        periodo: 2,
        fechaProgramada: '2024-02-15',
        plazoGracia: 'N/A',
        bono: 1,
        bonoIndexado: 1180.25,
        cuponInteres: 0.08,
        cuota: 1180.25,
        amortizacion: 920.60,
        prima: 0,
        escudo: 0,
        flujoEmisor: 2100.85,
        flujoEmisorEscudo: 2100.85,
        flujoBonista: 2100.85,
        flujoAct: 1806.42,
        faPlazo: 1.16,
        convexidad: 0.18,
        bonos: null
      },
      {
        idFlujoCaja: 3,
        periodo: 3,
        fechaProgramada: '2024-03-15',
        plazoGracia: 'N/A',
        bono: 1,
        bonoIndexado: 1105.40,
        cuponInteres: 0.08,
        cuota: 1105.40,
        amortizacion: 995.45,
        prima: 0,
        escudo: 0,
        flujoEmisor: 2100.85,
        flujoEmisorEscudo: 2100.85,
        flujoBonista: 2100.85,
        flujoAct: 1671.91,
        faPlazo: 1.26,
        convexidad: 0.21,
        bonos: null
      },
      {
        idFlujoCaja: 4,
        periodo: 4,
        fechaProgramada: '2024-04-15',
        plazoGracia: 'N/A',
        bono: 1,
        bonoIndexado: 1025.10,
        cuponInteres: 0.08,
        cuota: 1025.10,
        amortizacion: 1075.75,
        prima: 0,
        escudo: 0,
        flujoEmisor: 2100.85,
        flujoEmisorEscudo: 2100.85,
        flujoBonista: 2100.85,
        flujoAct: 1547.73,
        faPlazo: 1.36,
        convexidad: 0.24,
        bonos: null
      },
      {
        idFlujoCaja: 5,
        periodo: 5,
        fechaProgramada: '2024-05-15',
        plazoGracia: 'N/A',
        bono: 1,
        bonoIndexado: 939.20,
        cuponInteres: 0.08,
        cuota: 939.20,
        amortizacion: 1161.65,
        prima: 0,
        escudo: 0,
        flujoEmisor: 2100.85,
        flujoEmisorEscudo: 2100.85,
        flujoBonista: 2100.85,
        flujoAct: 1432.45,
        faPlazo: 1.47,
        convexidad: 0.27,
        bonos: null
      }
    ];
    
    this.isLoading = false;
    this.hasError = false;
    console.log('✨ Datos de demostración cargados');
  }
}

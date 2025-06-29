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
  
  // Propiedades del paginador
  currentPage = 1;
  itemsPerPage = 10; // Número de items por página
  totalItems = 0;
  totalPages = 0;
  currentBlock = 1; // Bloque actual de páginas (cada bloque tiene 10 páginas)
  pagesPerBlock = 10; // Número de páginas visibles por bloque
  
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
          this.updatePagination(); // Actualizar paginación con los nuevos datos
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
  

  
  // ========== MÉTODOS DE PAGINACIÓN ==========
  
  /**
   * Actualiza los cálculos de paginación basados en los datos actuales
   */
  updatePagination(): void {
    this.totalItems = this.flujos.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    
    // Asegurar que la página actual esté dentro del rango válido
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    }
    if (this.currentPage < 1) {
      this.currentPage = 1;
    }
    
    // Actualizar el bloque actual basado en la página actual
    this.currentBlock = Math.ceil(this.currentPage / this.pagesPerBlock);
  }
  
  /**
   * Obtiene los elementos a mostrar en la página currentPage
   */
  get paginatedFlujos(): FlujoCaja[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.flujos.slice(startIndex, endIndex);
  }
  
  /**
   * Obtiene el rango de páginas a mostrar en el bloque actual
   */
  get pageRange(): number[] {
    if (this.totalPages === 0) return [];
    
    const start = ((this.currentBlock - 1) * this.pagesPerBlock) + 1;
    const end = Math.min(start + this.pagesPerBlock - 1, this.totalPages);
    
    const pages: number[] = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }
  
  /**
   * Navega a una página específica
   */
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.currentBlock = Math.ceil(page / this.pagesPerBlock);
    }
  }
  
  /**
   * Navega a la página anterior
   */
  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }
  
  /**
   * Navega a la página siguiente
   */
  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }
  
  /**
   * Navega al bloque anterior de páginas
   */
  goToPreviousBlock(): void {
    if (this.currentBlock > 1) {
      const newPage = ((this.currentBlock - 2) * this.pagesPerBlock) + 1;
      this.goToPage(newPage);
    }
  }
  
  /**
   * Navega al bloque siguiente de páginas
   */
  goToNextBlock(): void {
    const maxBlock = Math.ceil(this.totalPages / this.pagesPerBlock);
    if (this.currentBlock < maxBlock) {
      const newPage = (this.currentBlock * this.pagesPerBlock) + 1;
      this.goToPage(Math.min(newPage, this.totalPages));
    }
  }
  
  /**
   * Verifica si hay un bloque anterior disponible
   */
  get hasPreviousBlock(): boolean {
    return this.currentBlock > 1;
  }
  
  /**
   * Verifica si hay un bloque siguiente disponible
   */
  get hasNextBlock(): boolean {
    const maxBlock = Math.ceil(this.totalPages / this.pagesPerBlock);
    return this.currentBlock < maxBlock;
  }
  
  /**
   * Obtiene información de paginación para mostrar al usuario
   */
  get paginationInfo(): string {
    if (this.totalItems === 0) return 'No hay elementos';
    
    const startItem = ((this.currentPage - 1) * this.itemsPerPage) + 1;
    const endItem = Math.min(startItem + this.itemsPerPage - 1, this.totalItems);
    
    return `Mostrando ${startItem} - ${endItem} de ${this.totalItems} elementos`;
  }
}

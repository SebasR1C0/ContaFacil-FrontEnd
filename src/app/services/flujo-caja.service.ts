import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environments';
import { FlujoCaja } from '../models/flujo-caja';

const base_url = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class FlujoCajaService {
  private url = `${base_url}/flujo`;

  constructor(private http: HttpClient) { }

  /**
   * Obtiene todos los flujos de caja
   * @returns Observable<FlujoCaja[]>
   */
  getAllFlujos(): Observable<FlujoCaja[]> {
    return this.http.get<FlujoCaja[]>(this.url)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Obtiene un flujo específico por ID
   * @param id - ID del flujo de caja
   * @returns Observable<FlujoCaja>
   */
  getFlujoById(id: number): Observable<FlujoCaja> {
    return this.http.get<FlujoCaja>(`${this.url}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Obtiene flujos de caja por ID de bono
   * @param bonoId - ID del bono
   * @returns Observable<FlujoCaja[]>
   */
  getFlujosByBonoId(bonoId: number): Observable<FlujoCaja[]> {
    // Probar el endpoint más común primero
    return this.http.get<FlujoCaja[]>(`${this.url}/bono/${bonoId}`)
      .pipe(
        catchError((error) => {
          console.warn(`Endpoint ${this.url}/bono/${bonoId} falló (${error.status}), probando alternativo...`);
          
          // Si falla, probar con el endpoint alternativo
          return this.http.get<FlujoCaja[]>(`${base_url}/bono/${bonoId}/flujos`)
            .pipe(
              catchError((error2) => {
                console.warn(`Endpoint ${base_url}/bono/${bonoId}/flujos falló (${error2.status}), probando otro...`);
                
                // Probar con flujocaja
                return this.http.get<FlujoCaja[]>(`${base_url}/flujocaja/bono/${bonoId}`)
                  .pipe(
                    catchError((error3) => {
                      console.warn(`Endpoint ${base_url}/flujocaja/bono/${bonoId} falló (${error3.status}), probando último...`);
                      
                      // Último intento con la ruta original
                      return this.http.get<FlujoCaja[]>(`${this.url}/cajaxbono/${bonoId}`)
                        .pipe(
                          catchError((finalError) => {
                            console.error('Todos los endpoints fallaron:', finalError);
                            return this.handleError(finalError);
                          })
                        );
                    })
                  );
              })
            );
        })
      );
  }

  /**
   * Obtiene flujos paginados (si el backend lo soporta)
   * @param page - Número de página
   * @param size - Tamaño de página
   * @returns Observable<FlujoCaja[]>
   */
  getFlujosPaginated(page: number = 0, size: number = 10): Observable<FlujoCaja[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<FlujoCaja[]>(this.url, { params })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Prueba diferentes endpoints para encontrar el correcto
   * @param bonoId - ID del bono para probar
   * @returns Observable con los resultados de las pruebas
   */
  testEndpoints(bonoId: number): Observable<any> {
    const endpoints = [
      `${this.url}/bono/${bonoId}`,
      `${this.url}/cajaxbono/${bonoId}`,
      `${this.url}/${bonoId}`,
      `${base_url}/flujocaja/bono/${bonoId}`,
      `${base_url}/bono/${bonoId}/flujos`,
      `${base_url}/flujo/bono/${bonoId}`,
      `${base_url}/flujocaja/${bonoId}`
    ];

    console.log('🔍 Probando endpoints:', endpoints);
    
    // Simplemente devolver los endpoints para probar manualmente
    return new Observable(observer => {
      observer.next({ endpoints, message: 'Endpoints disponibles para prueba' });
      observer.complete();
    });
  }

  /**
   * Prueba la conexión con el backend
   * @returns Observable<any>
   */
  testConnection(): Observable<any> {
    // Para pruebas de conexión, usar URL directa
    const directUrl = `${environment.baseUrl}/flujo`;
    return this.http.get(directUrl)
      .pipe(
        map(response => ({ success: true, data: response })),
        catchError(error => {
          console.error('Error de conexión:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Maneja errores de HTTP
   * @param error - Error de HTTP
   * @returns Observable<never>
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Error desconocido';
    
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      switch (error.status) {
        case 0:
          errorMessage = 'No se puede conectar al servidor. Verifica que el backend esté ejecutándose en el puerto 8081.';
          break;
        case 404:
          errorMessage = 'Recurso no encontrado.';
          break;
        case 500:
          errorMessage = 'Error interno del servidor.';
          break;
        default:
          errorMessage = `Error ${error.status}: ${error.message}`;
      }
    }

    console.error('Error en FlujoCajaService:', errorMessage);
    return throwError(() => errorMessage);
  }
}

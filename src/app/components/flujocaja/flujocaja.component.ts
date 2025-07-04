import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FlujoCajaListComponent } from '../flujo-caja-list/flujo-caja-list.component';

@Component({
  selector: 'app-flujocaja',
  imports: [FlujoCajaListComponent],
  templateUrl: './flujocaja.component.html',
  styleUrl: './flujocaja.component.css'
})
export class FlujocajaComponent implements OnInit {
  bonoId: number | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Obtener el parámetro idBono de la ruta
    this.route.params.subscribe(params => {
      if (params['idBono']) {
        this.bonoId = +params['idBono']; // Convertir a número
      }
    });
  }
}

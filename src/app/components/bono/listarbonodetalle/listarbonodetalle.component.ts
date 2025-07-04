import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Bono } from '../../../models/bono';
import { BonoService } from '../../../services/bono.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-listarbonodetalle',
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './listarbonodetalle.component.html',
  styleUrl: './listarbonodetalle.component.css'
})
export class ListarbonodetalleComponent implements OnInit {
  bono: Bono | null = null;
  idBono: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bonoService: BonoService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.idBono = +params['idBono'];
      this.cargarBono();
    });
  }

  cargarBono(): void {
    this.bonoService.list().subscribe(bonos => {
      this.bono = bonos.find(b => b.idBono === this.idBono) || null;
    });
  }

  volver(): void {
    this.router.navigate(['/bonos']);
  }
}

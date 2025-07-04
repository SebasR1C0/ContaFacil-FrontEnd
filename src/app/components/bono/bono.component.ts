import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { ListarbonoComponent } from "./listarbono/listarbono.component";
import { Router } from 'express'; 

@Component({
  selector: 'app-bono',
  imports: [ListarbonoComponent,RouterOutlet],
  templateUrl: './bono.component.html',
  styleUrl: './bono.component.css'
})
export class BonoComponent {
  constructor( public route:ActivatedRoute) {}
}

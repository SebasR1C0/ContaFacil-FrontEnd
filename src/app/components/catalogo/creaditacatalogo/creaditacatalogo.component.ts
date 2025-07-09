import { Component, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CatalogoMoneda } from '../../../models/catalogomoneda';
import { CatalogomonedaService } from '../../../services/catalogomoneda.service';

@Component({
  selector: 'app-creaditacatalogo',
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    RouterModule
  ],
  templateUrl: './creaditacatalogo.component.html',
  styleUrl: './creaditacatalogo.component.css'
})
export class CreaditacatalogoComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  id: number = 0;
  edicion: boolean = false;
  catalogoMoneda: CatalogoMoneda = new CatalogoMoneda();

  constructor(
    private cS: CatalogomonedaService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  // Validador para números positivos
  positiveNumberValidator = (control: any) => {
    const value = parseFloat(control.value);
    if (control.value !== null && control.value !== '' && (!isNaN(value) && value <= 0)) {
      return { 'negativeNumber': true };
    }
    return null;
  }

  ngOnInit(): void {
    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.init();
    });

    this.form = this.formBuilder.group({
      hcodigo: [''],
      hmoneda: ['', Validators.required],
      htipoCambio: ['', [Validators.required, this.positiveNumberValidator]]
    });
  }

  aceptar(): void {
    if (this.form.valid) {
      const formValues = this.form.getRawValue();
      
      const catalogoMoneda: CatalogoMoneda = {
        idCatalogoMoneda: formValues.hcodigo,
        moneda: formValues.hmoneda,
        tipoCambio: +formValues.htipoCambio
      };

      if (this.edicion) {
        this.cS.update(catalogoMoneda).subscribe(() => {
          this.cS.list().subscribe(data => {
            this.cS.setlist(data);
          });
          this.snackBar.open('Moneda editada exitosamente', 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          });
          this.router.navigate(['catalogo-monedas']);
        });
      } else {
        this.cS.insert(catalogoMoneda).subscribe(() => {
          this.cS.list().subscribe(data => {
            this.cS.setlist(data);
          });
          this.snackBar.open('Moneda registrada exitosamente', 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          });
          this.router.navigate(['catalogo-monedas']);
        });
      }
    }
  }

  init() {
    if (this.edicion) {
      this.cS.listId(this.id).subscribe((data) => {
        this.catalogoMoneda = data;
        
        this.form = new FormGroup({
          hcodigo: new FormControl(data.idCatalogoMoneda, Validators.required),
          hmoneda: new FormControl(data.moneda, Validators.required),
          htipoCambio: new FormControl(data.tipoCambio, [Validators.required, this.positiveNumberValidator])
        });
      });
    }
  }
}

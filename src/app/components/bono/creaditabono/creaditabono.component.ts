import { Component, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { Bono } from '../../../models/bono';
import { BonoService } from '../../../services/bono.service';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { CatalogoMoneda } from '../../../models/catalogomoneda';
import { User } from '../../../models/users';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { CatalogomonedaService } from '../../../services/catalogomoneda.service';
import { UsersService } from '../../../services/users.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-creaditabono',
  providers: [provideNativeDateAdapter()],
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatSnackBarModule,
    RouterModule
  ],
  templateUrl: './creaditabono.component.html',
  styleUrl: './creaditabono.component.css',
})
export class CreaditabonoComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  id:number=0;
  edicion: boolean = false;
  bono: Bono = new Bono();
  cupones: { value: string; viewValue: string }[] = [
    { value: 'Mensual', viewValue: 'Mensual' },
    { value: 'Bimestral', viewValue: 'Bimestral' },
    { value: 'Trimestral', viewValue: 'Trimestral' },
    { value: 'Cuatrimestral', viewValue: 'Cuatrimestral' },
    { value: 'Semestral', viewValue: 'Semestral' },
    { value: 'Anual', viewValue: 'Anual' },
  ];
  diasPorAno: { value: number; viewValue: string }[] = [
    { value: 360, viewValue: '360 días' },
    { value: 365, viewValue: '365 días' },
  ];

  tiposTasa: { value: string; viewValue: string }[] = [
    { value: 'Nominal', viewValue: 'Nominal' },
    { value: 'Efectiva', viewValue: 'Efectiva' },
  ];

  capitalizaciones: { value: string; viewValue: string }[] = [
    { value: 'Diaria', viewValue: 'Diaria' },
    { value: 'Quincenal', viewValue: 'Quincenal' },
    { value: 'Mensual', viewValue: 'Mensual' },
    { value: 'Bimestral', viewValue: 'Bimestral' },
    { value: 'Trimestral', viewValue: 'Trimestral' },
    { value: 'Cuatrimestral', viewValue: 'Cuatrimestral' },
    { value: 'Semestral', viewValue: 'Semestral' },
    { value: 'Anual', viewValue: 'Anual' },
  ];

  tiposGracia: { value: string; viewValue: string }[] = [
    { value: 'Sin gracia', viewValue: 'Sin gracia' },
    { value: 'Corto', viewValue: 'Corto' },
    { value: 'Parcial', viewValue: 'Parcial' },
    { value: 'Total', viewValue: 'Total' },
  ];

  listaMonedas: CatalogoMoneda[] = [];
  usuario: User[] = [];

  // Propiedades para placeholders dinámicos
  placeholderNombre: string = '';
  placeholderValorNominal: string = '';
  placeholderNumeroAnios: string = '';
  placeholderTasaInteres: string = '';
  placeholderTasaDescuento: string = '';
  placeholderImpuesto: string = '';
  placeholderInflacion: string = '';
  placeholderPrima: string = '';
  placeholderPeriodosGracia: string = '';
  placeholderCostosBonista: string = '';
  placeholderCostosOtros: string = '';

  constructor(
    private bS: BonoService,
    private cS: CatalogomonedaService,
    private uS: UsersService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}
  // ...existing code...
  ngOnInit(): void {
     this.route.params.subscribe((data:Params)=>{
      this.id = data['id'];
      this.edicion = data['id']!=null;
      this.init()
    })
    this.form = this.formBuilder.group({
      hcodigo: [''],
      hnombre: ['', Validators.required],
      hvalorNominal: ['', Validators.required],
      hnumeroAnios: ['', Validators.required],
      hcupon: ['', Validators.required],
      hdiasPorAno: ['', Validators.required],
      htipoTasa: ['', Validators.required],
      hcapitalizacion: ['', Validators.required],
      htasaInteres: ['', Validators.required],
      htasaDescuento: ['', Validators.required],
      himpuesto: ['', Validators.required],
      //hfechaEmision: ['', Validators.required],
      hinflacion: ['', Validators.required],
      htipoGracia: ['', Validators.required],
      hperiodosGracia: ['', Validators.required],
      hcostosBonista: ['', Validators.required],
      hcostosOtros: ['', Validators.required],
      hprima: ['', Validators.required],
      hmoneda: ['', Validators.required],
      // huser: ['', Validators.required],
    });
    this.cS.list().subscribe((data) => {
      this.listaMonedas = data;
    });
    this.uS.list().subscribe((data) => {
      this.usuario = data;
    });
  }
  aceptar(): void {
  if (this.form.valid) {
    const usuarioId = 1; // <-- Cambia este valor según el usuario que desees asignar
    this.uS.listId(usuarioId).subscribe(userData => {
      const hoy = new Date();
      hoy.setHours(hoy.getHours() - (hoy.getTimezoneOffset() / 60) - 5);
      const fechaEmision = hoy.toISOString().split('T')[0];
      const bono: any = {
        idBono: this.form.value.hcodigo,
        nombreBono: this.form.value.hnombre,
        valorNominal: +this.form.value.hvalorNominal,
        numeroAños: +this.form.value.hnumeroAnios,
        frecuenciaCupon: this.form.value.hcupon,
        diasPorAno: +this.form.value.hdiasPorAno,
        tipoTasa: this.form.value.htipoTasa,
        capitalizacion: this.form.value.hcapitalizacion,
        tasaInteres: +this.form.value.htasaInteres,
        tasaAnualDescuento: +this.form.value.htasaDescuento,
        impuesto: +this.form.value.himpuesto,
        fechaEmision: fechaEmision,
        inflacion: +this.form.value.hinflacion,
        plazoTipo: this.form.value.htipoGracia,
        plazoPeridos: +this.form.value.hperiodosGracia,
        prima: +this.form.value.hprima,
        costesInicialesBonista: +this.form.value.hcostosBonista,
        costesInicialesOtros: +this.form.value.hcostosOtros,
        idCatalogoMoneda: { idCatalogoMoneda: +this.form.value.hmoneda },
        idUsers: { idUser: userData.idUser } // <-- Asigna el usuario automáticamente
      };

      if (this.edicion) {
        this.bS.update(bono).subscribe(() => {
          this.bS.list().subscribe(data => {
            this.bS.setlist(data);
          });
          this.snackBar.open('Edición exitosa', 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          });
          this.router.navigate(['bonos']);
        });
      } else {
        this.bS.insert(bono).subscribe(() => {
          this.bS.list().subscribe(data => {
            this.bS.setlist(data);
          });
          this.snackBar.open('Registro exitoso', 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          });
          this.router.navigate(['bonos']);
        });
      }
    });
  }
}
  init(){
    if (this.edicion) {
      this.bS.listId(this.id).subscribe((data) => {
        this.form = new FormGroup({
          hcodigo: new FormControl(data.idBono, Validators.required),
          hnombre: new FormControl(data.nombreBono, Validators.required),
          hvalorNominal: new FormControl(data.valorNominal, Validators.required),
          hnumeroAnios: new FormControl(data.numeroAños, Validators.required),
          hcupon: new FormControl(data.frecuenciaCupon, Validators.required),
          hdiasPorAno: new FormControl(data.diasPorAno, Validators.required),
          htipoTasa: new FormControl(data.tipoTasa, Validators.required),
          hcapitalizacion: new FormControl(data.capitalizacion, Validators.required),
          htasaInteres: new FormControl(data.tasaInteres, Validators.required),
          htasaDescuento: new FormControl(data.tasaAnualDescuento, Validators.required),
          himpuesto: new FormControl(data.impuesto, Validators.required),
          //hfechaEmision: new FormControl(data.fechaEmision, Validators.required),
          hinflacion: new FormControl(data.inflacion, Validators.required),
          htipoGracia: new FormControl(data.plazoTipo, Validators.required),
          hperiodosGracia: new FormControl(data.plazoPeridos, Validators.required),
          hcostosBonista: new FormControl(data.costesInicialesBonista, Validators.required),
          hcostosOtros: new FormControl(data.costesInicialesOtros, Validators.required),
          hprima: new FormControl(data.prima, Validators.required),
          hmoneda: new FormControl(data.idCatalogoMoneda.idCatalogoMoneda, Validators.required),
          // huser: new FormControl(data.idUsers.idUser, Validators.required),
        });
      });
    }
  }
}

import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
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
import { isPlatformBrowser } from '@angular/common';

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
    { value: 'N/A', viewValue: 'N/A' },
  ];

  // Opciones de capitalización filtradas que se mostrarán en el select
  capitalizacionesFiltradas: { value: string; viewValue: string }[] = [];

  tiposGracia: { value: string; viewValue: string }[] = [
    { value: 'Sin gracia', viewValue: 'Sin gracia' },
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
    private snackBar: MatSnackBar,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  // Validadores personalizados como arrow functions para mantener el contexto
  positiveNumberValidator = (control: any) => {
    const value = parseFloat(control.value);
    if (control.value !== null && control.value !== '' && (!isNaN(value) && value <= 0)) {
      return { 'negativeNumber': true };
    }
    return null;
  }

  // Validador para números positivos (incluyendo cero)
  nonNegativeNumberValidator = (control: any) => {
    const value = parseFloat(control.value);
    if (control.value !== null && control.value !== '' && (!isNaN(value) && value < 0)) {
      return { 'negativeNumber': true };
    }
    return null;
  }

  // Validador para porcentajes (0-1 en formato decimal)
  percentageValidator = (control: any) => {
    const value = parseFloat(control.value);
    if (control.value !== null && control.value !== '' && (!isNaN(value) && (value < 0 || value > 1))) {
      return { 'invalidPercentage': true };
    }
    return null;
  }

  // Método para debug - verificar errores del formulario
  checkFormErrors() {
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      if (control && control.errors) {
        console.log(`Campo ${key} tiene errores:`, control.errors);
      }
    });
  }

  // Método para manejar el cambio del tipo de gracia
  onTipoGraciaChange(tipoGracia: string) {
    const periodosGraciaControl = this.form.get('hperiodosGracia');
    
    if (tipoGracia === 'Sin gracia') {
      // Si es "Sin gracia", establecer valor en 0 y deshabilitar el campo
      periodosGraciaControl?.setValue(0);
      periodosGraciaControl?.disable();
    } else {
      // Si no es "Sin gracia", habilitar el campo y limpiar el valor
      periodosGraciaControl?.enable();
      if (periodosGraciaControl?.value === 0) {
        periodosGraciaControl?.setValue('');
      }
    }
  }

  // Método para manejar el cambio del tipo de tasa de interés
  onTipoTasaChange(tipoTasa: string) {
    const capitalizacionControl = this.form.get('hcapitalizacion');
    
    if (tipoTasa === 'Efectiva') {
      // Si es "Efectiva", establecer valor en "N/A" y deshabilitar el campo
      capitalizacionControl?.setValue('N/A');
      capitalizacionControl?.disable();
      // Filtrar opciones para mostrar solo "N/A"
      this.capitalizacionesFiltradas = this.capitalizaciones.filter(cap => cap.value === 'N/A');
    } else {
      // Si no es "Efectiva", habilitar el campo y mostrar todas las opciones excepto "N/A"
      capitalizacionControl?.enable();
      this.capitalizacionesFiltradas = this.capitalizaciones.filter(cap => cap.value !== 'N/A');
      // Limpiar el valor si era "N/A"
      if (capitalizacionControl?.value === 'N/A') {
        capitalizacionControl?.setValue('');
      }
    }
  }
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
      hvalorNominal: ['', [Validators.required, this.positiveNumberValidator]],
      hnumeroAnios: ['', [Validators.required, this.positiveNumberValidator]],
      hcupon: ['', Validators.required],
      hdiasPorAno: ['', Validators.required],
      htipoTasa: ['', Validators.required],
      hcapitalizacion: ['', Validators.required],
      htasaInteres: ['', [Validators.required, this.percentageValidator]],
      htasaDescuento: ['', [Validators.required, this.percentageValidator]],
      himpuesto: ['', [Validators.required, this.percentageValidator]],
      //hfechaEmision: ['', Validators.required],
      hinflacion: ['', [Validators.required, this.percentageValidator]],
      htipoGracia: ['', Validators.required],
      hperiodosGracia: ['', [Validators.required, this.nonNegativeNumberValidator]],
      hcostosBonista: ['', [Validators.required, this.percentageValidator]],
      hcostosOtros: ['', [Validators.required, this.percentageValidator]],
      hprima: ['', [Validators.required, this.percentageValidator]],
      hmoneda: ['', Validators.required],
      // huser: ['', Validators.required],
    });

    // Inicializar las opciones de capitalización (sin "N/A" por defecto)
    this.capitalizacionesFiltradas = this.capitalizaciones.filter(cap => cap.value !== 'N/A');

    // Suscribirse a los cambios del tipo de gracia
    this.form.get('htipoGracia')?.valueChanges.subscribe(value => {
      this.onTipoGraciaChange(value);
    });

    // Suscribirse a los cambios del tipo de tasa
    this.form.get('htipoTasa')?.valueChanges.subscribe(value => {
      this.onTipoTasaChange(value);
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
    // Obtener el usuario logueado desde localStorage
    let usuarioId: number | null = null;
    
    if (isPlatformBrowser(this.platformId)) {
      const userStr = localStorage.getItem('currentUser'); // Cambiar 'user' por 'currentUser'
      console.log('User string from localStorage:', userStr);
      
      if (userStr) {
        try {
          const userObj = JSON.parse(userStr);
          console.log('Parsed user object:', userObj);
          
          // El ID se guarda como 'id' en el login
          usuarioId = userObj.id || userObj.idUser || userObj.idUsuario || null;
          console.log('Usuario ID encontrado:', usuarioId);
        } catch (e) {
          console.error('Error al parsear usuario desde localStorage:', e);
          usuarioId = null;
        }
      } else {
        console.log('No se encontró información de usuario en localStorage');
      }
    }
    
    if (!usuarioId) {
      this.snackBar.open('No se pudo identificar el usuario logueado. Por favor, inicie sesión nuevamente.', 'Cerrar', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      });
      return;
    }

    this.uS.listId(usuarioId).subscribe(userData => {
      // Obtener valores del formulario, incluyendo campos deshabilitados
      const formValues = this.form.getRawValue();
      
      // Solo calcular la fecha de emisión si es un bono nuevo (no edición)
      let fechaEmision: string;
      if (this.edicion) {
        // Si es edición, mantener la fecha original del bono
        fechaEmision = this.bono.fechaEmision;
      } else {
        // Si es creación, usar la fecha actual
        const hoy = new Date();
        hoy.setHours(hoy.getHours() - (hoy.getTimezoneOffset() / 60) - 5);
        fechaEmision = hoy.toISOString().split('T')[0];
      }
      
      const bono: any = {
        idBono: formValues.hcodigo,
        nombreBono: formValues.hnombre,
        valorNominal: +formValues.hvalorNominal,
        numeroAños: +formValues.hnumeroAnios,
        frecuenciaCupon: formValues.hcupon,
        diasPorAno: +formValues.hdiasPorAno,
        tipoTasa: formValues.htipoTasa,
        capitalizacion: formValues.hcapitalizacion,
        tasaInteres: +formValues.htasaInteres,
        tasaAnualDescuento: +formValues.htasaDescuento,
        impuesto: +formValues.himpuesto,
        fechaEmision: fechaEmision,
        inflacion: +formValues.hinflacion,
        plazoTipo: formValues.htipoGracia,
        plazoPeridos: +formValues.hperiodosGracia,
        prima: +formValues.hprima,
        costesInicialesBonista: +formValues.hcostosBonista,
        costesInicialesOtros: +formValues.hcostosOtros,
        emitido: false, // <-- Establecer automáticamente como falso al registrar
        idCatalogoMoneda: { idCatalogoMoneda: +formValues.hmoneda },
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
        // Guardar los datos del bono para uso posterior (especialmente la fecha)
        this.bono = data;
        
        this.form = new FormGroup({
          hcodigo: new FormControl(data.idBono, Validators.required),
          hnombre: new FormControl(data.nombreBono, Validators.required),
          hvalorNominal: new FormControl(data.valorNominal, [Validators.required, this.positiveNumberValidator]),
          hnumeroAnios: new FormControl(data.numeroAños, [Validators.required, this.positiveNumberValidator]),
          hcupon: new FormControl(data.frecuenciaCupon, Validators.required),
          hdiasPorAno: new FormControl(data.diasPorAno, Validators.required),
          htipoTasa: new FormControl(data.tipoTasa, Validators.required),
          hcapitalizacion: new FormControl(data.capitalizacion, Validators.required),
          htasaInteres: new FormControl(data.tasaInteres, [Validators.required, this.percentageValidator]),
          htasaDescuento: new FormControl(data.tasaAnualDescuento, [Validators.required, this.percentageValidator]),
          himpuesto: new FormControl(data.impuesto, [Validators.required, this.percentageValidator]),
          //hfechaEmision: new FormControl(data.fechaEmision, Validators.required),
          hinflacion: new FormControl(data.inflacion, [Validators.required, this.nonNegativeNumberValidator]),
          htipoGracia: new FormControl(data.plazoTipo, Validators.required),
          hperiodosGracia: new FormControl(data.plazoPeridos, [Validators.required, this.nonNegativeNumberValidator]),
          hcostosBonista: new FormControl(data.costesInicialesBonista, [Validators.required, this.percentageValidator]),
          hcostosOtros: new FormControl(data.costesInicialesOtros, [Validators.required, this.nonNegativeNumberValidator]),
          hprima: new FormControl(data.prima, [Validators.required, this.percentageValidator]),
          hmoneda: new FormControl(data.idCatalogoMoneda.idCatalogoMoneda, Validators.required),
          // huser: new FormControl(data.idUsers.idUser, Validators.required),
        });

        // Suscribirse a los cambios del tipo de gracia después de la inicialización
        this.form.get('htipoGracia')?.valueChanges.subscribe(value => {
          this.onTipoGraciaChange(value);
        });

        // Suscribirse a los cambios del tipo de tasa después de la inicialización
        this.form.get('htipoTasa')?.valueChanges.subscribe(value => {
          this.onTipoTasaChange(value);
        });

        // Aplicar la lógica inicial del tipo de tasa
        this.onTipoTasaChange(data.tipoTasa);
        
        // Aplicar la lógica inicial del tipo de gracia
        this.onTipoGraciaChange(data.plazoTipo);
      });
    }
  }
}

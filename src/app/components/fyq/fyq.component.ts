import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { RouterModule } from '@angular/router';

interface FAQ {
  question: string;
  answer: string;
  expanded?: boolean;
}

@Component({
  selector: 'app-fyq',
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatExpansionModule, RouterModule],
  templateUrl: './fyq.component.html',
  styleUrl: './fyq.component.css'
})
export class FyqComponent {
  faqs: FAQ[] = [
    {
      question: '¿Qué es ContaFácil y qué función cumple?',
      answer: 'ContaFácil es una aplicación web diseñada para ayudar en la proyección financiera y análisis de bonos corporativos, utilizando el método de amortización francés. Permite calcular tasas de interés efectivas, simular flujos de caja y evaluar la viabilidad financiera de los bonos, facilitando la toma de decisiones tanto para emisores como para inversionistas.',
      expanded: false
    },
    {
      question: '¿Qué tipo de bonos puedo registrar en ContaFácil?',
      answer: 'Puedes registrar bonos corporativos, los cuales pueden tener diferentes características como valor nominal, tasa de interés, tipo de gracia, plazos y frecuencia de pago. La aplicación también permite simular escenarios con diferentes tipos de tasas, como la tasa fija o variable.',
      expanded: false
    },
    {
      question: '¿Puedo simular un bono con un periodo de gracia en ContaFácil?',
      answer: 'Sí, ContaFácil permite simular bonos con periodos de gracia, tanto parciales como totales. Durante estos periodos, los pagos de capital o intereses pueden diferirse según la configuración que elijas al registrar el bono.',
      expanded: false
    },
    {
      question: '¿Puedo crear diferentes tipos de bonos dentro de la plataforma?',
      answer: 'Sí, puedes crear bonos con diferentes características, como tipo de tasa de interés (nominal, efectiva), frecuencia de pagos (mensual, trimestral, anual, etc) y configuración de gracia (total o parcial). También puedes ajustar parámetros como el valor nominal, los plazos y los gastos asociados a la emisión o la compra de los bonos.',
      expanded: false
    },
    {
      question: '¿Cómo puedo ver los resultados financieros de un bono registrado?',
      answer: 'Una vez que registres un bono, puedes acceder a los resultados financieros a través de la opción "Resultados Financieros". Allí, podrás visualizar indicadores clave como la TCEA, TREA, duración, duración modificada, convexidad, precio máximo de mercado y otros cálculos financieros que te ayudarán a analizar la viabilidad de la inversión o la emisión del bono.',
      expanded: false
    },
    {
      question: '¿ContaFácil calcula el flujo de caja para cada bono registrado?',
      answer: 'Sí, ContaFácil genera automáticamente un flujo de caja detallado para cada bono registrado. Este flujo incluye información sobre el pago de intereses, la amortización del capital y el saldo pendiente después de cada pago, todo calculado bajo el método de amortización francés.',
      expanded: false
    }
  ];

  toggleFAQ(index: number): void {
    this.faqs[index].expanded = !this.faqs[index].expanded;
  }
}

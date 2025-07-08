import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface KnowledgeBase {
  [key: string]: {
    keywords: string[];
    response: string;
    category: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private knowledgeBase: KnowledgeBase = {
    // Información general sobre ContaFácil
    'contafacil_general': {
      keywords: ['contafacil', 'aplicación', 'sistema', 'plataforma', 'qué es'],
      response: 'ContaFácil es una aplicación web desarrollada para la proyección financiera y análisis de bonos corporativos utilizando el método de amortización francés. Permite calcular tasas de interés efectivas, simular flujos de caja y evaluar la viabilidad financiera de bonos, facilitando la toma de decisiones tanto para emisores como para inversionistas.',
      category: 'general'
    },
    
    // Bonos corporativos
    'bonos_definicion': {
      keywords: ['bono', 'bonos', 'corporativo', 'corporativos', 'qué son bonos'],
      response: 'Los bonos corporativos son instrumentos de deuda emitidos por empresas para obtener financiamiento. En ContaFácil puedes registrar bonos con diferentes características: valor nominal, tasa de interés, tipo de gracia, plazos y frecuencia de pago. La aplicación permite simular escenarios con tasas fijas o variables.',
      category: 'bonos'
    },
    
    'bonos_tipos': {
      keywords: ['tipos de bonos', 'características', 'configuración'],
      response: 'En ContaFácil puedes crear bonos con las siguientes características:\n• Tipo de tasa: nominal o efectiva\n• Frecuencia de pagos: mensual, trimestral, semestral, anual\n• Períodos de gracia: total o parcial\n• Valor nominal personalizable\n• Plazos flexibles\n• Gastos asociados a emisión o compra',
      category: 'bonos'
    },
    
    // Cálculos financieros
    'tcea': {
      keywords: ['tcea', 'tasa costo efectivo anual', 'emisor'],
      response: 'La TCEA (Tasa de Costo Efectivo Anual) representa el costo real para el emisor del bono. ContaFácil calcula automáticamente la TCEA considerando:\n• Valor nominal del bono\n• Tasa de interés nominal\n• Gastos de emisión\n• Frecuencia de pagos\n• Períodos de gracia\n\nTambién calcula la TCEA Emisor Escudo considerando beneficios tributarios.',
      category: 'calculos'
    },
    
    'trea': {
      keywords: ['trea', 'tasa rendimiento efectivo anual', 'bonista', 'inversionista'],
      response: 'La TREA (Tasa de Rendimiento Efectivo Anual) es la rentabilidad que obtiene el inversionista (bonista). ContaFácil calcula la TREA considerando:\n• Precio de compra del bono\n• Cupones recibidos\n• Valor de rescate\n• Gastos de adquisición\n• Frecuencia de pagos\n\nEsta tasa ayuda a evaluar la atractiva de la inversión.',
      category: 'calculos'
    },
    
    'flujo_caja': {
      keywords: ['flujo de caja', 'flujos', 'amortización', 'pagos'],
      response: 'ContaFácil genera automáticamente el flujo de caja detallado para cada bono usando el método de amortización francés. El flujo incluye:\n• Pago de intereses por período\n• Amortización del capital\n• Saldo pendiente después de cada pago\n• Valor presente de cada flujo\n• Cronograma completo de pagos',
      category: 'calculos'
    },
    
    'duracion': {
      keywords: ['duración', 'duration', 'duración modificada', 'convexidad'],
      response: 'ContaFácil calcula métricas de sensibilidad del bono:\n\n• **Duración**: Mide la sensibilidad del precio del bono ante cambios en las tasas de interés\n• **Duración Modificada**: Versión ajustada que indica el cambio porcentual en el precio por cada 1% de cambio en la tasa\n• **Convexidad**: Mide la curvatura de la relación precio-rendimiento, complementando la duración para mayor precisión',
      category: 'calculos'
    },
    
    // Períodos de gracia
    'gracia': {
      keywords: ['gracia', 'período de gracia', 'gracia total', 'gracia parcial'],
      response: 'ContaFácil permite simular bonos con períodos de gracia:\n\n• **Gracia Total**: No se pagan intereses ni capital durante el período\n• **Gracia Parcial**: Solo se pagan intereses, el capital se difiere\n\nDurante estos períodos, los pagos se postergan según la configuración elegida al registrar el bono.',
      category: 'bonos'
    },
    
    // Funcionalidades de la aplicación
    'crear_bono': {
      keywords: ['crear bono', 'registrar bono', 'nuevo bono', 'agregar bono'],
      response: 'Para crear un bono en ContaFácil:\n\n1. Ve a "Crear Bono" en el menú principal\n2. Completa la información básica:\n   • Valor nominal\n   • Tasa de interés\n   • Plazo\n   • Frecuencia de pagos\n3. Configura períodos de gracia (opcional)\n4. Selecciona la moneda\n5. Establece gastos asociados\n6. Guarda y visualiza los resultados automáticamente',
      category: 'uso'
    },
    
    'resultados': {
      keywords: ['resultados', 'ver resultados', 'indicadores', 'métricas'],
      response: 'En la sección "Resultados Financieros" puedes visualizar:\n• TCEA (Tasa de Costo Efectivo Anual)\n• TREA (Tasa de Rendimiento Efectivo Anual)\n• Duración y Duración Modificada\n• Convexidad\n• Precio Actual y Precio Máximo de Mercado\n• Total y Utilidad\n\nTodos estos indicadores se calculan automáticamente al crear o modificar un bono.',
      category: 'uso'
    },
    
    'monedas': {
      keywords: ['moneda', 'monedas', 'divisa', 'catálogo'],
      response: 'ContaFácil incluye un catálogo de monedas donde puedes:\n• Ver las monedas disponibles\n• Seleccionar la moneda para tus bonos\n• Gestionar diferentes divisas\n\nAccede desde el botón "Monedas" en el menú principal.',
      category: 'uso'
    },
    
    // Método de amortización
    'amortizacion_frances': {
      keywords: ['amortización francés', 'método francés', 'sistema francés'],
      response: 'El método de amortización francés utilizado en ContaFácil se caracteriza por:\n• Cuotas constantes durante toda la vida del bono\n• Los intereses disminuyen progresivamente\n• El capital amortizado aumenta progresivamente\n• Facilita la planificación financiera tanto para emisor como inversionista\n\nEste método es ideal para bonos corporativos por su predictibilidad.',
      category: 'calculos'
    },
    
    // Precio y valuación
    'precio_bono': {
      keywords: ['precio', 'valuación', 'valor presente', 'precio máximo'],
      response: 'ContaFácil calcula:\n\n• **Precio Actual**: Valor presente de todos los flujos futuros del bono\n• **Precio Máximo de Mercado**: Precio teórico considerando condiciones de mercado\n• **Valor Nominal**: Valor de referencia del bono\n\nEstos precios ayudan a determinar si el bono está sobrevalorado o subvalorado.',
      category: 'calculos'
    },
    
    // Soporte y ayuda
    'ayuda': {
      keywords: ['ayuda', 'soporte', 'manual', 'faq'],
      response: 'Para obtener ayuda en ContaFácil:\n\n• **Manual de Usuario**: Guía completa paso a paso\n• **FAQ**: Preguntas frecuentes y respuestas\n• **Soporte Email**: soporte@contafacil.com\n• **Soporte Telefónico**: (+51) 962014951\n• **Horario**: Lunes a Viernes, 9:00 AM - 6:00 PM\n\n¡También puedes preguntarme directamente!',
      category: 'soporte'
    }
  };

  constructor(private http: HttpClient) {}

  async getResponse(userInput: string): Promise<string> {
    const normalizedInput = userInput.toLowerCase();
    
    // Buscar en la base de conocimientos local
    const localResponse = this.findLocalResponse(normalizedInput);
    if (localResponse) {
      return localResponse;
    }

    // Si no encuentra respuesta local, usar IA (simulado por ahora)
    return this.generateIntelligentResponse(userInput);
  }

  private findLocalResponse(input: string): string | null {
    for (const [key, knowledge] of Object.entries(this.knowledgeBase)) {
      for (const keyword of knowledge.keywords) {
        if (input.includes(keyword.toLowerCase())) {
          return knowledge.response;
        }
      }
    }
    return null;
  }

  private generateIntelligentResponse(input: string): string {
    // Respuestas inteligentes basadas en patrones
    const greetings = ['hola', 'buenos días', 'buenas tardes', 'buenas noches', 'saludos'];
    const thanks = ['gracias', 'muchas gracias', 'perfecto', 'excelente'];
    
    if (greetings.some(greeting => input.toLowerCase().includes(greeting))) {
      return '¡Hola! 👋 Soy JH, tu asistente virtual de ContaFácil. Estoy aquí para ayudarte con cualquier pregunta sobre bonos corporativos, cálculos financieros o el uso de la aplicación. ¿En qué puedo asistirte?';
    }
    
    if (thanks.some(thank => input.toLowerCase().includes(thank))) {
      return '¡De nada! 😊 Me alegra poder ayudarte. Si tienes más preguntas sobre ContaFácil o finanzas, estaré aquí para asistirte.';
    }

    if (input.toLowerCase().includes('cómo') || input.toLowerCase().includes('como')) {
      return 'Para ayudarte mejor, ¿podrías ser más específico sobre qué proceso te interesa? Por ejemplo:\n• ¿Cómo crear un bono?\n• ¿Cómo calcular la TCEA?\n• ¿Cómo interpretar los resultados?\n• ¿Cómo usar una función específica?';
    }

    // Respuesta por defecto
    return `No tengo información específica sobre "${input}" en mi base de conocimientos actual. 

Sin embargo, puedo ayudarte con:
• Información sobre bonos corporativos
• Cálculos financieros (TCEA, TREA, flujos de caja)
• Uso de las funcionalidades de ContaFácil
• Conceptos de finanzas e ingeniería económica

Para soporte más detallado, contacta a:
📧 soporte@contafacil.com
📞 (+51) 962014951

¿Hay algo más específico en lo que pueda ayudarte?`;
  }
}

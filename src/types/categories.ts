
export interface ActionCategory {
  code: string;
  name: string;
  subcategories: ActionSubcategory[];
}

export interface ActionSubcategory {
  code: string;
  name: string;
}

export interface ActionType {
  code: string;
  name: string;
  categories: ActionCategory[];
}

export const ACTION_TYPES: ActionType[] = [
  {
    code: 'calidad-total',
    name: 'Calidad Total',
    categories: [
      {
        code: '1',
        name: 'Sistema de Gestión de Calidad. ISO 9001',
        subcategories: [
          { code: '1.1', name: 'Requisitos de la documentación' },
          { code: '1.2', name: 'Política de Calidad' },
          { code: '1.3', name: 'Planificación' },
          { code: '1.4', name: 'Responsabilidad, autorización y comunicación' },
          { code: '1.5', name: 'Revisión por la Dirección' },
          { code: '1.6', name: 'Provisión de recursos' },
          { code: '1.7', name: 'Recursos humanos' },
          { code: '1.8', name: 'Infraestructura' },
          { code: '1.9', name: 'Ambiente de trabajo' },
          { code: '1.10', name: 'Planificación de la realización del producto' },
          { code: '1.11', name: 'Procesos relacionados con el cliente' },
          { code: '1.12', name: 'Diseño y desarrollo' },
          { code: '1.13', name: 'Compras' },
          { code: '1.14', name: 'Producción y prestación del servicio' },
          { code: '1.15', name: 'Control de los dispositivos de seguimiento y medición' },
          { code: '1.16', name: 'Seguimiento y medición' },
          { code: '1.17', name: 'Control del producto no conforme' },
          { code: '1.18', name: 'Análisis de datos' },
          { code: '1.19', name: 'Mejora' }
        ]
      },
      {
        code: '2',
        name: 'Modelo EFQM',
        subcategories: [
          { code: '2.1', name: 'Liderazgo' },
          { code: '2.2', name: 'Personas' },
          { code: '2.3', name: 'Política y estrategia' },
          { code: '2.4', name: 'Alianzas y recursos' },
          { code: '2.5', name: 'Procesos' },
          { code: '2.6', name: 'Resultados en las personas' },
          { code: '2.7', name: 'Resultados en los clientes' },
          { code: '2.8', name: 'Resultados en la sociedad' },
          { code: '2.9', name: 'Resultados clave' }
        ]
      },
      {
        code: '3',
        name: 'Madrid Excelente',
        subcategories: [
          { code: '3.1', name: 'Orientación hacia resultados' },
          { code: '3.2', name: 'Orientación al cliente' },
          { code: '3.3', name: 'Liderazgo y coherencia' },
          { code: '3.4', name: 'Gestión por procesos y hechos' },
          { code: '3.5', name: 'Desarrollo e implicación de las personas' },
          { code: '3.6', name: 'Proceso continuo de aprendizaje, innovación y mejora' },
          { code: '3.7', name: 'Desarrollo de alianzas' },
          { code: '3.8', name: 'Responsabilidad social de la organización' },
          { code: '3.9', name: 'Dimensión económica,/ buen gobierno / ética' },
          { code: '3.10', name: 'Dimensión medioambiental' },
          { code: '3.11', name: 'Dimensión social' },
          { code: '3.12', name: 'Preventa' },
          { code: '3.13', name: 'Venta del producto / prestación del servicio' },
          { code: '3.14', name: 'Garantía y soporte' }
        ]
      }
    ]
  },
  {
    code: 'medioambiental-hospitales',
    name: 'Medioambiental Hospitales',
    categories: [
      { code: '1', name: 'Política Ambiental', subcategories: [] },
      { code: '2', name: 'Aspectos Ambientales', subcategories: [] },
      {
        code: '3',
        name: 'Requisitos Legales y otros requisitos - Evaluación del cumplimi',
        subcategories: [
          { code: '3.1', name: 'Evaluación ambiental y autorización de actividades' },
          { code: '3.2', name: 'Residuos' },
          { code: '3.3', name: 'Vertidos' },
          { code: '3.4', name: 'Emisiones atmosféricas - Legionella' },
          { code: '3.5', name: 'Radiaciones ionizantes' },
          { code: '3.6', name: 'Otros (CT, dep. gasóleo, ruido..)' }
        ]
      },
      { code: '4', name: 'Objetivos, metas y programas', subcategories: [] },
      { code: '5', name: 'Recursos, funciones, responsabilidad y autoridad - Competencia', subcategories: [] },
      { code: '6', name: 'Comunicación', subcategories: [] },
      { code: '7', name: 'Documentación - Control de la documentación', subcategories: [] },
      { code: '8', name: 'Control operacional', subcategories: [] },
      { code: '9', name: 'Preparación y respuesta antes emergencias', subcategories: [] },
      { code: '10', name: 'Seguimiento y medición', subcategories: [] },
      { code: '11', name: 'No conformidad, acción correctiva', subcategories: [] },
      { code: '12', name: 'Control de los registros', subcategories: [] },
      { code: '13', name: 'Auditoría interna', subcategories: [] },
      { code: '14', name: 'Revisión por la dirección', subcategories: [] }
    ]
  },
  {
    code: 'sistemas-informacion',
    name: 'Sistemas de Información',
    categories: [
      {
        code: '1',
        name: 'AUDITORÍAS SEGURIDAD DE LA INFORMACIÓN',
        subcategories: [
          { code: '1.1', name: 'Deficiencias seguridad física (acceso no autorizado)' },
          { code: '1.2', name: 'Deficiencias seguridad física (infraestructura)' },
          { code: '1.3', name: 'Deficiencias confidencialidad (ubicación, permisos acces' },
          { code: '1.4', name: 'Deficiencias acceso a datos (software no corporativo, oc' },
          { code: '1.5', name: 'Deficiencias uso del correo electrónico e Internet' },
          { code: '1.6', name: 'Deficiencias equipamiento informático (inventario)' },
          { code: '1.7', name: 'Incoherencia usuarios (PSO/Listín)' },
          { code: '1.8', name: 'Deficiencias conocimiento/cumplimiento normativa de segu' }
        ]
      },
      {
        code: '2',
        name: 'LEY DE PROTECCIÓN DE DATOS',
        subcategories: [
          { code: '2.1', name: 'Acción mejora cumplimiento LOPD' },
          { code: '2.2', name: 'Acción correctora desviación Auditoría LOPD' }
        ]
      },
      {
        code: '3',
        name: 'INCIDENCIAS',
        subcategories: [
          { code: '3.1', name: 'Incidencias' }
        ]
      }
    ]
  }
];

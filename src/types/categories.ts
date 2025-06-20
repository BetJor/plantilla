
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
  shortName: string;
  description: string;
  categories: ActionCategory[];
  allowedRoles: string[];
  specificCentres?: string[];
}

export const ACTION_TYPES: ActionType[] = [
  {
    code: 'acm-ot',
    name: 'Accions Correctivas Medioambientals - Organització Territorial (ACM-OT)',
    shortName: 'ACM-OT',
    description: 'Per a la organització territorial, poden ser creades per la Direcció de Qualitat',
    allowedRoles: ['direccio-qualitat'],
    categories: [
      { code: '1', name: 'Política Ambiental', subcategories: [] },
      { code: '2', name: 'Aspectes Ambientals', subcategories: [] },
      {
        code: '3',
        name: 'Requisits Legals i altres requisits - Avaluació del compliment',
        subcategories: [
          { code: '3.1', name: 'Avaluació ambiental i autorització d\'activitats' },
          { code: '3.2', name: 'Residus' },
          { code: '3.3', name: 'Abocaments' },
          { code: '3.4', name: 'Emissions atmosfèriques - Legionella' },
          { code: '3.5', name: 'Radiacions ionitzants' },
          { code: '3.6', name: 'Altres (CT, dep. gasóleo, soroll...)' }
        ]
      },
      { code: '4', name: 'Objectius, metes i programes', subcategories: [] },
      { code: '5', name: 'Recursos, funcions, responsabilitat i autoritat - Competència', subcategories: [] },
      { code: '6', name: 'Comunicació', subcategories: [] },
      { code: '7', name: 'Documentació - Control de la documentació', subcategories: [] },
      { code: '8', name: 'Control operacional', subcategories: [] },
      { code: '9', name: 'Preparació i resposta abans emergències', subcategories: [] },
      { code: '10', name: 'Seguiment i mesurament', subcategories: [] },
      { code: '11', name: 'No conformitat, acció correctiva', subcategories: [] },
      { code: '12', name: 'Control dels registres', subcategories: [] },
      { code: '13', name: 'Auditoria interna', subcategories: [] },
      { code: '14', name: 'Revisió per la direcció', subcategories: [] }
    ]
  },
  {
    code: 'acm-h',
    name: 'Accions Correctivas Medioambientals - Hospitals (ACM-H)',
    shortName: 'ACM-H',
    description: 'Per als hospitals, poden crear-les els membres del Comitè Ambiental i la Direcció de Qualitat',
    allowedRoles: ['comite-ambiental', 'direccio-qualitat'],
    categories: [
      { code: '1', name: 'Política Ambiental', subcategories: [] },
      { code: '2', name: 'Aspectes Ambientals', subcategories: [] },
      {
        code: '3',
        name: 'Requisits Legals i altres requisits - Avaluació del compliment',
        subcategories: [
          { code: '3.1', name: 'Avaluació ambiental i autorització d\'activitats' },
          { code: '3.2', name: 'Residus' },
          { code: '3.3', name: 'Abocaments' },
          { code: '3.4', name: 'Emissions atmosfèriques - Legionella' },
          { code: '3.5', name: 'Radiacions ionitzants' },
          { code: '3.6', name: 'Altres (CT, dep. gasóleo, soroll...)' }
        ]
      },
      { code: '4', name: 'Objectius, metes i programes', subcategories: [] },
      { code: '5', name: 'Recursos, funcions, responsabilitat i autoritat - Competència', subcategories: [] },
      { code: '6', name: 'Comunicació', subcategories: [] },
      { code: '7', name: 'Documentació - Control de la documentació', subcategories: [] },
      { code: '8', name: 'Control operacional', subcategories: [] },
      { code: '9', name: 'Preparació i resposta abans emergències', subcategories: [] },
      { code: '10', name: 'Seguiment i mesurament', subcategories: [] },
      { code: '11', name: 'No conformitat, acció correctiva', subcategories: [] },
      { code: '12', name: 'Control dels registres', subcategories: [] },
      { code: '13', name: 'Auditoria interna', subcategories: [] },
      { code: '14', name: 'Revisió per la direcció', subcategories: [] }
    ]
  },
  {
    code: 'acm-isl',
    name: 'Accions Correctivas Medioambientals - Asepeyo Cartuja (ACM-ISL)',
    shortName: 'ACM-ISL',
    description: 'Per a Asepeyo Cartuja, només centre 4104 Sevilla-Cartuja',
    allowedRoles: ['direccio-qualitat', 'comite-ambiental'],
    specificCentres: ['4104 Sevilla-Cartuja'],
    categories: [
      { code: '1', name: 'Política Ambiental', subcategories: [] },
      { code: '2', name: 'Aspectes Ambientals', subcategories: [] },
      {
        code: '3',
        name: 'Requisits Legals i altres requisits - Avaluació del compliment',
        subcategories: [
          { code: '3.1', name: 'Avaluació ambiental i autorització d\'activitats' },
          { code: '3.2', name: 'Residus' },
          { code: '3.3', name: 'Abocaments' },
          { code: '3.4', name: 'Emissions atmosfèriques - Legionella' },
          { code: '3.5', name: 'Radiacions ionitzants' },
          { code: '3.6', name: 'Altres (CT, dep. gasóleo, soroll...)' }
        ]
      },
      { code: '4', name: 'Objectius, metes i programes', subcategories: [] },
      { code: '5', name: 'Recursos, funcions, responsabilitat i autoritat - Competència', subcategories: [] },
      { code: '6', name: 'Comunicació', subcategories: [] },
      { code: '7', name: 'Documentació - Control de la documentació', subcategories: [] },
      { code: '8', name: 'Control operacional', subcategories: [] },
      { code: '9', name: 'Preparació i resposta abans emergències', subcategories: [] },
      { code: '10', name: 'Seguiment i mesurament', subcategories: [] },
      { code: '11', name: 'No conformitat, acció correctiva', subcategories: [] },
      { code: '12', name: 'Control dels registres', subcategories: [] },
      { code: '13', name: 'Auditoria interna', subcategories: [] },
      { code: '14', name: 'Revisió per la direcció', subcategories: [] }
    ]
  },
  {
    code: 'amsgp',
    name: 'Accions Correctivas del Sistema de Gestió de la Prevenció (AMSGP)',
    shortName: 'AMSGP',
    description: 'Derivades dels informes del Sistema de Gestió de la Prevenció',
    allowedRoles: ['director-centre', 'director-area'],
    categories: [
      { code: '1', name: 'Auditories internes', subcategories: [] },
      { code: '2', name: 'Auditories externes', subcategories: [] },
      { code: '3', name: 'Incidències del sistema', subcategories: [] },
      { code: '4', name: 'Verificacions del sistema', subcategories: [] },
      { code: '5', name: 'No conformitats identificades', subcategories: [] }
    ]
  },
  {
    code: 'sau',
    name: 'Accions de Millora SAU',
    shortName: 'SAU',
    description: 'Iniciades per la Direcció de Relacions Externes (DRE)',
    allowedRoles: ['direccio-relacions-externes'],
    categories: [
      {
        code: '1',
        name: 'Segons origen d\'usuari',
        subcategories: [
          { code: '1.1', name: 'Usuari intern' },
          { code: '1.2', name: 'Usuari extern' }
        ]
      },
      { code: '2', name: 'Incidències detectades', subcategories: [] },
      { code: '3', name: 'Millores proposades', subcategories: [] }
    ]
  },
  {
    code: 'ac-qualitat-total',
    name: 'Accions Correctivas Qualitat Total (AC)',
    shortName: 'AC',
    description: 'Poden crear-les la Direcció de Qualitat i, al Hospital de Coslada, també els membres del Comitè de Qualitat',
    allowedRoles: ['direccio-qualitat', 'comite-qualitat', 'director-funcional', 'subdirector-general', 'sau-coordinador'],
    categories: [
      {
        code: '1',
        name: 'Sistema de Gestió de Qualitat. ISO 9001',
        subcategories: [
          { code: '1.1', name: 'Requisits de la documentació' },
          { code: '1.2', name: 'Política de Qualitat' },
          { code: '1.3', name: 'Planificació' },
          { code: '1.4', name: 'Responsabilitat, autorització i comunicació' },
          { code: '1.5', name: 'Revisió per la Direcció' },
          { code: '1.6', name: 'Provisió de recursos' },
          { code: '1.7', name: 'Recursos humans' },
          { code: '1.8', name: 'Infraestructura' },
          { code: '1.9', name: 'Ambient de treball' },
          { code: '1.10', name: 'Planificació de la realització del producte' },
          { code: '1.11', name: 'Processos relacionats amb el client' },
          { code: '1.12', name: 'Disseny i desenvolupament' },
          { code: '1.13', name: 'Compres' },
          { code: '1.14', name: 'Producció i prestació del servei' },
          { code: '1.15', name: 'Control dels dispositius de seguiment i mesurament' },
          { code: '1.16', name: 'Seguiment i mesurament' },
          { code: '1.17', name: 'Control del producte no conforme' },
          { code: '1.18', name: 'Anàlisi de dades' },
          { code: '1.19', name: 'Millora' }
        ]
      },
      {
        code: '2',
        name: 'Model EFQM',
        subcategories: [
          { code: '2.1', name: 'Lideratge' },
          { code: '2.2', name: 'Persones' },
          { code: '2.3', name: 'Política i estratègia' },
          { code: '2.4', name: 'Aliances i recursos' },
          { code: '2.5', name: 'Processos' },
          { code: '2.6', name: 'Resultats en les persones' },
          { code: '2.7', name: 'Resultats en els clients' },
          { code: '2.8', name: 'Resultats en la societat' },
          { code: '2.9', name: 'Resultats clau' }
        ]
      },
      {
        code: '3',
        name: 'Madrid Excel·lent',
        subcategories: [
          { code: '3.1', name: 'Orientació cap a resultats' },
          { code: '3.2', name: 'Orientació al client' },
          { code: '3.3', name: 'Lideratge i coherència' },
          { code: '3.4', name: 'Gestió per processos i fets' },
          { code: '3.5', name: 'Desenvolupament i implicació de les persones' },
          { code: '3.6', name: 'Procés continu d\'aprenentatge, innovació i millora' },
          { code: '3.7', name: 'Desenvolupament d\'aliances' },
          { code: '3.8', name: 'Responsabilitat social de l\'organització' },
          { code: '3.9', name: 'Dimensió econòmica / bon govern / ètica' },
          { code: '3.10', name: 'Dimensió medioambiental' },
          { code: '3.11', name: 'Dimensió social' },
          { code: '3.12', name: 'Preventa' },
          { code: '3.13', name: 'Venda del producte / prestació del servei' },
          { code: '3.14', name: 'Garantia i suport' }
        ]
      }
    ]
  },
  {
    code: 'acsgsi',
    name: 'Accions Correctivas de Sistema Gestió de Seguretat de la Informació (ACSGSI)',
    shortName: 'ACSGSI',
    description: 'Accions referents a Sistemes d\'Informació (post 2014)',
    allowedRoles: ['director-centre', 'director-area', 'director-sistemes-informacio'],
    categories: [
      {
        code: '1',
        name: 'Auditories Seguretat de la Informació',
        subcategories: [
          { code: '1.1', name: 'Deficiències seguretat física (accés no autoritzat)' },
          { code: '1.2', name: 'Deficiències seguretat física (infraestructura)' },
          { code: '1.3', name: 'Deficiències confidencialitat (ubicació, permisos accés)' },
          { code: '1.4', name: 'Deficiències accés a dades (software no corporatiu)' },
          { code: '1.5', name: 'Deficiències ús del correu electrònic i Internet' },
          { code: '1.6', name: 'Deficiències equipament informàtic (inventari)' },
          { code: '1.7', name: 'Incoherència usuaris (PSO/Llistí)' },
          { code: '1.8', name: 'Deficiències coneixement/compliment normativa de seguretat' }
        ]
      },
      {
        code: '2',
        name: 'Llei de Protecció de Dades',
        subcategories: [
          { code: '2.1', name: 'Acció millora compliment LOPD' },
          { code: '2.2', name: 'Acció correctora desviació Auditoria LOPD' }
        ]
      },
      {
        code: '3',
        name: 'Incidències',
        subcategories: [
          { code: '3.1', name: 'Incidències' }
        ]
      }
    ]
  },
  {
    code: 'acpsi',
    name: 'Accions Correctivas de Sistemes d\'Informació (ACPSI)',
    shortName: 'ACPSI',
    description: 'Accions referents a Sistemes d\'Informació (pre 2014)',
    allowedRoles: ['director-centre', 'director-area', 'director-sistemes-informacio'],
    categories: [
      {
        code: '1',
        name: 'Auditories Sistemes d\'Informació Anteriors a 2014',
        subcategories: [
          { code: '1.1', name: 'No conformitats detectades en auditories' },
          { code: '1.2', name: 'Incidències de sistemes' },
          { code: '1.3', name: 'Deficiències operacionals' }
        ]
      }
    ]
  },
  {
    code: 'acrsc',
    name: 'Accions Correctivas de Responsabilitat Social Corporativa (ACRSC)',
    shortName: 'ACRSC',
    description: 'Derivades d\'auditories de Responsabilitat Social Corporativa',
    allowedRoles: ['director-centre', 'director-area', 'responsable-qualitat'],
    categories: [
      { code: '1', name: 'Auditories internes RSC', subcategories: [] },
      { code: '2', name: 'Revisió de sistema RSC', subcategories: [] },
      { code: '3', name: 'No conformitats RSC', subcategories: [] },
      { code: '4', name: 'Millores de responsabilitat social', subcategories: [] }
    ]
  }
];

// Definició dels rols del sistema
export const USER_ROLES = {
  'direccio-qualitat': 'Direcció de Qualitat',
  'comite-ambiental': 'Membre del Comitè Ambiental',
  'director-centre': 'Director de Centre',
  'director-area': 'Director d\'Àrea/Autonòmic',
  'direccio-relacions-externes': 'Direcció de Relacions Externes',
  'comite-qualitat': 'Membre del Comitè de Qualitat',
  'director-funcional': 'Director Funcional',
  'subdirector-general': 'Subdirector General',
  'sau-coordinador': 'SAU (Coordinador)',
  'director-sistemes-informacio': 'Director de Sistemes d\'Informació',
  'responsable-qualitat': 'Responsable de Qualitat',
  'gerente-hospital': 'Gerent Hospital',
  'coordinador-rrhh-hospital': 'Coordinador RRHH Hospital',
  'director-enfermeria-hospital': 'Director Infermeria Hospital',
  'responsable-gestion-medioambiental': 'Responsable Gestió Medioambiental Hospital',
  'responsable-seguridad-higiene': 'Responsable GM Direcció Seguretat i Higiene',
  'responsable-servicios-generales': 'Responsable GM Serveis Generals Hospital',
  'responsable-laboratorio': 'Responsable GM Laboratori Hospital',
  'responsable-radiologia': 'Responsable GM Radiologia Hospital',
  'responsable-farmacia': 'Responsable GM Farmàcia Hospital',
  'responsable-mantenimiento': 'Responsable GM Manteniment Hospital'
} as const;

// Definició dels origens d'accions
export const ACTION_ORIGINS = {
  'auditoria': 'Auditoria',
  'seguimiento-indicadores': 'Seguiment d\'indicadors/objectius',
  'revision-sistema': 'Revisió del sistema',
  'incidencias': 'Incidències',
  'otros': 'Altres',
  'usuario-interno': 'Usuari intern',
  'usuario-externo': 'Usuari extern'
} as const;

// Centres específics
export const SPECIFIC_CENTRES = {
  'hospital-coslada': 'Hospital de Coslada',
  'sevilla-cartuja': '4104 Sevilla-Cartuja'
} as const;

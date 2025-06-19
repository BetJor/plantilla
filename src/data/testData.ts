
import { CorrectiveAction } from '@/types';

export const TEST_ACTIONS: CorrectiveAction[] = [
  // Grup 1: Accions d'higiene quirúrgica (similitud alta entre elles)
  {
    id: 'test-001',
    title: 'Incompliment protocol higiene quirúrgica en neurocirurgia',
    description: 'Durant una intervenció de neurocirurgia s\'ha detectat que un membre de l\'equip quirúrgic no ha seguit correctament el protocol d\'higiene de mans. El cirurgià ha observat que l\'instrumentista no va realitzar el rentat quirúrgic segons els temps establerts.',
    type: 'incident',
    category: 'higiene',
    subCategory: 'Protocol quirúrgic',
    status: 'Cerrado',
    priority: 'alta',
    dueDate: '2024-01-15',
    assignedTo: 'Dr. Martín González',
    centre: 'Hospital Central',
    department: 'Quiròfan',
    createdAt: '2024-01-01',
    createdBy: 'supervisor.quirofan',
    attachments: []
  },
  {
    id: 'test-002',
    title: 'Deficiència en higiene quirúrgica en traumatologia',
    description: 'S\'ha observat en una operació de traumatologia que el personal auxiliar no va seguir el protocol establert per la desinfecció d\'instruments. Es va detectar residus de sang en instrumental que hauria d\'estar estèril.',
    type: 'incident',
    category: 'higiene',
    subCategory: 'Protocol quirúrgic',
    status: 'Pendiente de Cierre',
    priority: 'crítica',
    dueDate: '2024-02-01',
    assignedTo: 'Dra. Carmen López',
    centre: 'Hospital Central',
    department: 'Quiròfan',
    createdAt: '2024-01-10',
    createdBy: 'supervisor.quirofan',
    attachments: []
  },
  {
    id: 'test-003',
    title: 'Protocol higiene inadequat en cirurgia cardiovascular',
    description: 'Durant una operació de bypass coronari, s\'ha detectat que un resident no va complir amb el temps mínim de fregat quirúrgic. L\'incident va ser observat per l\'adjunt responsable.',
    type: 'incident',
    category: 'higiene',
    subCategory: 'Protocol quirúrgic',
    status: 'Pendiente de Análisis',
    priority: 'alta',
    dueDate: '2024-02-10',
    assignedTo: 'Dr. Roberto Silva',
    centre: 'Hospital Central',
    department: 'Quiròfan',
    createdAt: '2024-01-20',
    createdBy: 'supervisor.quirofan',
    attachments: []
  },

  // Grup 2: Incidents informàtics (similitud mitjana)
  {
    id: 'test-004',
    title: 'Fallada sistema informàtic urgències',
    description: 'El sistema de gestió hospitalària ha patit una caiguda durant 2 hores, afectant el registre de pacients a urgències. Els professionals han hagut de treballar amb registres en paper.',
    type: 'incident',
    category: 'tecnologia',
    subCategory: 'Sistema informàtic',
    status: 'Cerrado',
    priority: 'crítica',
    dueDate: '2024-01-25',
    assignedTo: 'Joan Pérez',
    centre: 'Hospital Central',
    department: 'Urgències',
    createdAt: '2024-01-05',
    createdBy: 'responsable.urgencies',
    attachments: []
  },
  {
    id: 'test-005',
    title: 'Error sistema farmàcia hospitalària',
    description: 'El sistema de dispensació automàtica de medicaments ha mostrat errors en la identificació de fàrmacs, causant retards en l\'administració de tractaments.',
    type: 'incident',
    category: 'tecnologia',
    subCategory: 'Sistema informàtic',
    status: 'Pendiente de Comprobación',
    priority: 'alta',
    dueDate: '2024-02-05',
    assignedTo: 'Anna García',
    centre: 'Hospital Nord',
    department: 'Farmàcia',
    createdAt: '2024-01-12',
    createdBy: 'farmaceutic.responsable',
    attachments: []
  },

  // Grup 3: Problemes de formació (patrons recurrents)
  {
    id: 'test-006',
    title: 'Manca formació personal nou en protocols COVID',
    description: 'S\'ha detectat que el personal de nova incorporació no ha rebut formació adequada sobre els protocols de protecció COVID-19, posant en risc la seguretat del personal i pacients.',
    type: 'preventiva',
    category: 'formacio',
    subCategory: 'Protocol seguretat',
    status: 'Pendiente de Análisis',
    priority: 'alta',
    dueDate: '2024-02-15',
    assignedTo: 'Marta Fernández',
    centre: 'Hospital Central',
    department: 'Recursos Humans',
    createdAt: '2024-01-25',
    createdBy: 'rrhh.supervisor',
    attachments: []
  },
  {
    id: 'test-007',
    title: 'Deficiència formació nous residents en emergències',
    description: 'Els residents de primer any mostren mancances en la gestió de situacions d\'emergència, especialment en la priorització de pacients i protocols de reanimació.',
    type: 'preventiva',
    category: 'formacio',
    subCategory: 'Formació clínica',
    status: 'Pendiente de Análisis',
    priority: 'mitjana',
    dueDate: '2024-03-01',
    assignedTo: 'Dr. Luis Moreno',
    centre: 'Hospital Nord',
    department: 'Urgències',
    createdAt: '2024-02-01',
    createdBy: 'cap.urgencies',
    attachments: []
  },

  // Grup 4: Incidents de medicació (similitud variable)
  {
    id: 'test-008',
    title: 'Error dispensació medicació pediàtria',
    description: 'S\'ha produït un error en la dosificació d\'un antibiòtic pediàtric. La farmàcia va dispensar una concentració adulta per a un pacient de 5 anys. Error detectat per la infermera abans de l\'administració.',
    type: 'incident',
    category: 'medicacio',
    subCategory: 'Error dispensació',
    status: 'Cerrado',
    priority: 'crítica',
    dueDate: '2024-01-30',
    assignedTo: 'Dra. Elena Ruiz',
    centre: 'Hospital Pediàtric',
    department: 'Pediatria',
    createdAt: '2024-01-08',
    createdBy: 'infermera.pediatria',
    attachments: []
  },
  {
    id: 'test-009',
    title: 'Confusió medicaments amb noms similars',
    description: 'Un metge va prescriure Losartan però la farmàcia va dispensar Lorazepam degut a la similitud dels noms. L\'error va ser detectat per la infermera durant la doble verificació.',
    type: 'incident',
    category: 'medicacio',
    subCategory: 'Error dispensació',
    status: 'Pendiente de Cierre',
    priority: 'alta',
    dueDate: '2024-02-20',
    assignedTo: 'Farmacèutic Responsable',
    centre: 'Hospital Central',
    department: 'Farmàcia',
    createdAt: '2024-02-05',
    createdBy: 'infermera.planta',
    attachments: []
  },

  // Grup 5: Accions completament diferents (similitud baixa)
  {
    id: 'test-010',
    title: 'Millora climatització sala espera',
    description: 'Els pacients i familiars es queixen de la temperatura excessiva a la sala d\'espera de consultes externes durant l\'estiu. Cal revisar el sistema de climatització.',
    type: 'millora',
    category: 'infraestructura',
    subCategory: 'Climatització',
    status: 'Pendiente de Análisis',
    priority: 'baixa',
    dueDate: '2024-03-15',
    assignedTo: 'Manteniment',
    centre: 'Hospital Central',
    department: 'Consultes Externes',
    createdAt: '2024-02-10',
    createdBy: 'supervisor.consultes',
    attachments: []
  },
  {
    id: 'test-011',
    title: 'Renovació equipament rehabilitació',
    description: 'L\'equipament de fisioteràpia està obsolet i necessita renovació per oferir millors tractaments als pacients. Cal avaluar les necessitats i pressupost.',
    type: 'millora',
    category: 'equipament',
    subCategory: 'Renovació',
    status: 'Borrador',
    priority: 'mitjana',
    dueDate: '2024-04-01',
    assignedTo: 'Cap Rehabilitació',
    centre: 'Hospital Nord',
    department: 'Rehabilitació',
    createdAt: '2024-02-15',
    createdBy: 'cap.rehabilitacio',
    attachments: []
  },

  // Casos específics per testing edge cases
  {
    id: 'test-012',
    title: 'Títol curt',
    description: 'Descripció mínima.',
    type: 'incident',
    category: 'altres',
    subCategory: 'Altres',
    status: 'Borrador',
    priority: 'baixa',
    dueDate: '2024-03-01',
    assignedTo: 'Test User',
    centre: 'Centre Test',
    department: 'Test Dept',
    createdAt: '2024-02-20',
    createdBy: 'test.user',
    attachments: []
  }
];

// Casos de prova predefinits amb resultats esperats
export const TEST_CASES = [
  {
    id: 'case-001',
    name: 'Similitud alta - Higiene quirúrgica',
    testAction: {
      title: 'Incompliment protocol rentat quirúrgic',
      description: 'S\'ha observat que personal quirúrgic no segueix correctament el protocol de rentat de mans quirúrgic abans d\'una intervenció.',
      type: 'incident',
      category: 'higiene',
      centre: 'Hospital Central',
      department: 'Quiròfan'
    },
    expectedResults: {
      minSimilarActions: 2,
      expectedHighSimilarity: ['test-001', 'test-002', 'test-003'],
      minSimilarityScore: 80
    }
  },
  {
    id: 'case-002',
    name: 'Similitud mitjana - Problemes tecnològics',
    testAction: {
      title: 'Fallada sistema gestió pacients',
      description: 'El sistema informàtic de gestió de pacients ha tingut interrupcions que afecten el flux de treball normal.',
      type: 'incident',
      category: 'tecnologia',
      centre: 'Hospital Central',
      department: 'Informàtica'
    },
    expectedResults: {
      minSimilarActions: 1,
      expectedHighSimilarity: ['test-004', 'test-005'],
      minSimilarityScore: 50
    }
  },
  {
    id: 'case-003',
    name: 'Similitud baixa - Acció completament diferent',
    testAction: {
      title: 'Implement nou sistema de reserves',
      description: 'Desenvolupar un nou sistema digital per gestionar les reserves de cites mèdiques dels pacients.',
      type: 'millora',
      category: 'tecnologia',
      centre: 'Hospital Virtual',
      department: 'Desenvolupament'
    },
    expectedResults: {
      minSimilarActions: 0,
      expectedHighSimilarity: [],
      minSimilarityScore: 20
    }
  }
];

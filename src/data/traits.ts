// src/data/traits.ts

import { BehaviorType, ITrait } from '../types/character';

export const AVAILABLE_TRAITS: ITrait[] = [
  {
    id: 'workaholic',
    name: 'Workaholic',
    description: 'Adicto al trabajo. Trabaja más horas pero se agota más rápido.',
    behaviorType: BehaviorType.DISCIPLINED,
    effects: {
      maxEnergy: 20,
      energyDecayRate: 15, // Se cansa más rápido trabajando
      morningProductivity: 15,
      afternoonProductivity: 10,
      concentrationBonus: 10,
      comunicacion: -5 // Menos tiempo para socializar
    }
  },
  {
    id: 'perfectionist',
    name: 'Perfeccionista',
    description: 'Todo debe estar perfecto. Mayor calidad pero menor velocidad.',
    behaviorType: BehaviorType.METHODICAL,
    effects: {
      qualityBonus: 25,
      speedBonus: -20,
      testing: 10,
      arquitectura: 5,
      concentrationBonus: 15,
      creativityBonus: -10
    }
  },
  {
    id: 'morning_person',
    name: 'Madrugador',
    description: 'Más productivo en las mañanas, menos efectivo por las noches.',
    behaviorType: BehaviorType.DISCIPLINED,
    effects: {
      morningProductivity: 30,
      afternoonProductivity: 10,
      nightProductivity: -25,
      energia: 5,
      concentrationBonus: 20 // Solo en las mañanas
    }
  },
  {
    id: 'night_owl',
    name: 'Noctámbulo',
    description: 'Rinde mejor en las noches, le cuesta arrancar en las mañanas.',
    behaviorType: BehaviorType.CREATIVE,
    effects: {
      morningProductivity: -20,
      afternoonProductivity: 5,
      nightProductivity: 35,
      creativityBonus: 15,
      backend: 5 // Programar de noche
    }
  },
  {
    id: 'charismatic',
    name: 'Carismático',
    description: 'Excelente comunicador. Facilita negociaciones y trabajo en equipo.',
    behaviorType: BehaviorType.SOCIAL,
    effects: {
      comunicacion: 25,
      negociacion: 20,
      marketing: 15,
      teamMoraleEffect: 20,
      gestion: 10
    }
  },
  {
    id: 'introvert',
    name: 'Introvertido',
    description: 'Prefiere trabajar solo. Mayor concentración en soledad.',
    behaviorType: BehaviorType.FOCUSED,
    effects: {
      concentrationBonus: 25, // Cuando está solo
      backend: 10,
      sistemas: 8,
      arquitectura: 5,
      comunicacion: -15,
      teamMoraleEffect: -10
    }
  },
  {
    id: 'creative',
    name: 'Creativo',
    description: 'Mente innovadora pero a veces dispersa.',
    behaviorType: BehaviorType.CREATIVE,
    effects: {
      creativityBonus: 25,
      frontend: 15,
      arquitectura: 10,
      analisis: 8,
      concentrationBonus: -10,
      testing: -5 // Le aburren las tareas repetitivas
    }
  },
  {
    id: 'methodical',
    name: 'Metódico',
    description: 'Enfoque sistemático y ordenado. Menos errores pero menos creatividad.',
    behaviorType: BehaviorType.METHODICAL,
    effects: {
      qualityBonus: 20,
      testing: 15,
      sistemas: 10,
      gestion: 8,
      concentrationBonus: 15,
      creativityBonus: -15,
      speedBonus: -10
    }
  },
  {
    id: 'quick_learner',
    name: 'Autodidacta',
    description: 'Aprende rápidamente nuevas tecnologías y habilidades.',
    behaviorType: BehaviorType.BALANCED,
    effects: {
      aprendizaje: 20,
      analisis: 10,
      concentrationBonus: 10,
      // Bonificación especial: gana experiencia 50% más rápido
    }
  },
  {
    id: 'social',
    name: 'Social',
    description: 'Le gusta interactuar con otros. Mejora el ambiente pero se distrae fácilmente.',
    behaviorType: BehaviorType.SOCIAL,
    effects: {
      comunicacion: 20,
      teamMoraleEffect: 25,
      marketing: 10,
      negociacion: 5,
      concentrationBonus: -15, // Se distrae con conversaciones
      motivationDecayRate: -20 // Se motiva con la interacción social
    }
  },
  {
    id: 'focused',
    name: 'Enfocado',
    description: 'Excelente concentración y resistencia a distracciones.',
    behaviorType: BehaviorType.FOCUSED,
    effects: {
      concentrationBonus: 30,
      backend: 8,
      testing: 10,
      sistemas: 5,
      speedBonus: 10,
      creativityBonus: -5
    }
  },
  {
    id: 'multitasker',
    name: 'Multitarea',
    description: 'Puede manejar múltiples proyectos pero con menor calidad individual.',
    behaviorType: BehaviorType.BALANCED,
    effects: {
      gestion: 15,
      speedBonus: 15,
      energia: 5,
      qualityBonus: -15,
      concentrationBonus: -10
    }
  },
  {
    id: 'detail_oriented',
    name: 'Detallista',
    description: 'Excelente atención al detalle. Encuentra bugs que otros pasan por alto.',
    behaviorType: BehaviorType.METHODICAL,
    effects: {
      testing: 20,
      qualityBonus: 20,
      arquitectura: 5,
      speedBonus: -15,
      concentrationBonus: 10
    }
  },
  {
    id: 'innovative',
    name: 'Innovador',
    description: 'Busca soluciones originales y tecnologías nuevas.',
    behaviorType: BehaviorType.CREATIVE,
    effects: {
      creativityBonus: 20,
      aprendizaje: 15,
      arquitectura: 12,
      frontend: 8,
      testing: -8, // Le aburran las tareas rutinarias
      sistemas: -5
    }
  },
  {
    id: 'pragmatic',
    name: 'Pragmático',
    description: 'Soluciones prácticas y eficientes. Menos elegante pero más rápido.',
    behaviorType: BehaviorType.BALANCED,
    effects: {
      speedBonus: 20,
      gestion: 10,
      backend: 8,
      qualityBonus: -10,
      creativityBonus: -5,
      concentrationBonus: 5
    }
  }
];

/**
 * Obtiene un rasgo por su ID
 */
export function getTraitById(id: string): ITrait | undefined {
  return AVAILABLE_TRAITS.find(trait => trait.id === id);
}

/**
 * Obtiene rasgos por tipo de comportamiento
 */
export function getTraitsByBehavior(behaviorType: BehaviorType): ITrait[] {
  return AVAILABLE_TRAITS.filter(trait => trait.behaviorType === behaviorType);
}

/**
 * Verifica si dos rasgos son compatibles
 */
export function areTraitsCompatible(trait1Id: string, trait2Id: string): boolean {
  const incompatiblePairs = [
    ['morning_person', 'night_owl'],
    ['introvert', 'social'],
    ['perfectionist', 'pragmatic'],
    ['methodical', 'creative'],
    ['focused', 'multitasker']
  ];

  return !incompatiblePairs.some(pair => 
    (pair.includes(trait1Id) && pair.includes(trait2Id))
  );
}

/**
 * Obtiene rasgos recomendados para un estilo de juego
 */
export function getRecommendedTraits(playStyle: 'technical' | 'business' | 'balanced'): ITrait[] {
  switch (playStyle) {
    case 'technical':
      return AVAILABLE_TRAITS.filter(trait => 
        ['introvert', 'focused', 'methodical', 'detail_oriented', 'night_owl'].includes(trait.id)
      );
    case 'business':
      return AVAILABLE_TRAITS.filter(trait => 
        ['charismatic', 'social', 'pragmatic', 'multitasker', 'morning_person'].includes(trait.id)
      );
    case 'balanced':
      return AVAILABLE_TRAITS.filter(trait => 
        ['quick_learner', 'innovative', 'creative', 'workaholic'].includes(trait.id)
      );
    default:
      return [];
  }
}
// src/types/character.ts

export interface ISkill {
  name: string;
  level: number;
  experience: number;
  category: SkillCategory;
}

export interface ITrait {
  id: string;
  name: string;
  description: string;
  effects: TraitEffects;
  behaviorType: BehaviorType;
}

export interface INeeds {
  energy: number;
  hunger: number;
  thirst: number;
  bathroom: number;
  concentration: number;
  motivation: number;
}

export interface ISchedule {
  workStart: number; // minutos desde medianoche (9:00 = 540)
  workEnd: number;
  lunchStart: number;
  lunchDuration: number;
  breaks: ScheduleBreak[];
}

export interface ICharacter {
  id: string;
  name: string;
  skills: Map<string, ISkill>;
  traits: ITrait[];
  needs: INeeds;
  maxNeeds: INeeds;
  schedule: ISchedule;
  currentActivity: Activity;
  activityStartTime: number;
  behaviorType: BehaviorType;
  productivity: number;
  money: number;
  reputation: number;
  createdAt: Date;
}

// Enums y tipos auxiliares
export enum SkillCategory {
  TECHNICAL = 'technical',
  BUSINESS = 'business', 
  PERSONAL = 'personal'
}

export enum BehaviorType {
  DISCIPLINED = 'disciplined',
  CREATIVE = 'creative',
  SOCIAL = 'social',
  FOCUSED = 'focused',
  METHODICAL = 'methodical',
  BALANCED = 'balanced'
}

export enum Activity {
  WORKING = 'working',
  EATING = 'eating',
  DRINKING = 'drinking',
  BATHROOM = 'bathroom',
  RESTING = 'resting',
  BREAK = 'break',
  LUNCH = 'lunch',
  IDLE = 'idle'
}

export interface TraitEffects {
  // Modificadores de necesidades
  maxEnergy?: number;
  energyDecayRate?: number;
  hungerDecayRate?: number;
  thirstDecayRate?: number;
  
  // Modificadores de habilidades
  [skillName: string]: number | undefined;
  
  // Modificadores de productividad
  morningProductivity?: number;
  afternoonProductivity?: number;
  nightProductivity?: number;
  
  // Modificadores de comportamiento
  concentrationBonus?: number;
  creativityBonus?: number;
  qualityBonus?: number;
  speedBonus?: number;
  
  // Modificadores sociales
  teamMoraleEffect?: number;
  communicationBonus?: number;
  negotiationBonus?: number;
}

export interface ScheduleBreak {
  time: number; // minutos desde medianoche
  duration: number; // duración en minutos
  type: 'break' | 'lunch' | 'custom';
}

// Formulario de creación de personaje
export interface CharacterCreationForm {
  name: string;
  skills: { [skillName: string]: number };
  selectedTraits: ITrait[]; // Mantener ITrait para compatibilidad
  schedule: ISchedule;
}

// Constantes
export const SKILL_NAMES = {
  // Técnicas
  BACKEND: 'backend',
  FRONTEND: 'frontend',
  SISTEMAS: 'sistemas',
  REDES: 'redes',
  TESTING: 'testing',
  ARQUITECTURA: 'arquitectura',
  
  // Negocio
  ANALISIS: 'analisis',
  NEGOCIACION: 'negociacion',
  COMUNICACION: 'comunicacion',
  MARKETING: 'marketing',
  GESTION: 'gestion',
  
  // Personales
  ENERGIA: 'energia',
  CONCENTRACION: 'concentracion',
  APRENDIZAJE: 'aprendizaje'
} as const;

export const SKILL_CATEGORIES_MAP = {
  [SkillCategory.TECHNICAL]: [
    SKILL_NAMES.BACKEND,
    SKILL_NAMES.FRONTEND,
    SKILL_NAMES.SISTEMAS,
    SKILL_NAMES.REDES,
    SKILL_NAMES.TESTING,
    SKILL_NAMES.ARQUITECTURA
  ],
  [SkillCategory.BUSINESS]: [
    SKILL_NAMES.ANALISIS,
    SKILL_NAMES.NEGOCIACION,
    SKILL_NAMES.COMUNICACION,
    SKILL_NAMES.MARKETING,
    SKILL_NAMES.GESTION
  ],
  [SkillCategory.PERSONAL]: [
    SKILL_NAMES.ENERGIA,
    SKILL_NAMES.CONCENTRACION,
    SKILL_NAMES.APRENDIZAJE
  ]
};
// src/services/CharacterService.ts

import { Character } from '@core/character/Character';
import { Trait } from '@core/character/Trait';
import { AVAILABLE_TRAITS, areTraitsCompatible } from '@data/traits';
import { CharacterCreationForm, ISchedule } from '../types/character';

export class CharacterService {
  private static instance: CharacterService;

  private constructor() {}

  public static getInstance(): CharacterService {
    if (!CharacterService.instance) {
      CharacterService.instance = new CharacterService();
    }
    return CharacterService.instance;
  }

  /**
   * Valida los datos del formulario de creación
   */
  public validateCharacterForm(form: CharacterCreationForm): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Validar nombre
    if (!form.name || form.name.trim().length < 2) {
      errors.push('El nombre debe tener al menos 2 caracteres');
    }

    if (form.name && form.name.length > 50) {
      errors.push('El nombre no puede tener más de 50 caracteres');
    }

    // Validar distribución de puntos de habilidad
    const totalSkillPoints = Object.values(form.skills).reduce((sum, val) => sum + val, 0);
    const maxSkillPoints = 100;

    if (totalSkillPoints !== maxSkillPoints) {
      errors.push(`Debes usar exactamente ${maxSkillPoints} puntos de habilidad (actualmente: ${totalSkillPoints})`);
    }

    // Validar niveles individuales de habilidades
    for (const [skill, level] of Object.entries(form.skills)) {
      if (level < 0 || level > 20) {
        errors.push(`La habilidad ${skill} debe estar entre 0 y 20`);
      }
    }

    // Validar rasgos
    if (form.selectedTraits.length !== 2) {
      errors.push('Debes seleccionar exactamente 2 rasgos');
    }

    // Validar compatibilidad de rasgos
    if (form.selectedTraits.length === 2) {
      const [trait1, trait2] = form.selectedTraits;
      if (!areTraitsCompatible(trait1.id, trait2.id)) {
        errors.push(`Los rasgos "${trait1.name}" y "${trait2.name}" son incompatibles`);
      }
    }

    // Validar horario
    if (form.schedule.workStart >= form.schedule.workEnd) {
      errors.push('La hora de inicio debe ser anterior a la hora de fin');
    }

    if (form.schedule.lunchDuration < 30 || form.schedule.lunchDuration > 120) {
      errors.push('La duración del almuerzo debe estar entre 30 y 120 minutos');
    }

    const lunchEnd = form.schedule.lunchStart + form.schedule.lunchDuration;
    if (form.schedule.lunchStart < form.schedule.workStart || lunchEnd > form.schedule.workEnd) {
      errors.push('El horario de almuerzo debe estar dentro del horario de trabajo');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Crea un nuevo personaje basado en el formulario
   */
  public createCharacter(form: CharacterCreationForm): Character {
    const validation = this.validateCharacterForm(form);
    if (!validation.isValid) {
      throw new Error(`Errores en el formulario: ${validation.errors.join(', ')}`);
    }

    // Convertir ITraits a Traits
    const traits = form.selectedTraits.map(traitData => 
      new Trait(traitData.id, traitData.name, traitData.description, traitData.effects, traitData.behaviorType)
    );

    // Crear personaje
    const character = new Character(
      form.name.trim(),
      form.skills,
      traits,
      form.schedule
    );

    return character;
  }

  /**
   * Obtiene los rasgos disponibles
   */
  public getAvailableTraits(): Trait[] {
    return AVAILABLE_TRAITS.map(traitData => 
      new Trait(traitData.id, traitData.name, traitData.description, traitData.effects, traitData.behaviorType)
    );
  }

  /**
   * Obtiene un horario por defecto
   */
  public getDefaultSchedule(): ISchedule {
    return {
      workStart: 540, // 9:00 AM
      workEnd: 1080, // 6:00 PM
      lunchStart: 780, // 1:00 PM
      lunchDuration: 60, // 1 hora
      breaks: [
        { time: 660, duration: 15, type: 'break' }, // 11:00 AM
        { time: 960, duration: 15, type: 'break' }  // 4:00 PM
      ]
    };
  }

  /**
   * Calcula la distribución recomendada de puntos según un perfil
   */
  public getRecommendedSkillDistribution(profile: 'fullstack' | 'backend' | 'frontend' | 'business' | 'balanced'): { [skill: string]: number } {
    const distributions = {
      fullstack: {
        backend: 15,
        frontend: 15,
        sistemas: 10,
        arquitectura: 10,
        testing: 8,
        redes: 5,
        analisis: 10,
        comunicacion: 8,
        gestion: 7,
        negociacion: 4,
        marketing: 3,
        energia: 3,
        concentracion: 2,
        aprendizaje: 0
      },
      backend: {
        backend: 20,
        sistemas: 15,
        arquitectura: 12,
        redes: 10,
        testing: 8,
        frontend: 5,
        analisis: 10,
        comunicacion: 5,
        gestion: 5,
        negociacion: 3,
        marketing: 2,
        energia: 3,
        concentracion: 2,
        aprendizaje: 0
      },
      frontend: {
        frontend: 20,
        backend: 8,
        testing: 10,
        sistemas: 5,
        redes: 3,
        arquitectura: 8,
        analisis: 12,
        comunicacion: 10,
        marketing: 8,
        gestion: 6,
        negociacion: 4,
        energia: 3,
        concentracion: 2,
        aprendizaje: 1
      },
      business: {
        backend: 5,
        frontend: 5,
        sistemas: 3,
        redes: 2,
        testing: 3,
        arquitectura: 4,
        analisis: 18,
        comunicacion: 15,
        marketing: 12,
        gestion: 15,
        negociacion: 10,
        energia: 4,
        concentracion: 2,
        aprendizaje: 2
      },
      balanced: {
        backend: 10,
        frontend: 10,
        sistemas: 8,
        redes: 6,
        testing: 6,
        arquitectura: 8,
        analisis: 12,
        comunicacion: 10,
        marketing: 6,
        gestion: 8,
        negociacion: 5,
        energia: 3,
        concentracion: 2,
        aprendizaje: 1
      }
    };

    return distributions[profile] || {};
  }

  /**
   * Sugiere rasgos compatibles para un perfil
   */
  public getSuggestedTraits(profile: 'technical' | 'business' | 'creative' | 'management'): Trait[] {
    const suggestions = {
      technical: ['focused', 'methodical', 'detail_oriented', 'night_owl', 'introvert'],
      business: ['charismatic', 'social', 'morning_person', 'pragmatic', 'multitasker'],
      creative: ['creative', 'innovative', 'night_owl', 'quick_learner'],
      management: ['charismatic', 'multitasker', 'morning_person', 'social', 'pragmatic']
    };

    const traitIds = suggestions[profile] || [];
    return this.getAvailableTraits().filter(trait => traitIds.includes(trait.id));
  }

  /**
   * Calcula el costo en puntos de un cambio de horario
   */
  public calculateScheduleCost(schedule: ISchedule): number {
    let cost = 0;
    
    // Horarios muy tempranos o muy tardíos cuestan más
    if (schedule.workStart < 480) cost += 5; // Antes de 8:00 AM
    if (schedule.workEnd > 1140) cost += 5; // Después de 7:00 PM
    
    // Jornadas muy largas cuestan más
    const workHours = (schedule.workEnd - schedule.workStart) / 60;
    if (workHours > 9) cost += Math.floor(workHours - 9) * 2;
    
    // Almuerzo muy corto cuesta más
    if (schedule.lunchDuration < 45) cost += 3;
    
    return cost;
  }

  /**
   * Valida que los rasgos seleccionados sean compatibles
   */
  public validateTraitCompatibility(traits: Trait[]): { isValid: boolean; conflicts: string[] } {
    const conflicts: string[] = [];
    
    for (let i = 0; i < traits.length; i++) {
      for (let j = i + 1; j < traits.length; j++) {
        if (!areTraitsCompatible(traits[i].id, traits[j].id)) {
          conflicts.push(`${traits[i].name} es incompatible con ${traits[j].name}`);
        }
      }
    }

    return {
      isValid: conflicts.length === 0,
      conflicts
    };
  }

  /**
   * Genera un personaje aleatorio para testing
   */
  public generateRandomCharacter(): Character {
    const names = ['Alex', 'Jordan', 'Casey', 'Taylor', 'Morgan', 'Riley', 'Avery', 'Quinn'];
    const randomName = names[Math.floor(Math.random() * names.length)];

    // Distribución aleatoria de habilidades
    const skills: { [key: string]: number } = {};
    const skillNames = ['backend', 'frontend', 'sistemas', 'redes', 'testing', 'arquitectura',
                      'analisis', 'negociacion', 'comunicacion', 'marketing', 'gestion',
                      'energia', 'concentracion', 'aprendizaje'];
    
    let remainingPoints = 100;
    skillNames.forEach((skill, index) => {
      if (index === skillNames.length - 1) {
        skills[skill] = remainingPoints; // Último skill recibe puntos restantes
      } else {
        const maxPoints = Math.min(20, remainingPoints - (skillNames.length - index - 1));
        const points = Math.floor(Math.random() * (maxPoints + 1));
        skills[skill] = points;
        remainingPoints -= points;
      }
    });

    // Rasgos aleatorios compatibles
    const availableTraits = this.getAvailableTraits();
    const trait1 = availableTraits[Math.floor(Math.random() * availableTraits.length)];
    let trait2: Trait;
    do {
      trait2 = availableTraits[Math.floor(Math.random() * availableTraits.length)];
    } while (trait2.id === trait1.id || !areTraitsCompatible(trait1.id, trait2.id));

    const form: CharacterCreationForm = {
      name: randomName,
      skills,
      selectedTraits: [trait1, trait2],
      schedule: this.getDefaultSchedule()
    };

    return this.createCharacter(form);
  }

  /**
   * Exporta un personaje a JSON
   */
  public exportCharacter(character: Character): string {
    return JSON.stringify(character.toJSON(), null, 2);
  }

  /**
   * Importa un personaje desde JSON
   */
  public importCharacter(jsonData: string): Character {
    try {
      const data = JSON.parse(jsonData);
      return Character.fromJSON(data);
    } catch (error) {
      throw new Error('Formato de archivo inválido');
    }
  }

  /**
   * Calcula estadísticas del personaje
   */
  public getCharacterStats(character: Character): {
    totalSkillPoints: number;
    averageSkillLevel: number;
    strongestSkill: { name: string; level: number };
    weakestSkill: { name: string; level: number };
    technicalScore: number;
    businessScore: number;
    personalScore: number;
  } {
    const skills = Array.from(character.skills.entries());
    const totalPoints = skills.reduce((sum, [, skill]) => sum + skill.level, 0);
    const averageLevel = totalPoints / skills.length;

    const sortedSkills = skills
      .map(([name, skill]) => ({ name, level: skill.level }))
      .sort((a, b) => b.level - a.level);

    const strongest = sortedSkills[0];
    const weakest = sortedSkills[sortedSkills.length - 1];

    // Calcular puntuaciones por categoría
    const technicalSkills = ['backend', 'frontend', 'sistemas', 'redes', 'testing', 'arquitectura'];
    const businessSkills = ['analisis', 'negociacion', 'comunicacion', 'marketing', 'gestion'];
    const personalSkills = ['energia', 'concentracion', 'aprendizaje'];

    const calculateCategoryScore = (skillNames: string[]) => {
      const categorySkills = skills.filter(([name]) => skillNames.includes(name));
      return categorySkills.reduce((sum, [, skill]) => sum + skill.level, 0);
    };

    return {
      totalSkillPoints: totalPoints,
      averageSkillLevel: Math.round(averageLevel * 10) / 10,
      strongestSkill: strongest,
      weakestSkill: weakest,
      technicalScore: calculateCategoryScore(technicalSkills),
      businessScore: calculateCategoryScore(businessSkills),
      personalScore: calculateCategoryScore(personalSkills)
    };
  }
}
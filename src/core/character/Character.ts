// src/core/character/Character.ts

import { Activity, BehaviorType, ICharacter, ISchedule } from '../../types/character';
import { Needs } from './Needs';
import { Skill } from './Skill';
import { Trait } from './Trait';

export class Character implements ICharacter {
  public id: string;
  public name: string;
  public skills: Map<string, Skill>;
  public traits: Trait[];
  public needs: Needs;
  public maxNeeds: Needs;
  public schedule: ISchedule;
  public currentActivity: Activity;
  public activityStartTime: number;
  public behaviorType: BehaviorType;
  public productivity: number;
  public money: number;
  public reputation: number;
  public createdAt: Date;

  constructor(
    name: string,
    skillsData: { [skillName: string]: number },
    traits: Trait[],
    schedule: ISchedule,
    id?: string
  ) {
    this.id = id || this.generateId();
    this.name = name;
    this.skills = this.initializeSkills(skillsData);
    this.traits = [...traits];
    this.schedule = { ...schedule };
    this.currentActivity = Activity.IDLE;
    this.activityStartTime = 0;
    this.behaviorType = this.determineBehaviorType();
    this.productivity = 0.8;
    this.money = 1000; // Dinero inicial
    this.reputation = 50; // Reputación inicial
    this.createdAt = new Date();

    // Inicializar necesidades con efectos de rasgos
    this.needs = new Needs();
    this.maxNeeds = this.calculateMaxNeeds();
    this.applyTraitEffectsToNeeds();
  }

  /**
   * Genera un ID único para el personaje
   */
  private generateId(): string {
    return 'char_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Inicializa las habilidades del personaje
   */
  private initializeSkills(skillsData: { [skillName: string]: number }): Map<string, Skill> {
    const skills = new Map<string, Skill>();
    
    // Determinar categoría de cada habilidad
    const getSkillCategory = (skillName: string) => {
      if (['backend', 'frontend', 'sistemas', 'redes', 'testing', 'arquitectura'].includes(skillName)) {
        return 'technical' as any;
      }
      if (['analisis', 'negociacion', 'comunicacion', 'marketing', 'gestion'].includes(skillName)) {
        return 'business' as any;
      }
      return 'personal' as any;
    };

    // Crear habilidades
    for (const [skillName, level] of Object.entries(skillsData)) {
      const skill = new Skill(skillName, level, getSkillCategory(skillName));
      skills.set(skillName, skill);
    }

    return skills;
  }

  /**
   * Determina el tipo de comportamiento predominante basado en los rasgos
   */
  private determineBehaviorType(): BehaviorType {
    if (this.traits.length === 0) return BehaviorType.BALANCED;
    
    // Contar tipos de comportamiento
    const behaviorCounts = new Map<BehaviorType, number>();
    this.traits.forEach(trait => {
      const count = behaviorCounts.get(trait.behaviorType) || 0;
      behaviorCounts.set(trait.behaviorType, count + 1);
    });

    // Devolver el más común, o BALANCED si hay empate
    let maxCount = 0;
    let dominantBehavior = BehaviorType.BALANCED;
    
    for (const [behavior, count] of behaviorCounts) {
      if (count > maxCount) {
        maxCount = count;
        dominantBehavior = behavior;
      }
    }

    return dominantBehavior;
  }

  /**
   * Calcula las necesidades máximas con efectos de rasgos
   */
  private calculateMaxNeeds(): Needs {
    const maxNeeds = new Needs();
    
    // Aplicar modificadores de rasgos
    this.traits.forEach(trait => {
      if (trait.effects.maxEnergy) {
        maxNeeds.energy += trait.effects.maxEnergy;
      }
    });

    return maxNeeds;
  }

  /**
   * Aplica efectos de rasgos a las necesidades actuales
   */
  private applyTraitEffectsToNeeds(): void {
    // Ajustar necesidades actuales basadas en máximos
    if (this.needs.energy > this.maxNeeds.energy) {
      this.needs.energy = this.maxNeeds.energy;
    }
  }

  /**
   * Obtiene una habilidad específica
   */
  public getSkill(skillName: string): Skill | undefined {
    return this.skills.get(skillName);
  }

  /**
   * Obtiene el nivel de una habilidad (con modificadores de rasgos)
   */
  public getEffectiveSkillLevel(skillName: string): number {
    const skill = this.getSkill(skillName);
    if (!skill) return 0;

    let effectiveLevel = skill.level;
    
    // Aplicar modificadores de rasgos
    this.traits.forEach(trait => {
      effectiveLevel += trait.getSkillModifier(skillName);
    });

    return Math.max(0, Math.min(20, effectiveLevel));
  }

  /**
   * Añade experiencia a una habilidad
   */
  public addExperience(skillName: string, amount: number): boolean {
    const skill = this.getSkill(skillName);
    if (!skill) return false;

    // Aplicar modificador de aprendizaje de rasgos
    let finalAmount = amount;
    this.traits.forEach(trait => {
      if (trait.id === 'quick_learner') {
        finalAmount *= 1.5; // Autodidacta aprende 50% más rápido
      }
    });

    return skill.addExperience(finalAmount);
  }

  /**
   * Obtiene la productividad actual basada en necesidades y rasgos
   */
  public getCurrentProductivity(currentTime: number): number {
    const currentHour = Math.floor(currentTime / 60);
    
    // Productividad base por necesidades
    let productivity = this.needs.getProductivityMultiplier();
    
    // Aplicar modificadores de rasgos por hora
    this.traits.forEach(trait => {
      productivity += trait.getProductivityModifier(currentHour);
      productivity += trait.getConcentrationModifier();
    });

    // Aplicar modificador de actividad
    if (this.currentActivity === Activity.WORKING) {
      productivity *= 1.0; // Productividad normal trabajando
    } else {
      productivity *= 0.0; // Sin productividad si no está trabajando
    }

    return Math.max(0, Math.min(2, productivity));
  }

  /**
   * Actualiza las necesidades del personaje
   */
  public updateNeeds(minutes: number): void {
    switch (this.currentActivity) {
      case Activity.WORKING:
        this.needs.updateWhileWorking(minutes, this.productivity);
        break;
      case Activity.RESTING:
        this.needs.updateWhileResting(minutes);
        break;
      case Activity.EATING:
        this.needs.satisfy('hunger', 40 * minutes);
        this.needs.satisfy('motivation', 5 * minutes);
        break;
      case Activity.DRINKING:
        this.needs.satisfy('thirst', 60 * minutes);
        break;
      case Activity.BATHROOM:
        this.needs.satisfyCompletely('bathroom');
        break;
      default:
        this.needs.updateOverTime(minutes);
    }
  }

  /**
   * Determina la siguiente actividad automáticamente
   */
  public determineNextActivity(currentTime: number): Activity {
    const isWorkTime = this.isWorkTime(currentTime);
    const criticalNeed = this.needs.getMostCriticalNeed();

    // Prioridad 1: Necesidades críticas
    if (criticalNeed) {
      switch (criticalNeed.need) {
        case 'bathroom':
          return Activity.BATHROOM;
        case 'thirst':
          return Activity.DRINKING;
        case 'hunger':
          if (this.isLunchTime(currentTime)) return Activity.LUNCH;
          return Activity.EATING;
        case 'energy':
          return Activity.RESTING;
      }
    }

    // Prioridad 2: Horario de almuerzo
    if (this.isLunchTime(currentTime)) {
      return Activity.LUNCH;
    }

    // Prioridad 3: Descansos programados
    if (this.isBreakTime(currentTime)) {
      return Activity.BREAK;
    }

    // Prioridad 4: Trabajar si es horario laboral y tiene energía
    if (isWorkTime && this.needs.energy > 20 && this.needs.concentration > 30) {
      return Activity.WORKING;
    }

    // Por defecto: descansar
    return Activity.RESTING;
  }

  /**
   * Verifica si es horario de trabajo
   */
  public isWorkTime(currentTime: number): boolean {
    return currentTime >= this.schedule.workStart && currentTime <= this.schedule.workEnd;
  }

  /**
   * Verifica si es hora de almorzar
   */
  public isLunchTime(currentTime: number): boolean {
    const lunchEnd = this.schedule.lunchStart + this.schedule.lunchDuration;
    return currentTime >= this.schedule.lunchStart && currentTime < lunchEnd;
  }

  /**
   * Verifica si es hora de un descanso programado
   */
  public isBreakTime(currentTime: number): boolean {
    return this.schedule.breaks.some(breakTime => {
      const breakEnd = breakTime.time + breakTime.duration;
      return currentTime >= breakTime.time && currentTime < breakEnd;
    });
  }

  /**
   * Cambia la actividad actual
   */
  public setActivity(activity: Activity, startTime: number): void {
    this.currentActivity = activity;
    this.activityStartTime = startTime;
  }

  /**
   * Obtiene las habilidades más altas
   */
  public getTopSkills(limit: number = 5): Array<{ name: string; level: number }> {
    return Array.from(this.skills.entries())
      .map(([name, skill]) => ({ name, level: skill.level }))
      .sort((a, b) => b.level - a.level)
      .slice(0, limit);
  }

  /**
   * Verifica si cumple los requisitos para un proyecto
   */
  public meetsRequirements(requirements: { [skillName: string]: number }): boolean {
    for (const [skillName, requiredLevel] of Object.entries(requirements)) {
      if (this.getEffectiveSkillLevel(skillName) < requiredLevel) {
        return false;
      }
    }
    return true;
  }

  /**
   * Serializa el personaje para guardado
   */
  public toJSON(): any {
    const skillsObject: { [key: string]: any } = {};
    this.skills.forEach((skill, name) => {
      skillsObject[name] = skill.toJSON();
    });

    return {
      id: this.id,
      name: this.name,
      skills: skillsObject,
      traits: this.traits.map(trait => trait.toJSON()),
      needs: this.needs.toJSON(),
      maxNeeds: this.maxNeeds.toJSON(),
      schedule: this.schedule,
      currentActivity: this.currentActivity,
      activityStartTime: this.activityStartTime,
      behaviorType: this.behaviorType,
      productivity: this.productivity,
      money: this.money,
      reputation: this.reputation,
      createdAt: this.createdAt.toISOString()
    };
  }

  /**
   * Crea un personaje desde datos JSON
   */
  public static fromJSON(data: any): Character {
    // Convertir skills de objeto a Map
    const skillsData: { [key: string]: number } = {};
    for (const [name, skillData] of Object.entries(data.skills as any)) {
      skillsData[name] = (skillData as any).level;
    }

    // Convertir traits
    const traits = data.traits.map((traitData: any) => Trait.fromJSON(traitData));

    // Crear personaje
    const character = new Character(data.name, skillsData, traits, data.schedule, data.id);
    
    // Restaurar estado
    character.needs = Needs.fromJSON(data.needs);
    character.maxNeeds = Needs.fromJSON(data.maxNeeds);
    character.currentActivity = data.currentActivity;
    character.activityStartTime = data.activityStartTime;
    character.productivity = data.productivity;
    character.money = data.money;
    character.reputation = data.reputation;
    character.createdAt = new Date(data.createdAt);

    // Restaurar experiencia de habilidades
    for (const [name, skillData] of Object.entries(data.skills as any)) {
      const skill = character.getSkill(name);
      if (skill) {
        skill.experience = (skillData as any).experience;
      }
    }

    return character;
  }
}
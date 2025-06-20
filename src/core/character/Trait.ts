import { BehaviorType, ITrait, TraitEffects } from '../../types/character';

export class Trait implements ITrait {
  public id: string;
  public name: string;
  public description: string;
  public effects: TraitEffects;
  public behaviorType: BehaviorType;

  constructor(
    id: string,
    name: string,
    description: string,
    effects: TraitEffects,
    behaviorType: BehaviorType = BehaviorType.BALANCED
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.effects = { ...effects };
    this.behaviorType = behaviorType;
  }

  /**
   * Obtiene el modificador para una habilidad específica
   */
  public getSkillModifier(skillName: string): number {
    return this.effects[skillName] || 0;
  }

  /**
   * Obtiene el modificador de productividad para una hora específica
   */
  public getProductivityModifier(hourOfDay: number): number {
    let modifier = 0;

    // Modificadores por hora del día
    if (hourOfDay >= 6 && hourOfDay < 12) {
      // Mañana (6:00 - 12:00)
      modifier += this.effects.morningProductivity || 0;
    } else if (hourOfDay >= 12 && hourOfDay < 18) {
      // Tarde (12:00 - 18:00)
      modifier += this.effects.afternoonProductivity || 0;
    } else if (hourOfDay >= 18 || hourOfDay < 6) {
      // Noche (18:00 - 6:00)
      modifier += this.effects.nightProductivity || 0;
    }

    return modifier / 100; // Convertir porcentaje a decimal
  }

  /**
   * Obtiene el modificador de concentración
   */
  public getConcentrationModifier(): number {
    return (this.effects.concentrationBonus || 0) / 100;
  }

  /**
   * Obtiene el modificador de creatividad
   */
  public getCreativityModifier(): number {
    return (this.effects.creativityBonus || 0) / 100;
  }

  /**
   * Obtiene el modificador de calidad del trabajo
   */
  public getQualityModifier(): number {
    return (this.effects.qualityBonus || 0) / 100;
  }

  /**
   * Obtiene el modificador de velocidad de trabajo
   */
  public getSpeedModifier(): number {
    return (this.effects.speedBonus || 0) / 100;
  }

  /**
   * Obtiene el modificador de energía máxima
   */
  public getMaxEnergyModifier(): number {
    return this.effects.maxEnergy || 0;
  }

  /**
   * Obtiene todos los modificadores de habilidades
   */
  public getSkillModifiers(): { [skillName: string]: number } {
    const modifiers: { [skillName: string]: number } = {};
    
    for (const [key, value] of Object.entries(this.effects)) {
      if (typeof value === 'number' && 
          !['maxEnergy', 'energyDecayRate', 'hungerDecayRate', 'thirstDecayRate',
            'morningProductivity', 'afternoonProductivity', 'nightProductivity',
            'concentrationBonus', 'creativityBonus', 'qualityBonus', 'speedBonus',
            'teamMoraleEffect', 'communicationBonus', 'negotiationBonus'].includes(key)) {
        modifiers[key] = value;
      }
    }
    
    return modifiers;
  }

  /**
   * Verifica si el rasgo es compatible con otro
   */
  public isCompatibleWith(otherTrait: Trait): boolean {
    // Algunos rasgos pueden ser incompatibles
    const incompatibilities = new Map([
      ['workaholic', ['lazy']],
      ['perfectionist', ['sloppy']],
      ['morning_person', ['night_owl']],
      ['extrovert', ['introvert']]
    ]);

    const incompatible = incompatibilities.get(this.id.toLowerCase()) || [];
    return !incompatible.includes(otherTrait.id.toLowerCase());
  }

  /**
   * Obtiene una descripción detallada de los efectos
   */
  public getEffectsDescription(): string[] {
    const descriptions: string[] = [];

    // Modificadores de energía
    if (this.effects.maxEnergy) {
      descriptions.push(`${this.effects.maxEnergy > 0 ? '+' : ''}${this.effects.maxEnergy} Energía máxima`);
    }

    // Modificadores de habilidades
    const skillMods = this.getSkillModifiers();
    for (const [skill, mod] of Object.entries(skillMods)) {
      if (mod !== 0) {
        descriptions.push(`${mod > 0 ? '+' : ''}${mod} ${skill.charAt(0).toUpperCase() + skill.slice(1)}`);
      }
    }

    // Modificadores de productividad
    if (this.effects.morningProductivity) {
      descriptions.push(`${this.effects.morningProductivity > 0 ? '+' : ''}${this.effects.morningProductivity}% Productividad matutina`);
    }
    if (this.effects.nightProductivity) {
      descriptions.push(`${this.effects.nightProductivity > 0 ? '+' : ''}${this.effects.nightProductivity}% Productividad nocturna`);
    }

    // Otros modificadores
    if (this.effects.qualityBonus) {
      descriptions.push(`${this.effects.qualityBonus > 0 ? '+' : ''}${this.effects.qualityBonus}% Calidad del trabajo`);
    }
    if (this.effects.speedBonus) {
      descriptions.push(`${this.effects.speedBonus > 0 ? '+' : ''}${this.effects.speedBonus}% Velocidad de trabajo`);
    }

    return descriptions;
  }

  /**
   * Crea una copia del rasgo
   */
  public clone(): Trait {
    return new Trait(this.id, this.name, this.description, { ...this.effects }, this.behaviorType);
  }

  /**
   * Serializa el rasgo para guardado
   */
  public toJSON(): ITrait {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      effects: { ...this.effects },
      behaviorType: this.behaviorType
    };
  }

  /**
   * Crea un rasgo desde datos JSON
   */
  public static fromJSON(data: ITrait): Trait {
    return new Trait(data.id, data.name, data.description, data.effects, data.behaviorType);
  }
}
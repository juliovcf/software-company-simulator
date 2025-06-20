// src/core/character/Skill.ts

import { ISkill, SkillCategory } from '../../types/character';

export class Skill implements ISkill {
  public name: string;
  public level: number;
  public experience: number;
  public category: SkillCategory;

  constructor(
    name: string,
    level: number = 0,
    category: SkillCategory,
    experience: number = 0
  ) {
    this.name = name;
    this.level = Math.max(0, Math.min(20, level)); // Nivel entre 0-20
    this.category = category;
    this.experience = Math.max(0, experience);
  }

  /**
   * Añade experiencia a la habilidad y verifica si sube de nivel
   */
  public addExperience(amount: number): boolean {
    this.experience += amount;
    
    // Calcular si la experiencia es suficiente para subir de nivel
    const requiredExp = this.getRequiredExperienceForNextLevel();
    
    if (this.experience >= requiredExp && this.level < 20) {
      this.experience -= requiredExp;
      this.level++;
      return true; // Subió de nivel
    }
    
    return false; // No subió de nivel
  }

  /**
   * Calcula la experiencia necesaria para el siguiente nivel
   */
  public getRequiredExperienceForNextLevel(): number {
    if (this.level >= 20) return Infinity;
    
    // Fórmula progresiva: cada nivel requiere más experiencia
    return Math.floor(100 * Math.pow(1.2, this.level));
  }

  /**
   * Obtiene el progreso hacia el siguiente nivel (0-1)
   */
  public getProgressToNextLevel(): number {
    if (this.level >= 20) return 1;
    
    const required = this.getRequiredExperienceForNextLevel();
    return Math.min(1, this.experience / required);
  }

  /**
   * Verifica si la habilidad es suficiente para un nivel requerido
   */
  public meetsRequirement(requiredLevel: number): boolean {
    return this.level >= requiredLevel;
  }

  /**
   * Obtiene el modificador de efectividad basado en el nivel
   */
  public getEffectivenessModifier(): number {
    // Retorna un multiplicador entre 0.1 y 2.0
    if (this.level === 0) return 0.1;
    return Math.min(2.0, 0.1 + (this.level * 0.095));
  }

  /**
   * Obtiene la descripción del nivel de habilidad
   */
  public getLevelDescription(): string {
    if (this.level === 0) return 'Sin conocimiento';
    if (this.level <= 3) return 'Principiante';
    if (this.level <= 6) return 'Básico';
    if (this.level <= 9) return 'Intermedio';
    if (this.level <= 12) return 'Avanzado';
    if (this.level <= 15) return 'Experto';
    if (this.level <= 18) return 'Maestro';
    return 'Leyenda';
  }

  /**
   * Crea una copia de la habilidad
   */
  public clone(): Skill {
    return new Skill(this.name, this.level, this.category, this.experience);
  }

  /**
   * Serializa la habilidad para guardado
   */
  public toJSON(): ISkill {
    return {
      name: this.name,
      level: this.level,
      experience: this.experience,
      category: this.category
    };
  }

  /**
   * Crea una habilidad desde datos JSON
   */
  public static fromJSON(data: ISkill): Skill {
    return new Skill(data.name, data.level, data.category, data.experience);
  }
}
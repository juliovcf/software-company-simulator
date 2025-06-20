import { INeeds } from '../../types/character';

export class Needs implements INeeds {
  public energy: number;
  public hunger: number;
  public thirst: number;
  public bathroom: number;
  public concentration: number;
  public motivation: number;

  constructor(
    energy: number = 100,
    hunger: number = 80,
    thirst: number = 90,
    bathroom: number = 100,
    concentration: number = 80,
    motivation: number = 75
  ) {
    this.energy = this.clamp(energy);
    this.hunger = this.clamp(hunger);
    this.thirst = this.clamp(thirst);
    this.bathroom = this.clamp(bathroom);
    this.concentration = this.clamp(concentration);
    this.motivation = this.clamp(motivation);
  }

  /**
   * Limita un valor entre 0 y 100
   */
  private clamp(value: number): number {
    return Math.max(0, Math.min(100, value));
  }

  /**
   * Actualiza las necesidades con el paso del tiempo
   */
  public updateOverTime(minutes: number = 1): void {
    // Tasas de degradación por minuto (ajustables)
    const energyDecay = 0.1;
    const hungerDecay = 0.08;
    const thirstDecay = 0.12;
    const bathroomDecay = 0.05;
    const concentrationDecay = 0.15;
    const motivationDecay = 0.02;

    this.energy = this.clamp(this.energy - (energyDecay * minutes));
    this.hunger = this.clamp(this.hunger - (hungerDecay * minutes));
    this.thirst = this.clamp(this.thirst - (thirstDecay * minutes));
    this.bathroom = this.clamp(this.bathroom - (bathroomDecay * minutes));
    this.concentration = this.clamp(this.concentration - (concentrationDecay * minutes));
    this.motivation = this.clamp(this.motivation - (motivationDecay * minutes));
  }

  /**
   * Actualiza las necesidades mientras se trabaja
   */
  public updateWhileWorking(minutes: number = 1, intensity: number = 1): void {
    // El trabajo intenso drena más rápido las necesidades
    const workMultiplier = 1 + (intensity * 0.5);
    
    this.energy = this.clamp(this.energy - (0.2 * minutes * workMultiplier));
    this.concentration = this.clamp(this.concentration - (0.25 * minutes * workMultiplier));
    this.motivation = this.clamp(this.motivation - (0.03 * minutes));
    
    // Las demás necesidades se degradan normalmente
    this.hunger = this.clamp(this.hunger - (0.08 * minutes));
    this.thirst = this.clamp(this.thirst - (0.12 * minutes));
    this.bathroom = this.clamp(this.bathroom - (0.05 * minutes));
  }

  /**
   * Actualiza las necesidades mientras se descansa
   */
  public updateWhileResting(minutes: number = 1): void {
    // El descanso recupera energía y concentración
    this.energy = this.clamp(this.energy + (0.3 * minutes));
    this.concentration = this.clamp(this.concentration + (0.2 * minutes));
    this.motivation = this.clamp(this.motivation + (0.05 * minutes));
    
    // Las demás necesidades se degradan más lentamente
    this.hunger = this.clamp(this.hunger - (0.04 * minutes));
    this.thirst = this.clamp(this.thirst - (0.08 * minutes));
    this.bathroom = this.clamp(this.bathroom - (0.03 * minutes));
  }

  /**
   * Satisface una necesidad específica
   */
  public satisfy(need: keyof INeeds, amount: number): void {
    this[need] = this.clamp(this[need] + amount);
  }

  /**
   * Satisface completamente una necesidad
   */
  public satisfyCompletely(need: keyof INeeds): void {
    this[need] = 100;
  }

  /**
   * Obtiene el promedio general de satisfacción
   */
  public getOverallSatisfaction(): number {
    return (this.energy + this.hunger + this.thirst + this.bathroom + 
            this.concentration + this.motivation) / 6;
  }

  /**
   * Obtiene la productividad basada en las necesidades
   */
  public getProductivityMultiplier(): number {
    // La productividad se ve más afectada por energía y concentración
    const energyFactor = this.energy / 100;
    const concentrationFactor = this.concentration / 100;
    const otherNeeds = (this.hunger + this.thirst + this.bathroom + this.motivation) / 400;
    
    // Pesos: energía 40%, concentración 40%, otras 20%
    return (energyFactor * 0.4) + (concentrationFactor * 0.4) + (otherNeeds * 0.2);
  }

  /**
   * Verifica si una necesidad es crítica (< 20)
   */
  public isCritical(need: keyof INeeds): boolean {
    return this[need] < 20;
  }

  /**
   * Verifica si una necesidad es baja (< 40)
   */
  public isLow(need: keyof INeeds): boolean {
    return this[need] < 40;
  }

  /**
   * Obtiene la necesidad más crítica
   */
  public getMostCriticalNeed(): { need: keyof INeeds; value: number } | null {
    const needs: Array<{ need: keyof INeeds; value: number }> = [
      { need: 'energy', value: this.energy },
      { need: 'hunger', value: this.hunger },
      { need: 'thirst', value: this.thirst },
      { need: 'bathroom', value: this.bathroom },
      { need: 'concentration', value: this.concentration },
      { need: 'motivation', value: this.motivation }
    ];

    // Filtrar solo las necesidades críticas
    const criticalNeeds = needs.filter(n => n.value < 20);
    if (criticalNeeds.length === 0) return null;

    // Devolver la más crítica
    return criticalNeeds.reduce((prev, current) => 
      prev.value < current.value ? prev : current
    );
  }

  /**
   * Obtiene el color para representar el nivel de una necesidad
   */
  public getNeedColor(need: keyof INeeds): string {
    const value = this[need];
    if (value >= 70) return 'green';
    if (value >= 40) return 'yellow';
    return 'red';
  }

  /**
   * Crea una copia de las necesidades
   */
  public clone(): Needs {
    return new Needs(
      this.energy,
      this.hunger,
      this.thirst,
      this.bathroom,
      this.concentration,
      this.motivation
    );
  }

  /**
   * Serializa las necesidades para guardado
   */
  public toJSON(): INeeds {
    return {
      energy: this.energy,
      hunger: this.hunger,
      thirst: this.thirst,
      bathroom: this.bathroom,
      concentration: this.concentration,
      motivation: this.motivation
    };
  }

  /**
   * Crea necesidades desde datos JSON
   */
  public static fromJSON(data: INeeds): Needs {
    return new Needs(
      data.energy,
      data.hunger,
      data.thirst,
      data.bathroom,
      data.concentration,
      data.motivation
    );
  }
}
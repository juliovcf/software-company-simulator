// src/ui/components/character/CharacterCreation.tsx

import { Character } from '@core/character/Character';
import { CharacterService } from '@services/CharacterService';
import { AlertCircle, CheckCircle, Clock, RotateCcw, Star, User } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Trait } from '../../../core/character/Trait';
import { CharacterCreationForm, ITrait, SKILL_CATEGORIES_MAP, SkillCategory } from '../../../types/character';
// src/ui/components/character/CharacterCreation.tsx
// src/ui/components/character/CharacterCreation.tsx

/*import React, { useState, useEffect } from 'react';
import { User, Zap, Clock, Star, AlertCircle, CheckCircle, RotateCcw } from 'lucide-react';
import { CharacterCreationForm, SKILL_CATEGORIES_MAP, SkillCategory, ITrait } from '@types/character';
import { CharacterService } from '@services/CharacterService';
import { Character } from '@core/character/Character';
import { Trait } from '@core/character/Trait';
*/
interface CharacterCreationProps {
  onCharacterCreated: (character: Character) => void;
  onCancel?: () => void;
}

export const CharacterCreation: React.FC<CharacterCreationProps> = ({
  onCharacterCreated,
  onCancel
}) => {
  const characterService = CharacterService.getInstance();
  const [form, setForm] = useState<CharacterCreationForm>({
    name: '',
    skills: {},
    selectedTraits: [],
    schedule: characterService.getDefaultSchedule()
  });

  const [availableTraits] = useState<Trait[]>(characterService.getAvailableTraits());
  const [errors, setErrors] = useState<string[]>([]);
  const [showPresets, setShowPresets] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string>('');

  // Inicializar habilidades en 0
  useEffect(() => {
    const initialSkills: { [key: string]: number } = {};
    Object.values(SKILL_CATEGORIES_MAP).flat().forEach(skill => {
      initialSkills[skill] = 0;
    });
    setForm(prev => ({ ...prev, skills: initialSkills }));
  }, []);

  const skillPoints = 100;
  const usedPoints = Object.values(form.skills).reduce((sum, val) => sum + val, 0);
  const remainingPoints = skillPoints - usedPoints;

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  const updateSkill = (skill: string, value: number): void => {
    const newValue = Math.max(0, Math.min(20, value));
    const currentValue = form.skills[skill] || 0;
    const difference = newValue - currentValue;
    
    // Verificar si hay suficientes puntos
    if (difference > remainingPoints) {
      return;
    }

    setForm(prev => ({
      ...prev,
      skills: { ...prev.skills, [skill]: newValue }
    }));
  };

  const toggleTrait = (trait: Trait): void => {
    setForm(prev => {
      const isSelected = prev.selectedTraits.find(t => t.id === trait.id);
      let newTraits;
      
      if (isSelected) {
        newTraits = prev.selectedTraits.filter(t => t.id !== trait.id);
      } else if (prev.selectedTraits.length < 2) {
        // Convertir Trait (clase) a ITrait (interfaz) para el formulario
        const traitData: ITrait = {
          id: trait.id,
          name: trait.name,
          description: trait.description,
          effects: trait.effects,
          behaviorType: trait.behaviorType
        };
        newTraits = [...prev.selectedTraits, traitData];
      } else {
        // Reemplazar el primer rasgo si ya hay 2
        const traitData: ITrait = {
          id: trait.id,
          name: trait.name,
          description: trait.description,
          effects: trait.effects,
          behaviorType: trait.behaviorType
        };
        newTraits = [prev.selectedTraits[1], traitData];
      }
      
      return { ...prev, selectedTraits: newTraits };
    });
  };

  const updateSchedule = (field: keyof typeof form.schedule, value: number): void => {
    setForm(prev => ({
      ...prev,
      schedule: { ...prev.schedule, [field]: value }
    }));
  };

  const applyPreset = (preset: string): void => {
    const distribution = characterService.getRecommendedSkillDistribution(preset as any);
    setForm(prev => ({ ...prev, skills: distribution }));
    setSelectedPreset(preset);
  };

  const resetSkills = (): void => {
    const resetSkills: { [key: string]: number } = {};
    Object.keys(form.skills).forEach(skill => {
      resetSkills[skill] = 0;
    });
    setForm(prev => ({ ...prev, skills: resetSkills }));
    setSelectedPreset('');
  };

  const handleSubmit = (): void => {
    const validation = characterService.validateCharacterForm(form);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    try {
      const character = characterService.createCharacter(form);
      onCharacterCreated(character);
    } catch (error) {
      setErrors([error instanceof Error ? error.message : 'Error desconocido']);
    }
  };

  const getSkillCategoryName = (category: SkillCategory): string => {
    switch (category) {
      case SkillCategory.TECHNICAL: return 'Habilidades Técnicas';
      case SkillCategory.BUSINESS: return 'Habilidades de Negocio';
      case SkillCategory.PERSONAL: return 'Habilidades Personales';
      default: return '';
    }
  };

  const getTraitCompatibility = (trait: Trait): 'compatible' | 'incompatible' | 'neutral' => {
    if (form.selectedTraits.length === 0) return 'neutral';
    
    const otherTrait = form.selectedTraits[0];
    if (form.selectedTraits.length === 1) {
      // Convertir ITrait a Trait para la validación
      const traitInstances = [
        new Trait(otherTrait.id, otherTrait.name, otherTrait.description, otherTrait.effects, otherTrait.behaviorType),
        trait
      ];
      const validation = characterService.validateTraitCompatibility(traitInstances);
      return validation.isValid ? 'compatible' : 'incompatible';
    }
    
    return 'neutral';
  };

  const stats = form.skills ? characterService.getCharacterStats({
    skills: new Map(Object.entries(form.skills).map(([name, level]) => [name, { level } as any])),
  } as any) : null;

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <User className="w-8 h-8 text-blue-600" />
          Crear tu Desarrollador
        </h1>
        <p className="text-gray-600">
          Diseña tu personaje con habilidades y rasgos únicos que afectarán tu experiencia en el simulador.
        </p>
      </div>

      {/* Errores */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <h3 className="font-semibold text-red-800">Errores de validación:</h3>
          </div>
          <ul className="space-y-1">
            {errors.map((error, index) => (
              <li key={index} className="text-red-700 text-sm">• {error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Información básica y habilidades */}
        <div className="xl:col-span-2 space-y-6">
          {/* Información básica */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Información Básica</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Nombre del personaje *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Introduce el nombre de tu desarrollador"
                maxLength={50}
              />
            </div>

            {/* Estadísticas rápidas */}
            {stats && (
              <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="font-semibold text-blue-600">{stats.technicalScore}</div>
                  <div className="text-xs text-gray-600">Técnico</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-green-600">{stats.businessScore}</div>
                  <div className="text-xs text-gray-600">Negocio</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-purple-600">{stats.personalScore}</div>
                  <div className="text-xs text-gray-600">Personal</div>
                </div>
              </div>
            )}
          </div>

          {/* Habilidades */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Distribución de Habilidades
              </h2>
              <div className="flex items-center gap-3">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  remainingPoints === 0 ? 'bg-green-100 text-green-800' : 
                  remainingPoints > 0 ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                }`}>
                  {remainingPoints} puntos restantes
                </div>
                <button
                  onClick={() => setShowPresets(!showPresets)}
                  className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Presets
                </button>
                <button
                  onClick={resetSkills}
                  className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                  title="Resetear habilidades"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Presets */}
            {showPresets && (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-2">Distribuciones predefinidas:</h3>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {['fullstack', 'backend', 'frontend', 'business', 'balanced'].map(preset => (
                    <button
                      key={preset}
                      onClick={() => applyPreset(preset)}
                      className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                        selectedPreset === preset
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'bg-white hover:bg-gray-50 border-gray-300'
                      }`}
                    >
                      {preset.charAt(0).toUpperCase() + preset.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Habilidades por categoría */}
            {Object.entries(SKILL_CATEGORIES_MAP).map(([category, skills]) => (
              <div key={category} className="mb-6 last:mb-0">
                <h3 className="font-medium text-gray-800 mb-3">
                  {getSkillCategoryName(category as SkillCategory)}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {skills.map(skill => (
                    <div key={skill} className="flex items-center gap-3">
                      <span className="text-sm capitalize w-24 text-gray-700">{skill}:</span>
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="number"
                          min="0"
                          max="20"
                          value={form.skills[skill] || 0}
                          onChange={(e) => updateSkill(skill, parseInt(e.target.value) || 0)}
                          className="w-16 p-1 border border-gray-300 rounded text-center text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${((form.skills[skill] || 0) / 20) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 w-8">
                          {Math.round(((form.skills[skill] || 0) / 20) * 100)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rasgos */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">
            Rasgos de Personalidad
            <span className="text-sm font-normal text-gray-600 ml-2">
              ({form.selectedTraits.length}/2)
            </span>
          </h2>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {availableTraits.map(trait => {
              const compatibility = getTraitCompatibility(trait);
              const isSelected = form.selectedTraits.find(t => t.id === trait.id);
              
              return (
                <div
                  key={trait.id}
                  onClick={() => toggleTrait(trait)}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : compatibility === 'incompatible'
                      ? 'border-red-300 bg-red-50 opacity-50 cursor-not-allowed'
                      : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-sm flex items-center gap-2">
                        {trait.name}
                        {isSelected && <CheckCircle className="w-4 h-4 text-blue-500" />}
                        {compatibility === 'incompatible' && <AlertCircle className="w-4 h-4 text-red-500" />}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">{trait.description}</div>
                      <div className="text-xs text-purple-600 mt-1 capitalize">
                        {trait.behaviorType}
                      </div>
                    </div>
                  </div>
                  
                  {/* Efectos del rasgo */}
                  <div className="mt-2 flex flex-wrap gap-1">
                    {trait.getEffectsDescription().slice(0, 3).map((effect, index) => (
                      <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {effect}
                      </span>
                    ))}
                    {trait.getEffectsDescription().length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{trait.getEffectsDescription().length - 3} más
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Rasgos seleccionados */}
          {form.selectedTraits.length > 0 && (
            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <h4 className="font-medium mb-2 text-sm text-green-800">Rasgos seleccionados:</h4>
              <div className="space-y-2">
                {form.selectedTraits.map(trait => (
                  <div key={trait.id} className="text-sm">
                    <div className="font-medium text-green-800">{trait.name}</div>
                    <div className="text-green-700 text-xs">{trait.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Horario */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Horario de Trabajo
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Inicio de jornada</label>
              <input
                type="time"
                value={formatTime(form.schedule.workStart)}
                onChange={(e) => {
                  const [hours, minutes] = e.target.value.split(':').map(Number);
                  updateSchedule('workStart', hours * 60 + minutes);
                }}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Fin de jornada</label>
              <input
                type="time"
                value={formatTime(form.schedule.workEnd)}
                onChange={(e) => {
                  const [hours, minutes] = e.target.value.split(':').map(Number);
                  updateSchedule('workEnd', hours * 60 + minutes);
                }}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Hora de almuerzo</label>
              <input
                type="time"
                value={formatTime(form.schedule.lunchStart)}
                onChange={(e) => {
                  const [hours, minutes] = e.target.value.split(':').map(Number);
                  updateSchedule('lunchStart', hours * 60 + minutes);
                }}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Duración almuerzo (minutos)</label>
              <input
                type="number"
                min="30"
                max="120"
                step="15"
                value={form.schedule.lunchDuration}
                onChange={(e) => updateSchedule('lunchDuration', parseInt(e.target.value) || 60)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Resumen del horario */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="font-medium mb-2 text-sm">Resumen:</h4>
              <div className="space-y-1 text-sm text-gray-700">
                <div>Trabajo: {formatTime(form.schedule.workStart)} - {formatTime(form.schedule.workEnd)}</div>
                <div>Almuerzo: {formatTime(form.schedule.lunchStart)} ({form.schedule.lunchDuration} min)</div>
                <div>Jornada: {Math.round((form.schedule.workEnd - form.schedule.workStart) / 60 * 10) / 10}h</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="mt-8 flex justify-center gap-4">
        {onCancel && (
          <button
            onClick={onCancel}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
        )}
        <button
          onClick={handleSubmit}
          disabled={!form.name || remainingPoints !== 0 || form.selectedTraits.length !== 2}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Star className="w-5 h-5" />
          Crear Personaje
        </button>
      </div>
    </div>
  );
};
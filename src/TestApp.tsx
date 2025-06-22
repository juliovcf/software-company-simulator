// TestApp.tsx - App simple para probar el componente

import React, { useState } from 'react';
import { Character } from './core/character/Character';
import { CharacterCreation } from './ui/components/character/CharacterCreation';

const TestApp: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<'creation' | 'summary'>('creation');
  const [character, setCharacter] = useState<Character | null>(null);

  const handleCharacterCreated = (newCharacter: Character) => {
    setCharacter(newCharacter);
    setCurrentScreen('summary');
    console.log('Personaje creado:', newCharacter);
  };

  const resetApp = () => {
    setCharacter(null);
    setCurrentScreen('creation');
  };

  if (currentScreen === 'creation') {
    return (
      <CharacterCreation 
        onCharacterCreated={handleCharacterCreated}
      />
    );
  }

  if (currentScreen === 'summary' && character) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6 text-center text-green-600">
            ¡Personaje Creado Exitosamente! 🎉
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Información básica */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold border-b pb-2">Información Básica</h2>
              <div className="space-y-2">
                <p><strong>Nombre:</strong> {character.name}</p>
                <p><strong>ID:</strong> {character.id}</p>
                <p><strong>Dinero inicial:</strong> €{character.money}</p>
                <p><strong>Reputación:</strong> {character.reputation}/100</p>
                <p><strong>Tipo de comportamiento:</strong> {character.behaviorType}</p>
              </div>
            </div>

            {/* Habilidades principales */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold border-b pb-2">Habilidades Principales</h2>
              <div className="space-y-2">
                {character.getTopSkills(5).map(skill => (
                  <div key={skill.name} className="flex justify-between">
                    <span className="capitalize">{skill.name}:</span>
                    <span className="font-medium">{skill.level}/20</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rasgos */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold border-b pb-2">Rasgos</h2>
              <div className="space-y-3">
                {character.traits.map(trait => (
                  <div key={trait.id} className="p-3 bg-gray-50 rounded">
                    <h3 className="font-medium">{trait.name}</h3>
                    <p className="text-sm text-gray-600">{trait.description}</p>
                    <div className="text-xs text-purple-600 mt-1">
                      Efectos: {trait.getEffectsDescription().slice(0, 2).join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Necesidades actuales */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold border-b pb-2">Estado Actual</h2>
              <div className="space-y-2">
                {Object.entries(character.needs.toJSON()).map(([need, value]) => (
                  <div key={need} className="flex items-center gap-2">
                    <span className="capitalize w-24 text-sm">{need}:</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          value > 70 ? 'bg-green-500' : 
                          value > 40 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${value}%` }}
                      />
                    </div>
                    <span className="text-sm w-8">{Math.round(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Datos técnicos */}
          <div className="mt-8 p-4 bg-gray-100 rounded">
            <h3 className="font-semibold mb-2">Datos Técnicos:</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Horario:</strong> {Math.floor(character.schedule.workStart/60)}:{(character.schedule.workStart%60).toString().padStart(2,'0')} - {Math.floor(character.schedule.workEnd/60)}:{(character.schedule.workEnd%60).toString().padStart(2,'0')}
              </div>
              <div>
                <strong>Productividad actual:</strong> {Math.round(character.getCurrentProductivity(600) * 100)}%
              </div>
              <div>
                <strong>Satisfacción general:</strong> {Math.round(character.needs.getOverallSatisfaction())}%
              </div>
              <div>
                <strong>Actividad:</strong> {character.currentActivity}
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={resetApp}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Crear Otro Personaje
            </button>
            <button
              onClick={() => console.log('JSON:', character.toJSON())}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Ver JSON (Consola)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default TestApp;
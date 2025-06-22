// Main application entry point
document.addEventListener('DOMContentLoaded', function() {
    try {
        console.log('🚀 Inicializando Simulador de Empresa de Software...');
        
        // Wait for all scripts to load
        setTimeout(() => {
            console.log('🔍 Verificando módulos...');
            if (typeof window.GameState === 'undefined') {
                throw new Error('GameState no está definido');
            }
            console.log('✅ GameState cargado');
            
            if (typeof window.UI === 'undefined') {
                throw new Error('UI no está definido');
            }
            console.log('✅ UI cargado');
            
            if (typeof window.Character === 'undefined') {
                throw new Error('Character no está definido');
            }
            console.log('✅ Character cargado');
            
            // Verify DOM elements exist
            const startBtn = document.getElementById('start-btn');
            if (startBtn) {
                console.log('✅ Botón de inicio encontrado en main.js');
            } else {
                console.error('❌ Botón de inicio NO encontrado en main.js');
                console.log('🔍 Elementos disponibles con IDs:');
                const allElements = document.querySelectorAll('[id]');
                allElements.forEach(el => console.log(' - ID:', el.id));
            }
            
            // Initialize game state
            console.log('🎯 Inicializando GameState...');
            window.GameState.init();
            
            // Initialize UI
            console.log('🖥️ Inicializando UI...');
            window.UI.init();
            
            // Add initial log entry
            console.log('📝 Añadiendo entrada inicial al log...');
            window.UI.addLogEntry('Sistema iniciado. Configura tu personaje para comenzar.', 'log-task');
            
            console.log('✅ Simulador inicializado correctamente');
            
        }, 100); // Wait 100ms for all scripts to load
        
    } catch (error) {
        console.error('❌ Error inicializando el simulador:', error);
        alert('Error al inicializar el simulador. Revisa la consola para más detalles.');
    }
});

// Global error handler
window.addEventListener('error', function(event) {
    console.error('Error global capturado:', event.error);
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', function(event) {
    console.error('Promise rejection no manejada:', event.reason);
});

// Debug functions (available in console)
window.debugGame = {
    getState: () => window.GameState,
    getCharacter: () => window.GameState.character,
    setNeed: (need, value) => {
        if (window.GameState.character && window.GameState.character.needs[need] !== undefined) {
            window.GameState.character.needs[need] = Math.max(0, Math.min(100, value));
            console.log(`${need} establecido a ${value}`);
        }
    },
    forceAction: (action) => {
        if (window.GameState.character) {
            const decision = { action, duration: 5 };
            window.GameState.executeAction(decision);
            console.log(`Forzando acción: ${action}`);
        }
    },
    speedUp: () => {
        console.log('⚡ Modo de velocidad rápida activado (solo para debug)');
        // You can modify the game loop interval here if needed
    }
};// Main application entry point
document.addEventListener('DOMContentLoaded', function() {
    try {
        console.log('🚀 Inicializando Simulador de Empresa de Software...');
        
        // Wait for all scripts to load
        setTimeout(() => {
            console.log('🔍 Verificando módulos...');
            if (typeof window.GameState === 'undefined') {
                throw new Error('GameState no está definido');
            }
            console.log('✅ GameState cargado');
            
            if (typeof window.UI === 'undefined') {
                throw new Error('UI no está definido');
            }
            console.log('✅ UI cargado');
            
            if (typeof window.Character === 'undefined') {
                throw new Error('Character no está definido');
            }
            console.log('✅ Character cargado');
            
            // Verify DOM elements exist
            const startBtn = document.getElementById('start-btn');
            if (startBtn) {
                console.log('✅ Botón de inicio encontrado en main.js');
            } else {
                console.error('❌ Botón de inicio NO encontrado en main.js');
                console.log('🔍 Elementos disponibles con IDs:');
                const allElements = document.querySelectorAll('[id]');
                allElements.forEach(el => console.log(' - ID:', el.id));
            }
            
            // Initialize game state
            console.log('🎯 Inicializando GameState...');
            window.GameState.init();
            
            // Initialize UI
            console.log('🖥️ Inicializando UI...');
            window.UI.init();
            
            // Add initial log entry
            console.log('📝 Añadiendo entrada inicial al log...');
            window.UI.addLogEntry('Sistema iniciado. Configura tu personaje para comenzar.', 'log-task');
            
            console.log('✅ Simulador inicializado correctamente');
            
        }, 100); // Wait 100ms for all scripts to load
        
    } catch (error) {
        console.error('❌ Error inicializando el simulador:', error);
        alert('Error al inicializar el simulador. Revisa la consola para más detalles.');
    }
});

// Global error handler
window.addEventListener('error', function(event) {
    console.error('Error global capturado:', event.error);
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', function(event) {
    console.error('Promise rejection no manejada:', event.reason);
});

// Debug functions (available in console)
window.debugGame = {
    getState: () => window.GameState,
    getCharacter: () => window.GameState.character,
    setNeed: (need, value) => {
        if (window.GameState.character && window.GameState.character.needs[need] !== undefined) {
            window.GameState.character.needs[need] = Math.max(0, Math.min(100, value));
            console.log(`${need} establecido a ${value}`);
        }
    },
    forceAction: (action) => {
        if (window.GameState.character) {
            const decision = { action, duration: 5 };
            window.GameState.executeAction(decision);
            console.log(`Forzando acción: ${action}`);
        }
    },
    speedUp: () => {
        console.log('⚡ Modo de velocidad rápida activado (solo para debug)');
        // You can modify the game loop interval here if needed
    }
};
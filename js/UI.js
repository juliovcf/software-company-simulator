// UI Management
window.UI = {
    // Initialize UI event listeners
    init() {
        console.log('🖥️ Inicializando UI...');
        this.setupSkillSliders();
        this.setupTraitSelection();
        this.setupButtons();
        
        // Backup: Event delegation for buttons (in case direct approach fails)
        document.addEventListener('click', (e) => {
            if (e.target.id === 'start-simulation-btn') {
                console.log('🚀 Botón de inicio clickeado (via event delegation)');
                e.preventDefault();
                this.startSimulation();
            }
            if (e.target.id === 'pause-btn') {
                console.log('⏸️ Botón de pausa clickeado (via event delegation)');
                e.preventDefault();
                this.togglePause();
            }
            if (e.target.id === 'reset-btn') {
                console.log('🔄 Botón de reset clickeado (via event delegation)');
                e.preventDefault();
                this.resetSimulation();
            }
        });
        
        console.log('✅ UI inicializado (incluyendo event delegation backup)');
    },

    // Setup skill sliders with live updates
    setupSkillSliders() {
        const sliders = ['programming-skill', 'concentration-skill', 'speed-skill'];
        sliders.forEach(id => {
            const slider = document.getElementById(id);
            const display = document.getElementById(id.replace('-skill', '-display'));
            if (slider && display) {
                slider.addEventListener('input', () => {
                    display.textContent = slider.value;
                });
            }
        });
    },

    // Setup trait selection with maximum limit
    setupTraitSelection() {
        const checkboxes = document.querySelectorAll('.trait-option input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                const checked = document.querySelectorAll('.trait-option input[type="checkbox"]:checked');
                if (checked.length > 2) {
                    checkbox.checked = false;
                    alert('Máximo 2 rasgos permitidos');
                }
            });
        });
    },

    // Setup button event listeners
    setupButtons() {
        console.log('🔧 Configurando botones...');
        
        // Wait for DOM to be ready and try multiple times if needed
        const setupButtonsWithRetry = (retries = 3) => {
            const startBtn = document.getElementById('start-btn');
            const pauseBtn = document.getElementById('pause-btn');
            const resetBtn = document.getElementById('reset-btn');

            if (startBtn) {
                console.log('✅ Botón de inicio encontrado');
                startBtn.addEventListener('click', (e) => {
                    console.log('🚀 Botón de inicio clickeado');
                    e.preventDefault();
                    this.startSimulation();
                });
            } else {
                console.error('❌ Botón de inicio NO encontrado');
                if (retries > 0) {
                    console.log(`🔄 Reintentando en 100ms... (${retries} intentos restantes)`);
                    setTimeout(() => setupButtonsWithRetry(retries - 1), 100);
                    return;
                }
            }
            
            if (pauseBtn) {
                console.log('✅ Botón de pausa encontrado');
                pauseBtn.addEventListener('click', (e) => {
                    console.log('⏸️ Botón de pausa clickeado');
                    e.preventDefault();
                    this.togglePause();
                });
            }
            
            if (resetBtn) {
                console.log('✅ Botón de reset encontrado');
                resetBtn.addEventListener('click', (e) => {
                    console.log('🔄 Botón de reset clickeado');
                    e.preventDefault();
                    this.resetSimulation();
                });
            }
        };
        
        setupButtonsWithRetry();
    },

    // Start the simulation
    startSimulation() {
        console.log('🚀 Iniciando simulación...');
        
        try {
            // Collect character data from form
            console.log('📝 Recopilando datos del personaje...');
            const characterData = this.collectCharacterData();
            console.log('📊 Datos recopilados:', characterData);
            
            // Validate data
            console.log('✅ Validando datos...');
            if (!this.validateCharacterData(characterData)) {
                console.log('❌ Validación fallida');
                return;
            }
            console.log('✅ Datos válidos');

            // Create character
            console.log('👤 Creando personaje...');
            const character = new window.Character(
                characterData.name,
                characterData.skills,
                characterData.traits,
                characterData.workHours
            );
            console.log('✅ Personaje creado:', character);

            // Switch to game view
            console.log('🎮 Cambiando a vista de juego...');
            this.showGameArea();
            
            // Start the game
            console.log('⚡ Iniciando juego...');
            window.GameState.start(character);
            
            console.log('📝 Añadiendo entrada al log...');
            this.addLogEntry(`¡Simulación iniciada! ${character.name} está listo para trabajar.`, 'log-task');
            
            console.log('✅ Simulación iniciada correctamente');
            
        } catch (error) {
            console.error('❌ Error al iniciar la simulación:', error);
            alert('Error al iniciar la simulación. Revisa la consola para más detalles.');
        }
    },

    // Collect character data from form
    collectCharacterData() {
        const name = document.getElementById('character-name').value;
        
        const skills = {
            programming: parseInt(document.getElementById('programming-skill').value),
            concentration: parseInt(document.getElementById('concentration-skill').value),
            speed: parseInt(document.getElementById('speed-skill').value)
        };
        
        const traits = Array.from(document.querySelectorAll('.trait-option input[type="checkbox"]:checked'))
                           .map(cb => cb.value);
        
        const workHours = {
            start: document.getElementById('work-start').value,
            end: document.getElementById('work-end').value
        };

        return { name, skills, traits, workHours };
    },

    // Validate character data
    validateCharacterData(data) {
        if (!data.name.trim()) {
            alert('Por favor ingresa un nombre para tu personaje');
            return false;
        }
        if (!data.workHours.start || !data.workHours.end) {
            alert('Por favor configura las horas de trabajo');
            return false;
        }
        return true;
    },

    // Show game area and hide setup
    showGameArea() {
        console.log('🎮 Mostrando área de juego...');
        
        const setupElement = document.getElementById('character-setup');
        const gameElement = document.getElementById('game-area');
        
        if (setupElement) {
            setupElement.classList.add('hidden');
            console.log('✅ Setup ocultado');
        } else {
            console.error('❌ Elemento character-setup no encontrado');
        }
        
        if (gameElement) {
            gameElement.classList.remove('hidden');
            console.log('✅ Área de juego mostrada');
        } else {
            console.error('❌ Elemento game-area no encontrado');
        }
    },

    // Show setup and hide game area
    showSetup() {
        document.getElementById('game-area').classList.add('hidden');
        document.getElementById('character-setup').classList.remove('hidden');
    },

    // Toggle pause
    togglePause() {
        window.GameState.togglePause();
        const btn = document.getElementById('pause-btn');
        if (btn) {
            btn.textContent = window.GameState.isPaused ? '▶️ Continuar' : '⏸️ Pausar';
        }
    },

    // Reset simulation
    resetSimulation() {
        window.GameState.reset();
        this.showSetup();
        this.clearLog();
        
        // Reset pause button
        const pauseBtn = document.getElementById('pause-btn');
        if (pauseBtn) {
            pauseBtn.textContent = '⏸️ Pausar';
        }
    },

    // Update all UI elements
    updateAll() {
        this.updateTime();
        this.updateNeeds();
        this.updateCurrentTask();
        this.updateProjectProgress();
    },

    // Update time display
    updateTime() {
        const timeElement = document.getElementById('current-time');
        if (timeElement && window.GameState.gameTime) {
            const timeStr = window.GameState.gameTime.toLocaleTimeString('es-ES', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            const dayStr = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][window.GameState.gameTime.getDay()];
            timeElement.textContent = `${timeStr} - ${dayStr}`;
        }
    },

    // Update needs bars
    updateNeeds() {
        if (!window.GameState.character) return;

        const character = window.GameState.character;
        Object.keys(character.needs).forEach(need => {
            const value = Math.round(character.needs[need]);
            const barElement = document.getElementById(`${need}-bar`);
            const valueElement = document.getElementById(`${need}-value`);
            
            if (barElement) barElement.style.width = `${value}%`;
            if (valueElement) valueElement.textContent = value;
        });
    },

    // Update current task display
    updateCurrentTask() {
        const currentTask = window.GameState.project.tasks[window.GameState.project.currentTaskIndex];
        if (!currentTask) return;

        const character = window.GameState.character;
        
        const taskNameElement = document.getElementById('task-name');
        const taskDescElement = document.getElementById('task-description');
        const taskProgressBarElement = document.getElementById('task-progress-bar');
        const taskProgressTextElement = document.getElementById('task-progress-text');
        
        if (taskNameElement) {
            taskNameElement.textContent = currentTask.name;
        }
        
        if (taskDescElement) {
            const status = character && character.currentAction === "working" ? "Trabajando en" : "Próxima tarea:";
            taskDescElement.textContent = `${status} ${currentTask.name}`;
        }
        
        if (taskProgressBarElement) {
            taskProgressBarElement.style.width = `${currentTask.progress}%`;
        }
        
        if (taskProgressTextElement) {
            taskProgressTextElement.textContent = `${Math.round(currentTask.progress)}% completado`;
        }
    },

    // Update project progress
    updateProjectProgress() {
        const projectProgressBarElement = document.getElementById('project-progress-bar');
        const projectProgressTextElement = document.getElementById('project-progress-text');
        
        if (projectProgressBarElement) {
            projectProgressBarElement.style.width = `${window.GameState.project.progress}%`;
        }
        
        if (projectProgressTextElement) {
            projectProgressTextElement.textContent = `${Math.round(window.GameState.project.progress)}% completado`;
        }
    },

    // Add entry to activity log
    addLogEntry(message, className = '') {
        console.log('📝 Añadiendo al log:', message, 'con clase:', className);
        
        try {
            const log = document.getElementById('activity-log');
            if (!log) {
                console.error('❌ Elemento activity-log no encontrado');
                return;
            }
            
            const entry = document.createElement('div');
            entry.className = `log-entry ${className}`;
            
            const timeStr = window.GameState.gameTime ? 
                window.GameState.gameTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : 
                new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
                
            entry.textContent = `${timeStr} - ${message}`;
            
            log.appendChild(entry);
            log.scrollTop = log.scrollHeight;

            // Keep only last 50 entries
            while (log.children.length > 50) {
                log.removeChild(log.firstChild);
            }
            
            console.log('✅ Entrada añadida al log correctamente');
        } catch (error) {
            console.error('❌ Error añadiendo entrada al log:', error);
        }
    },

    // Clear activity log
    clearLog() {
        const log = document.getElementById('activity-log');
        if (log) {
            log.innerHTML = '<div class="log-entry">Sistema reiniciado. Listo para crear un nuevo personaje...</div>';
        }
    }
};;
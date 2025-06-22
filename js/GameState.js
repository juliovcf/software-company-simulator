// Game State Management
window.GameState = {
    isRunning: false,
    isPaused: false,
    gameTime: new Date(),
    character: null,
    currentTask: null,
    gameLoop: null,
    
    project: {
        progress: 0,
        tasks: [
            { name: "Análisis de Requisitos", duration: 120, progress: 0, type: "analysis" },
            { name: "Diseño de Base de Datos", duration: 180, progress: 0, type: "design" },
            { name: "Desarrollo Backend", duration: 300, progress: 0, type: "programming" },
            { name: "Desarrollo Frontend", duration: 240, progress: 0, type: "programming" },
            { name: "Testing y Depuración", duration: 150, progress: 0, type: "testing" },
            { name: "Documentación", duration: 90, progress: 0, type: "documentation" }
        ],
        currentTaskIndex: 0
    },

    // Initialize the game
    init() {
        this.gameTime = new Date();
        this.isRunning = false;
        this.isPaused = false;
        this.character = null;
        this.currentTask = null;
        this.project.progress = 0;
        this.project.currentTaskIndex = 0;
        this.project.tasks.forEach(task => task.progress = 0);
    },

    // Start the game with a character
    start(character) {
        console.log('🎯 GameState.start() llamado con:', character);
        
        this.character = character;
        this.gameTime.setHours(parseInt(character.workHours.start.split(':')[0]), 0, 0, 0);
        this.isRunning = true;
        this.isPaused = false;
        
        console.log('⏰ Tiempo de juego establecido:', this.gameTime);
        console.log('🏃 Estado de juego: isRunning =', this.isRunning);
        
        this.startGameLoop();
        console.log('✅ GameState iniciado correctamente');
    },

    // Start the game loop
    startGameLoop() {
        console.log('🔄 Iniciando game loop...');
        
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
        }
        
        this.gameLoop = setInterval(() => {
            if (!this.isRunning || this.isPaused) {
                return;
            }

            try {
                this.update();
            } catch (error) {
                console.error('Error en el game loop:', error);
                this.stop();
            }
        }, 1000); // 1 second = 1 minute in game
        
        console.log('✅ Game loop iniciado, ID:', this.gameLoop);
    },

    // Update game state
    update() {
        // Debug: Solo log cada 30 segundos para no spamear
        if (this.gameTime.getSeconds() % 30 === 0) {
            console.log('⚡ Actualizando estado del juego...', this.gameTime.toLocaleTimeString());
        }
        
        // Update character needs
        this.character.updateNeeds(1);

        // Check if character needs to change action
        if (!this.character.actionStartTime || 
            (this.gameTime.getTime() - this.character.actionStartTime.getTime()) >= 
            (this.character.actionDuration * 60000)) {
            
            // Decide new action
            const decision = this.character.decideAction(this.gameTime);
            this.executeAction(decision);
        }

        // Update task progress if working
        if (this.character.currentAction === "working" && this.currentTask) {
            this.updateTaskProgress();
        }

        // Update UI
        window.UI.updateAll();

        // Advance time by 1 minute
        this.gameTime.setMinutes(this.gameTime.getMinutes() + 1);
    },

    // Execute character action
    executeAction(decision) {
        const character = this.character;
        character.currentAction = decision.action;
        character.actionStartTime = new Date(this.gameTime);
        character.actionDuration = decision.duration;

        // Log the action
        const actionMessages = {
            working: `💻 Trabajando en: ${decision.task ? decision.task.name : 'proyecto'}`,
            sleeping: "😴 Durmiendo un poco para recuperar energía",
            eating: "🍽️ Comiendo para recuperar fuerzas",
            drinking: "🥤 Bebiendo agua",
            bathroom: "🚽 Haciendo una pausa para el baño",
            taking_break: "☕ Tomando un descanso para mejorar la concentración",
            resting: "😌 Descansando un momento",
            idle: "🤔 Pensando qué hacer a continuación"
        };

        window.UI.addLogEntry(actionMessages[decision.action] || `Realizando: ${decision.action}`, 'log-need');

        // Handle recovery
        if (decision.recovery) {
            setTimeout(() => {
                character.performRecovery(decision.action, decision.recovery);
            }, decision.duration * 1000);
        }

        // Handle work task
        if (decision.action === "working" && decision.task) {
            this.currentTask = decision.task;
        }
    },

    // Update task progress
    updateTaskProgress() {
        const character = this.character;
        const currentTask = this.project.tasks[this.project.currentTaskIndex];
        
        if (!currentTask || currentTask.progress >= 100) {
            // Move to next task
            if (this.project.currentTaskIndex < this.project.tasks.length - 1) {
                this.project.currentTaskIndex++;
                window.UI.addLogEntry(`✅ Tarea completada! Comenzando: ${this.project.tasks[this.project.currentTaskIndex].name}`, 'log-task');
            } else {
                // Project completed
                window.UI.addLogEntry(`🎉 ¡Proyecto completado! El cliente está satisfecho.`, 'log-task');
                this.stop();
            }
            return;
        }

        // Calculate progress based on productivity
        const productivity = character.calculateProductivity();
        const progressIncrease = (productivity / currentTask.duration) * (1/60); // per minute
        currentTask.progress = Math.min(100, currentTask.progress + progressIncrease);

        // Update overall project progress
        let totalProgress = 0;
        this.project.tasks.forEach(task => {
            totalProgress += task.progress / this.project.tasks.length;
        });
        this.project.progress = totalProgress;
    },

    // Pause/unpause the game
    togglePause() {
        this.isPaused = !this.isPaused;
        
        if (this.isPaused) {
            window.UI.addLogEntry('⏸️ Simulación pausada', 'log-task');
        } else {
            window.UI.addLogEntry('▶️ Simulación reanudada', 'log-task');
        }
    },

    // Stop the game
    stop() {
        this.isRunning = false;
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
            this.gameLoop = null;
        }
    },

    // Reset the game
    reset() {
        this.stop();
        this.init();
    }
};;
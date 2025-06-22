// Character Class - Autonomous Agent
window.Character = class Character {
    constructor(name, skills, traits, workHours) {
        this.name = name;
        this.skills = skills;
        this.traits = traits;
        this.workHours = workHours;
        
        // Needs (0-100)
        this.needs = {
            energy: 100,
            hunger: 100,
            thirst: 100,
            bathroom: 100,
            concentration: 100,
            motivation: 100
        };

        // Behavior state
        this.currentAction = "idle";
        this.actionStartTime = null;
        this.actionDuration = 0;
        
        // Thresholds for autonomous behavior (when to act on needs)
        this.thresholds = {
            energy: this.traits.includes("workaholic") ? 15 : 25,
            hunger: 30,
            thirst: 20,
            bathroom: 15,
            concentration: this.traits.includes("methodical") ? 20 : 35
        };
    }

    // Autonomous decision making - core of the agent behavior
    decideAction(currentTime) {
        const hour = currentTime.getHours();
        const minute = currentTime.getMinutes();
        
        // Check if it's work hours
        const workStart = parseInt(this.workHours.start.split(':')[0]);
        const workEnd = parseInt(this.workHours.end.split(':')[0]);
        const isWorkTime = hour >= workStart && hour < workEnd;

        // Priority 1: Critical needs (highest priority)
        for (let need in this.needs) {
            if (this.needs[need] <= this.thresholds[need]) {
                return this.handleCriticalNeed(need);
            }
        }

        // Priority 2: Work tasks (if work hours and has concentration)
        if (isWorkTime && this.needs.concentration > 40) {
            return this.workOnProject();
        }

        // Priority 3: Rest or maintenance activities
        if (!isWorkTime || this.needs.concentration <= 40) {
            return this.rest();
        }

        return { action: "idle", duration: 5 };
    }

    // Handle critical needs (when they fall below threshold)
    handleCriticalNeed(need) {
        const actions = {
            energy: { action: "sleeping", duration: 30, recovery: 40 },
            hunger: { action: "eating", duration: 15, recovery: 60 },
            thirst: { action: "drinking", duration: 2, recovery: 50 },
            bathroom: { action: "bathroom", duration: 3, recovery: 100 },
            concentration: { action: "taking_break", duration: 10, recovery: 30 }
        };
        return actions[need];
    }

    // Work on current project task
    workOnProject() {
        const currentTask = GameState.project.tasks[GameState.project.currentTaskIndex];
        if (!currentTask || currentTask.progress >= 100) {
            return { action: "idle", duration: 5 };
        }

        // Calculate productivity based on current state
        let productivity = this.calculateProductivity();
        
        return {
            action: "working",
            duration: 15, // Work in 15-minute chunks
            productivity: productivity,
            task: currentTask
        };
    }

    // Calculate current productivity based on needs and traits
    calculateProductivity() {
        let base = this.skills.programming * 10;
        
        // Apply needs modifiers (0-1 multiplier)
        let needsMultiplier = (
            this.needs.energy + 
            this.needs.concentration + 
            this.needs.motivation
        ) / 300;
        
        // Apply trait modifiers
        if (this.traits.includes("perfectionist")) {
            base *= 0.8; // Slower but better quality
        }
        if (this.traits.includes("workaholic")) {
            base *= 1.2; // Works longer and faster
        }
        if (this.traits.includes("methodical")) {
            base *= 1.1; // More organized, slightly more productive
        }
        if (this.traits.includes("creative")) {
            base *= 0.9; // Less consistent but more innovative
        }

        // Apply time-of-day modifiers
        const hour = window.GameState.gameTime.getHours();
        if (this.traits.includes("morning-person") && hour < 12) {
            base *= 1.2;
        } else if (this.traits.includes("night-owl") && hour > 15) {
            base *= 1.2;
        }

        return Math.max(base * needsMultiplier, 10);
    }

    // Rest when not working or low concentration
    rest() {
        return { action: "resting", duration: 10, recovery: 15 };
    }

    // Update needs over time (called every minute)
    updateNeeds(minutes) {
        // Base decay rates per minute
        const baseDecay = {
            energy: this.currentAction === "working" ? 0.8 : 0.2,
            hunger: 0.5,
            thirst: 0.7,
            bathroom: 0.3,
            concentration: this.currentAction === "working" ? 0.6 : -0.2, // Can recover during rest
            motivation: this.currentAction === "working" ? 0.1 : 0.2
        };

        // Apply trait modifiers to decay rates
        if (this.traits.includes("workaholic")) {
            baseDecay.energy *= 0.8; // Uses less energy
        }
        if (this.traits.includes("methodical")) {
            baseDecay.concentration *= 0.8; // Better focus retention
        }

        // Update each need
        for (let need in this.needs) {
            this.needs[need] -= baseDecay[need];
        }

        // Ensure values stay within bounds (0-100)
        for (let need in this.needs) {
            this.needs[need] = Math.max(0, Math.min(100, this.needs[need]));
        }
    }

    // Perform recovery actions
    performRecovery(action, amount) {
        const recoveryMap = {
            sleeping: "energy",
            eating: "hunger",
            drinking: "thirst",
            bathroom: "bathroom",
            taking_break: "concentration",
            resting: "energy"
        };

        const needToRecover = recoveryMap[action];
        if (needToRecover) {
            this.needs[needToRecover] = Math.min(100, this.needs[needToRecover] + amount);
        }

        // Some actions have additional benefits
        if (action === "resting") {
            // Resting also helps motivation
            this.needs.motivation = Math.min(100, this.needs.motivation + 5);
        }
        if (action === "eating") {
            // Eating also helps motivation slightly
            this.needs.motivation = Math.min(100, this.needs.motivation + 2);
        }
    }

    // Get current state summary
    getState() {
        return {
            name: this.name,
            currentAction: this.currentAction,
            needs: { ...this.needs },
            productivity: this.calculateProductivity()
        };
    }
};
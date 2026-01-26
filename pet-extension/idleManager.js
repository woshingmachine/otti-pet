(() => {
    const createIdleManager = (otter, {
        idleSrc,
        behaviors = [],
        probabilities = [],
        minDuration = 10000,  // 10 seconds min
        maxDuration = 30000,  // 30 seconds max
        idleWaitTime = 5000,  // 5 seconds of idle before cycling behaviors
    } = {}) => {
        let behaviorTimer = null;
        let currentBehavior = null;
        let isActive = false;

        const getRandomDuration = () => {
            return Math.random() * (maxDuration - minDuration) + minDuration;
        };

        const stopCurrentBehavior = () => {
            if (currentBehavior) {
                currentBehavior.stop();
                currentBehavior = null;
            }
            if (idleSrc) otter.src = idleSrc;
        };

        const pickRandomBehavior = () => {
            if (!behaviors.length) return null;
            
            const totalWeight = probabilities.reduce((sum, p) => sum + p, 0);
            let random = Math.random() * totalWeight;
            
            for (let i = 0; i < behaviors.length; i++) {
                random -= probabilities[i];
                if (random <= 0) return behaviors[i];
            }
            
            return behaviors[behaviors.length - 1];
        };

        const cycleBehaviors = () => {
            if (!isActive) return;

            stopCurrentBehavior();
            currentBehavior = pickRandomBehavior();
            if (currentBehavior) {
                currentBehavior.start();
            }

            const duration = getRandomDuration();
            behaviorTimer = setTimeout(() => {
                stopCurrentBehavior();
                cycleBehaviors();
            }, duration);
        };

        const resetIdleTimer = () => {
            isActive = false;
            if (behaviorTimer) clearTimeout(behaviorTimer);
            stopCurrentBehavior();
        };

        const startIdling = () => {
            if (isActive) return;
            isActive = true;
            stopCurrentBehavior();
            // Show idle image briefly, then start cycling behaviors
            behaviorTimer = setTimeout(cycleBehaviors, idleWaitTime);
        };

        const teardown = () => {
            if (behaviorTimer) clearTimeout(behaviorTimer);
            stopCurrentBehavior();
        };

        return { resetIdleTimer, stopCurrentBehavior, startIdling, teardown };
    };

    window.OtterIdleManager = {
        createIdleManager,
    };
})();

(() => {
    const { TIMINGS } = window.OtterConfig;

    const createIdleManager = (otter, {
        idleSrc,
        behaviors = [],
        probabilities = [],
        minDuration = TIMINGS.minIdleDuration,
        maxDuration = TIMINGS.maxIdleDuration,
        idleWaitTime = TIMINGS.idleWaitTime,
    } = {}) => {
        let behaviorTimer = null;
        let currentBehavior = null;
        let isActive = false;
        let idleTransitionTimer = null;

        const clearIdleTransitionTimer = () => {
            if (!idleTransitionTimer) return;
            clearTimeout(idleTransitionTimer);
            idleTransitionTimer = null;
        };

        const getRandomDuration = () => {
            return Math.random() * (maxDuration - minDuration) + minDuration;
        };

        const stopCurrentBehavior = () => {
            clearIdleTransitionTimer();
            let stopAnimationDuration = 0;

            if (currentBehavior) {
                if (typeof currentBehavior.getStopAnimationDuration === 'function') {
                    stopAnimationDuration = currentBehavior.getStopAnimationDuration();
                }
                currentBehavior.stop();
                currentBehavior = null;
            }

            if (!idleSrc) return;
            if (stopAnimationDuration <= 0) {
                otter.src = idleSrc;
                return;
            }

            idleTransitionTimer = setTimeout(() => {
                idleTransitionTimer = null;
                // Only apply idle if idling is active and no new behavior has started.
                if (isActive && !currentBehavior) otter.src = idleSrc;
            }, stopAnimationDuration);

            return stopAnimationDuration;
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

            const stopDelay = stopCurrentBehavior();

            const startNextBehavior = () => {
                if (!isActive) return;

                currentBehavior = pickRandomBehavior();
                if (currentBehavior) {
                    currentBehavior.start();
                }

                const duration = getRandomDuration();
                behaviorTimer = setTimeout(() => {
                    cycleBehaviors();
                }, duration);
            };

            if (stopDelay > 0) {
                behaviorTimer = setTimeout(startNextBehavior, stopDelay);
                return;
            }

            startNextBehavior();
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
            clearIdleTransitionTimer();
            stopCurrentBehavior();
        };

        return { resetIdleTimer, stopCurrentBehavior, startIdling, teardown };
    };

    window.OtterIdleManager = {
        createIdleManager,
    };
})();

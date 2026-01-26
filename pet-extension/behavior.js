(() => {
    const clampPosition = (otter, left, top) => {
        const maxLeft = Math.max(0, window.innerWidth - otter.offsetWidth);
        const maxTop = Math.max(0, window.innerHeight - otter.offsetHeight);
        return {
            left: Math.min(Math.max(0, left), maxLeft),
            top: Math.min(Math.max(0, top), maxTop)
        };
    };

    const applyPosition = (otter, { left, top }) => {
        otter.style.left = left + 'px';
        otter.style.top = top + 'px';
        otter.style.bottom = '';
        otter.style.right = '';
    };

    const savePosition = (otter, key) => {
        const rect = otter.getBoundingClientRect();
        const { left, top } = clampPosition(otter, rect.left, rect.top);
        localStorage.setItem(key, JSON.stringify({ left, top }));
        applyPosition(otter, { left, top });
    };

    const applySavedPosition = (otter, key) => {
        const saved = localStorage.getItem(key);
        if (!saved) return;
        try {
            const parsed = JSON.parse(saved);
            if (typeof parsed.left === 'number' && typeof parsed.top === 'number') {
                const { left, top } = clampPosition(otter, parsed.left, parsed.top);
                applyPosition(otter, { left, top });
            }
        } catch (_) {
            /* ignore invalid persisted position */
        }
    };

    const createWalker = (otter, {
        clampPositionFn = clampPosition,
        applyPositionFn = applyPosition,
        idleTimeout = 5000,
        walkInterval = null, // if null, use CSS transition duration for continuous motion
        walkDistance = 800,
        idleSrc,
        boredSrc,
    } = {}) => {
        let isWalking = false;
        let walkTimeoutId = null;
        let idleTimer = null;

        const getTransitionMs = () => {
            const dur = getComputedStyle(otter).transitionDuration.split(',')[0]?.trim() || '0s';
            if (dur.endsWith('ms')) return parseFloat(dur);
            if (dur.endsWith('s')) return parseFloat(dur) * 1000;
            const n = Number(dur);
            return Number.isFinite(n) ? n : 0;
        };

        const scheduleNext = () => {
            const delay = walkInterval ?? getTransitionMs();
            // If no transition duration is set, fall back to a gentle cadence
            const effectiveDelay = delay && delay > 0 ? delay : 2000;
            walkTimeoutId = setTimeout(() => {
                step();
                scheduleNext();
            }, effectiveDelay);
        };

        const step = () => {
            const rect = otter.getBoundingClientRect();
            // Pick a random destination up to walkDistance pixels away
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * walkDistance;
            const randomX = Math.cos(angle) * distance;
            const randomY = Math.sin(angle) * distance;
            const newLeft = rect.left + randomX;
            const newTop = rect.top + randomY;
            const { left, top } = clampPositionFn(otter, newLeft, newTop);
            applyPositionFn(otter, { left, top });
        };

        const startWalking = () => {
            if (isWalking) return;
            isWalking = true;
            if (boredSrc) otter.src = boredSrc;
            step(); // move immediately
            scheduleNext(); // keep moving continuously
        };

        const stopWalking = () => {
            if (!isWalking) return;
            isWalking = false;
            if (idleSrc) otter.src = idleSrc;
            if (walkTimeoutId) {
                clearTimeout(walkTimeoutId);
                walkTimeoutId = null;
            }
        };

        const resetIdleTimer = () => {
            stopWalking();
            if (idleTimer) clearTimeout(idleTimer);
            idleTimer = setTimeout(startWalking, idleTimeout);
        };

        const teardown = () => {
            if (idleTimer) clearTimeout(idleTimer);
            stopWalking();
        };

        return { startWalking, stopWalking, resetIdleTimer, teardown };
    };

    window.OtterBehavior = {
        clampPosition,
        applyPosition,
        savePosition,
        applySavedPosition,
        createWalker,
    };
})();

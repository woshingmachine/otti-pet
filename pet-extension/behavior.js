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
        walkInterval = 5000,
        walkDistance = 800,
        idleSrc,
        boredSrc,
    } = {}) => {
        let isWalking = false;
        let walkIntervalId = null;
        let idleTimer = null;

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
            walkIntervalId = setInterval(step, walkInterval);
        };

        const stopWalking = () => {
            if (!isWalking) return;
            isWalking = false;
            if (idleSrc) otter.src = idleSrc;
            if (walkIntervalId) {
                clearInterval(walkIntervalId);
                walkIntervalId = null;
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

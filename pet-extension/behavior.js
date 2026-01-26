(() => {
    const { TIMINGS } = window.OtterConfig;
    const MAD_DURATION = TIMINGS.madDuration;

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
        walkInterval = null, // if null, use CSS transition duration for continuous motion
        walkDistance = 800,
        walkSrc,
    } = {}) => {
        let isWalking = false;
        let walkTimeoutId = null;

        const getTransitionMs = () => {
            const dur = getComputedStyle(otter).transitionDuration.split(',')[0]?.trim() || '0s';
            if (dur.endsWith('ms')) return parseFloat(dur);
            if (dur.endsWith('s')) return parseFloat(dur) * 1000;
            const n = Number(dur);
            return Number.isFinite(n) ? n : 0;
        };

        const scheduleNext = () => {
            const delay = walkInterval ?? getTransitionMs();
            const effectiveDelay = delay && delay > 0 ? delay : 2000;
            walkTimeoutId = setTimeout(() => {
                step();
                scheduleNext();
            }, effectiveDelay);
        };

        const step = () => {
            if (!isWalking) return; // Only move if actively walking
            const rect = otter.getBoundingClientRect();
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * walkDistance;
            const randomX = Math.cos(angle) * distance;
            const randomY = Math.sin(angle) * distance;
            const newLeft = rect.left + randomX;
            const newTop = rect.top + randomY;
            const { left, top } = clampPositionFn(otter, newLeft, newTop);
            applyPositionFn(otter, { left, top });
        };

        const start = () => {
            if (isWalking) return;
            isWalking = true;
            if (walkSrc) otter.src = walkSrc;
            step();
            scheduleNext();
        };

        const stop = () => {
            if (!isWalking) return;
            isWalking = false;
            if (walkTimeoutId) {
                clearTimeout(walkTimeoutId);
                walkTimeoutId = null;
            }
        };

        return { start, stop, isActive: () => isWalking };
    };

    const createSleeper = (otter, { sleepSrc } = {}) => {
        let isSleeping = false;

        const start = () => {
            if (isSleeping) return;
            isSleeping = true;
            if (sleepSrc) otter.src = sleepSrc;
        };

        const stop = () => {
            if (!isSleeping) return;
            isSleeping = false;
        };

        return { start, stop, isActive: () => isSleeping };
    };

    const createDancer = (otter, { danceSrc } = {}) => {
        let isDancing = false;

        const start = () => {
            if (isDancing) return;
            isDancing = true;
            if (danceSrc) otter.src = danceSrc;
        };

        const stop = () => {
            if (!isDancing) return;
            isDancing = false;
        };

        return { start, stop, isActive: () => isDancing };
    };

    const createMad = (otter, { madSrc, idleSrc, onEnd } = {}) => {
        let madTimeoutId = null;

        const start = () => {
            if (madSrc) otter.src = madSrc;
            // Auto-end mad state after duration
            madTimeoutId = setTimeout(() => {
                stop();
                if (onEnd) onEnd();
            }, MAD_DURATION);
        };

        const stop = () => {
            if (madTimeoutId) clearTimeout(madTimeoutId);
            if (idleSrc) otter.src = idleSrc;
        };

        return { start, stop };
    };

    const createDrag = (otter, {
        clampPositionFn,
        applyPositionFn,
        savePositionFn,
        resetIdleTimer,
        isEnabled = () => true,
        onStart,
        onEnd,
    }) => {
        let isDragging = false;
        let offsetX = 0;
        let offsetY = 0;

        const clearSelection = () => {
            const sel = window.getSelection();
            if (sel) sel.removeAllRanges();
        };

        const setDragging = (active) => {
            isDragging = active;
            otter.classList.toggle('dragging', active);
            if (!active) clearSelection();
        };

        const onMouseDown = (e) => {
            if (!isEnabled()) return; // Don't drag if disabled
            
            // Freeze position to the current visual spot to avoid jump
            const rect = otter.getBoundingClientRect();
            applyPositionFn(otter, { left: rect.left, top: rect.top });

            setDragging(true);
            if (resetIdleTimer) resetIdleTimer();
            if (onStart) onStart();

            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
        };

        const onMouseMove = (e) => {
            if (!isDragging) return;
            const { left, top } = clampPositionFn(otter, e.clientX - offsetX, e.clientY - offsetY);
            applyPositionFn(otter, { left, top });
        };

        const endDrag = () => {
            if (!isDragging) return;
            setDragging(false);
            if (onEnd) onEnd();
            if (savePositionFn) savePositionFn();
        };

        const addListeners = () => {
            otter.addEventListener('dragstart', (e) => e.preventDefault());
            otter.addEventListener('mousedown', onMouseDown);
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', endDrag);
            window.addEventListener('blur', endDrag);
        };

        const removeListeners = () => {
            otter.removeEventListener('mousedown', onMouseDown);
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', endDrag);
            window.removeEventListener('blur', endDrag);
        };

        return { addListeners, removeListeners };
    };

    window.OtterBehavior = {
        clampPosition,
        applyPosition,
        savePosition,
        applySavedPosition,
        createWalker,
        createSleeper,
        createDancer,
        createMad,
        createDrag,
    };
})();

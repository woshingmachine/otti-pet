if (!document.getElementById("typing-otter")) {
    const { 
        ASSETS, 
        STORAGE_KEYS, 
        BEHAVIOR_WEIGHTS, 
        THRESHOLDS,
        TIMINGS,
        DOM_CONFIG,
    } = window.OtterConfig;

    // Create otter element
    const otter = document.createElement("img");
    otter.src = chrome.runtime.getURL(ASSETS.idle);
    otter.id = DOM_CONFIG.elementId;
    otter.draggable = DOM_CONFIG.draggable;
    document.body.appendChild(otter);

    // State management
    let dragCount = 0;
    const dragThreshold = Math.floor(Math.random() * (THRESHOLDS.madTrigger[1] - THRESHOLDS.madTrigger[0] + 1)) + THRESHOLDS.madTrigger[0];
    let isMad = false;
    let isDragging = false;
    let pickupTimeoutId = null;

    const pickupIntroSrc = chrome.runtime.getURL(ASSETS.pickupIntro);
    const pickupHoldSrc = chrome.runtime.getURL(ASSETS.pickupHold);
    const pickupReleaseSrc = chrome.runtime.getURL(ASSETS.pickupRelease);
    const idleSrc = chrome.runtime.getURL(ASSETS.idle);

    const clearPickupTimeout = () => {
        if (!pickupTimeoutId) return;
        clearTimeout(pickupTimeoutId);
        pickupTimeoutId = null;
    };

    const playPickupAnimation = (src, onComplete) => {
        clearPickupTimeout();
        otter.src = src;
        pickupTimeoutId = setTimeout(() => {
            pickupTimeoutId = null;
            if (onComplete) onComplete();
        }, TIMINGS.pickupIntroDuration);
    };

    // Import behavior factories
    const { 
        clampPosition, 
        applyPosition, 
        savePosition, 
        applySavedPosition, 
        createWalker,
        createSleeper,
        createDancer,
        createMad,
        createDrag,
    } = window.OtterBehavior;
    const { createIdleManager } = window.OtterIdleManager;

    // Create behaviors
    const walker = createWalker(otter, {
        clampPositionFn: clampPosition,
        applyPositionFn: applyPosition,
        walkDistance: 200,
        walkSrc: chrome.runtime.getURL(ASSETS.walk),
    });

    const sleeper = createSleeper(otter, {
        sleepSrc: chrome.runtime.getURL(ASSETS.sleep),
    });

    const dancer = createDancer(otter, {
        danceSrc: chrome.runtime.getURL(ASSETS.dance),
    });

    const madder = createMad(otter, {
        madSrc: chrome.runtime.getURL(ASSETS.mad),
        idleSrc,
        onEnd: () => {
            isMad = false;
            idleManager.startIdling();
        },
    });

    // Create idle manager
    const idleManager = createIdleManager(otter, {
        idleSrc: chrome.runtime.getURL(ASSETS.idle),
        behaviors: [walker, sleeper, dancer],
        probabilities: [BEHAVIOR_WEIGHTS.walk, BEHAVIOR_WEIGHTS.sleep, BEHAVIOR_WEIGHTS.dance],
    });

    // Create drag handler
    const drag = createDrag(otter, {
        clampPositionFn: clampPosition,
        applyPositionFn: applyPosition,
        savePositionFn: () => savePosition(otter, STORAGE_KEYS.position),
        resetIdleTimer: idleManager.resetIdleTimer,
        isEnabled: () => !isMad,
        onStart: () => {
            idleManager.stopCurrentBehavior();
            isDragging = true;
            playPickupAnimation(pickupIntroSrc, () => {
                if (isDragging) otter.src = pickupHoldSrc;
            });
        },
        onEnd: () => {
            isDragging = false;
            playPickupAnimation(pickupReleaseSrc, () => {
                dragCount++;
                if (dragCount >= dragThreshold) {
                    isMad = true;
                    madder.start();
                    dragCount = 0;
                } else {
                    otter.src = idleSrc;
                    idleManager.startIdling();
                }
            });
        },
    });

    // Handle viewport resize
    const onResize = () => {
        const rect = otter.getBoundingClientRect();
        const { left, top } = clampPosition(otter, rect.left, rect.top);
        applyPosition(otter, { left, top });
        savePosition(otter, STORAGE_KEYS.position);
    };
    window.addEventListener('resize', onResize);

    // Initialize
    const init = () => {
        applySavedPosition(otter, STORAGE_KEYS.position);
        drag.addListeners();
        idleManager.startIdling();
    };

    if (otter.complete) {
        init();
    } else {
        otter.addEventListener('load', init, { once: true });
    }
}
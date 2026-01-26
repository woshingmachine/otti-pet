if (!document.getElementById("typing-otter")) {
    const otter = document.createElement("img");
    const idleSrc = chrome.runtime.getURL("assets/otter.gif");
    const walkSrc = chrome.runtime.getURL("assets/bored-otter.png"); // TODO: add walking animation
    const sleepSrc = chrome.runtime.getURL("assets/sleeping-otter.gif");
    const danceSrc = chrome.runtime.getURL("assets/dancing-otter.gif");
    const pickupSrc = chrome.runtime.getURL("assets/pickup-otter.png");
    otter.src = idleSrc;
    otter.id = "typing-otter";
    otter.draggable = false; // avoid native image drag
    document.body.appendChild(otter);

    const POS_KEY = 'typing-otter-pos';

    const { 
        clampPosition, 
        applyPosition, 
        savePosition, 
        applySavedPosition, 
        createWalker,
        createSleeper,
        createDancer,
    } = window.OtterBehavior;
    const { createIdleManager } = window.OtterIdleManager;
    const { createDrag } = window.OtterDrag;

    const walker = createWalker(otter, {
        clampPositionFn: clampPosition,
        applyPositionFn: applyPosition,
        walkInterval: null,
        walkDistance: 200,
        walkSrc,
    });

    const sleeper = createSleeper(otter, { sleepSrc });
    const dancer = createDancer(otter, { danceSrc });

    const idleManager = createIdleManager(otter, {
        idleSrc,
        behaviors: [walker, sleeper, dancer],
        probabilities: [0.4, 0.3, 0.3], // 40% walk, 30% sleep, 30% dance
    });

    const drag = createDrag(otter, {
        clampPositionFn: clampPosition,
        applyPositionFn: applyPosition,
        savePositionFn: () => savePosition(otter, POS_KEY),
        resetIdleTimer: idleManager.resetIdleTimer,
        onStart: () => {
            idleManager.stopCurrentBehavior();
            if (pickupSrc) otter.src = pickupSrc;
        },
        onEnd: () => {
            otter.src = idleSrc;
            idleManager.startIdling();
        },
    });

    const onResize = () => {
        const rect = otter.getBoundingClientRect();
        const { left, top } = clampPosition(otter, rect.left, rect.top);
        applyPosition(otter, { left, top });
        localStorage.setItem(POS_KEY, JSON.stringify({ left, top }));
    };

    window.addEventListener('resize', onResize);

    const init = () => {
        applySavedPosition(otter, POS_KEY);
        drag.addListeners();
        idleManager.startIdling();
    };

    if (otter.complete) {
        init();
    } else {
        otter.addEventListener('load', init, { once: true });
    }
}
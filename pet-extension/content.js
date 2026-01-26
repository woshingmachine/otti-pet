if (!document.getElementById("typing-otter")) {
    const otter = document.createElement("img");
    const idleSrc = chrome.runtime.getURL("otter.png");
    const boredSrc = chrome.runtime.getURL("bored-otter.png");
    otter.src = idleSrc;
    otter.id = "typing-otter";
    otter.draggable = false; // avoid native image drag
    document.body.appendChild(otter);

    const POS_KEY = 'typing-otter-pos';

    const { clampPosition, applyPosition, savePosition, applySavedPosition, createWalker } = window.OtterBehavior;
    const { createDrag } = window.OtterDrag;

    const walker = createWalker(otter, {
        clampPositionFn: clampPosition,
        applyPositionFn: applyPosition,
        idleTimeout: 5000,
        walkInterval: 5000,
        walkDistance: 800,
        idleSrc,
        boredSrc,
    });

    const drag = createDrag(otter, {
        clampPositionFn: clampPosition,
        applyPositionFn: applyPosition,
        savePositionFn: () => savePosition(otter, POS_KEY),
        resetIdleTimer: walker.resetIdleTimer,
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
        walker.resetIdleTimer();
    };

    if (otter.complete) {
        init();
    } else {
        otter.addEventListener('load', init, { once: true });
    }
}
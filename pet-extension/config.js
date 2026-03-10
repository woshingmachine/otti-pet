(() => {
    // Asset URLs
    const ASSETS = {
        idle: 'assets/otter.gif',
        walk: 'assets/bored-otter.png',
        sleep: 'assets/sleeping-otter.gif',
        dance: 'assets/dancing-otter.gif',
        pickupIntro: 'assets/otter-pickup1.gif',
        pickupHold: 'assets/otter-pickup2.gif',
        pickupRelease: 'assets/otter-pickup1-reverse.gif',
        mad: 'assets/mad-otter.gif',
    };

    // Storage keys
    const STORAGE_KEYS = {
        position: 'typing-otter-pos',
    };

    // Behavior timings (milliseconds)
    const TIMINGS = {
        minIdleDuration: 10000,   // 10 seconds min
        maxIdleDuration: 30000,   // 30 seconds max
        idleWaitTime: 5000,       // 5 seconds idle before behavior cycles
        madDuration: 10000,       // 10 seconds mad state
        pickupIntroDuration: 450, // Single cycle for 3-frame pickup intro GIF
    };

    // Behavior probabilities
    const BEHAVIOR_WEIGHTS = {
        walk: 0.4,   // 40% chance to walk
        sleep: 0.3,  // 30% chance to sleep
        dance: 0.3,  // 30% chance to dance
    };

    // Otter behavior thresholds
    const THRESHOLDS = {
        madTrigger: [3, 5], // Random between 3-5 drags to trigger mad
    };

    // DOM element configuration
    const DOM_CONFIG = {
        elementId: 'typing-otter',
        draggable: false,
        zIndex: '2147483647',
    };

    window.OtterConfig = {
        ASSETS,
        STORAGE_KEYS,
        TIMINGS,
        BEHAVIOR_WEIGHTS,
        THRESHOLDS,
        DOM_CONFIG,
    };
})();

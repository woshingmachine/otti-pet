(() => {
    // Asset URLs
    const ASSETS = {
        idle: 'assets/otter.gif',
        walk: 'assets/bored-otter.png',
        sleepIntro: 'assets/sleepy-otter-intro.gif',
        sleep: 'assets/sleeping-otter.gif',
        sleepEnd: 'assets/sleepy-otter-end.gif',
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
        minIdleDuration: 40000,   // 40 seconds min
        maxIdleDuration: 100000,   // 100 seconds max
        idleWaitTime: 5000,       // 5 seconds idle before behavior cycles
        madDuration: 10000,       // 10 seconds mad state
        pickupIntroDuration: 450, // Single cycle for 3-frame pickup intro GIF
        sleepIntroDuration: 13000, // Full duration of sleepy-otter-intro.gif
        sleepEndDuration: 13000,   // Full duration of sleepy-otter-end.gif
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

if (!document.getElementById("typing-otter")) {
    const otter = document.createElement("img");
    otter.src = chrome.runtime.getURL("otter.png");
    otter.id = "typing-otter";
    otter.draggable = false; // avoid native image drag
    document.body.appendChild(otter);

    const POS_KEY = 'typing-otter-pos';

    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    const clampPosition = (left, top) => {
        const maxLeft = Math.max(0, window.innerWidth - otter.offsetWidth);
        const maxTop = Math.max(0, window.innerHeight - otter.offsetHeight);
        return {
            left: Math.min(Math.max(0, left), maxLeft),
            top: Math.min(Math.max(0, top), maxTop)
        };
    };

    const applyPosition = ({ left, top }) => {
        otter.style.left = left + 'px';
        otter.style.top = top + 'px';
        otter.style.bottom = '';
        otter.style.right = '';
    };

    const savePosition = () => {
        const rect = otter.getBoundingClientRect();
        const { left, top } = clampPosition(rect.left, rect.top);
        localStorage.setItem(POS_KEY, JSON.stringify({ left, top }));
        applyPosition({ left, top });
    };

    const applySavedPosition = () => {
        const saved = localStorage.getItem(POS_KEY);
        if (!saved) return;
        try {
            const parsed = JSON.parse(saved);
            if (typeof parsed.left === 'number' && typeof parsed.top === 'number') {
                const { left, top } = clampPosition(parsed.left, parsed.top);
                applyPosition({ left, top });
            }
        } catch (_) {
            /* ignore invalid persisted position */
        }
    };

    // Start dragging when user clicks and holds
    otter.addEventListener('dragstart', (e) => e.preventDefault());

    const clearSelection = () => {
        const sel = window.getSelection();
        if (sel) sel.removeAllRanges();
    };

    const setDragging = (active) => {
        isDragging = active;
        otter.classList.toggle('dragging', active);
        if (!active) clearSelection();
    };

    otter.addEventListener('mousedown', (e) => {
        setDragging(true);
        offsetX = e.clientX - otter.getBoundingClientRect().left;
        offsetY = e.clientY - otter.getBoundingClientRect().top;
    });

    // Move the otter only if isDragging
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        const { left, top } = clampPosition(e.clientX - offsetX, e.clientY - offsetY);
        applyPosition({ left, top });
    });

    const endDrag = () => {
        if (!isDragging) return;
        setDragging(false);
        savePosition();
    };

    document.addEventListener('mouseup', endDrag);
    window.addEventListener('blur', endDrag); // safety if mouse leaves window

    const onResize = () => {
        const rect = otter.getBoundingClientRect();
        const { left, top } = clampPosition(rect.left, rect.top);
        applyPosition({ left, top });
        localStorage.setItem(POS_KEY, JSON.stringify({ left, top }));
    };

    window.addEventListener('resize', onResize);

    if (otter.complete) {
        applySavedPosition();
    } else {
        otter.addEventListener('load', applySavedPosition, { once: true });
    }
}
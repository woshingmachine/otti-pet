(() => {
    const createDrag = (otter, {
        clampPositionFn,
        applyPositionFn,
        savePositionFn,
        resetIdleTimer,
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

    window.OtterDrag = { createDrag };
})();

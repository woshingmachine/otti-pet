# otti-pet

A cute otter companion that sits on your browser and keeps you company while you browse!

## Features

- **Otter Overlay** - A friendly otter appears on every webpage
- **Draggable** - Click and drag your otter anywhere on the page
- **Remembers Position** - Stays where you left it, even after refresh
- **Smart Positioning** - Keeps within the viewport on resize
- **Idle Behaviors** - After 5 seconds shows idle image, then cycles through random behaviors:
  - **Walking** - Moves around the screen smoothly (40% chance)
  - **Sleeping** - Stays still and sleeps (30% chance)
  - **Dancing** - Dances in place (30% chance)
  - Each behavior lasts 10-30 seconds before switching
- **Adjustable** - Tweak probabilities, durations, and idle wait times in `content.js`
- **Non-intrusive** - Designed to stay out of your way

## Installation

### Loading as an Unpacked Extension (Chrome/Edge)

1. Clone or download this repository
2. Open Chrome/Edge and navigate to `chrome://extensions/` (or `edge://extensions/`)
3. Enable **Developer mode** (toggle in the top-right corner)
4. Click **Load unpacked**
5. Select the `pet-extension` folder from this project
6. Add your otter images to `pet-extension/assets/`:
   - `otter.gif` (idle state)
   - `bored-otter.png` (walking)
   - `sleeping-otter.gif` (sleeping)
   - `dancing-otter.gif` (dancing)
   - `pickup-otter.png` (when dragging)
7. Your otter should now appear on every webpage

## Usage

- **Move your otter**: Click and drag anywhere on the page
- **Idle behavior**: After 5 seconds of no interaction, the otter shows idle image, then randomly walks, sleeps, or dances for 10-30 seconds each
- **Position is saved**: Remembers where you left it per site
- **Resize friendly**: Stays within bounds if you resize the window

## Configuration

In `content.js`, adjust:
- `probabilities`: `[0.4, 0.3, 0.3]` - Change walk, sleep, dance odds
- `minDuration` / `maxDuration` (in `idleManager.js` defaults) - Behavior duration range
- `idleWaitTime` (in `idleManager.js` defaults) - Seconds before first behavior starts

## Project Structure

```
pet-extension/
├── assets/
│   ├── otter.gif
│   ├── bored-otter.png
│   ├── sleeping-otter.gif
│   ├── dancing-otter.gif
│   └── pickup-otter.png
├── behavior.js       # Behavior factories (walk, sleep, dance)
├── drag.js           # Drag handling
├── idleManager.js    # Idle behavior coordination
├── content.js        # Entry point, orchestrates all modules
├── manifest.json     # Extension configuration
└── pet.css           # Styling and transitions
```

## Development Status

Core features complete: draggable overlay, position persistence, and randomized idle behavior cycling.

## Future Plans

- Typing detection (otter reacts when you type)
- More animations and behaviors
- Customizable probabilities/durations via UI
- Interactive behaviors
- Typing animations

---

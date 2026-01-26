# otti-pet

A cute otter companion that sits on your browser and keeps you company while you browse!

## Features

- **Otter Overlay** - A friendly otter appears on every webpage
- **Draggable** - Click and drag your otter anywhere on the page (no jump while dragging)
- **Remembers Position** - Stays where you left it, even after refresh
- **Smart Positioning** - Keeps within the viewport on resize
- **Idle Wander** - After 5s of inactivity it swaps to a bored otter and wanders smoothly around the screen, moving immediately on idle and then every few seconds
- **Non-intrusive** - Designed to stay out of your way

## Installation

### Loading as an Unpacked Extension (Chrome/Edge)

1. Clone or download this repository
2. Open Chrome/Edge and navigate to `chrome://extensions/` (or `edge://extensions/`)
3. Enable **Developer mode** (toggle in the top-right corner)
4. Click **Load unpacked**
5. Select the `pet-extension` folder from this project
6. Ensure `bored-otter.png` is present in `pet-extension` (required for idle wander image)
7. Your otter should now appear on every webpage

## Usage

- **Move your otter**: Click and drag anywhere on the page; dragging cancels walking
- **Idle wander**: After 5 seconds of no interaction it turns bored and starts walking immediately, then keeps strolling on an interval
- **Position is saved**: Remembers where you left it per site
- **Resize friendly**: Stays within bounds if you resize the window

## Project Structure
pet-extension/
├── behavior.js     # Position helpers, persistence, idle/walk behavior
├── drag.js         # Drag handling (no jump on grab)
├── content.js      # Entry point wiring behavior + drag
├── manifest.json   # Extension configuration
├── pet.css         # Styling and smooth movement transitions
├── otter.png       # Default otter image
└── bored-otter.png # Bored state image used when wandering

## Development Status

Iterative build: draggable pet overlay, idle wander with bored image, and position persistence are implemented. More animations and behaviors to come.

## Future Plans

- Different otter animations
- Interactive behaviors
- Typing animations

---

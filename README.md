# otti-pet

A cute otter companion that sits on your browser and keeps you company while you browse!

## Features

- **Otter Overlay** - A friendly otter appears on every webpage
- **Draggable** - Click and drag your otter anywhere on the page
- **Remembers Position** - Your otter stays where you left it, even after refreshing
- **Smart Positioning** - Automatically adjusts when you resize your browser window
- **Non-intrusive** - The otter won't interfere with page interactions

## Installation

### Loading as an Unpacked Extension (Chrome/Edge)

1. Clone or download this repository
2. Open Chrome/Edge and navigate to `chrome://extensions/` (or `edge://extensions/`)
3. Enable **Developer mode** (toggle in the top-right corner)
4. Click **Load unpacked**
5. Select the `pet-extension` folder from this project
6. Your otter should now appear on every webpage

## Usage

- **Move your otter**: Click and drag it to any position on the page
- **Position is saved**: Your otter will remember where you placed it on each site
- **Resize friendly**: The otter automatically stays within bounds when you resize the window

## Project Structure
pet-extension/
├── content.js # Main logic for otter behavior and dragging
├── manifest.json # Extension configuration
├── pet.css # Styling for the otter overlay
└── otter.png # The otter image

## Development Status

This is an iterative build - currently featuring the visual overlay with dragging functionality. More features coming soon!

## Future Plans

- Different otter animations
- Interactive behaviors
- Customization options
- Multiple pet options

---

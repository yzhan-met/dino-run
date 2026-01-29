# dino-run

A fun and educational web-based Dino Run game designed to help kids learn keyboard typing! 🦕

## Features

- **Interactive Learning**: Kids learn to identify and type different keyboard keys
- **Random Key Changes**: The jump key randomly changes after each obstacle to teach all keys
- **Clear Visual Feedback**: Large, clear display of the current required key in the center of the screen
- **Score Tracking**: Keep track of your current score and high score (saved in browser)
- **Kid-Friendly Design**: Colorful graphics and simple gameplay perfect for children
- **Progressive Challenge**: Navigate the dino through increasingly challenging obstacles

## How to Play

1. Open `index.html` in your web browser
2. Press the **SPACE** key to start the game
3. Watch the key displayed in the center of the screen
4. Press the displayed key to make the dino jump over obstacles
5. Each time you pass an obstacle:
   - Your score increases
   - The jump key changes to a new random key
   - Learn a new keyboard key!

## Supported Keys

The game uses a variety of keys to help kids learn the keyboard:
- **Space bar**
- **Letters**: A-Z
- **Numbers**: 0-9

## Technical Details

- Pure HTML5, CSS3, and JavaScript
- Canvas-based rendering for smooth gameplay
- No external dependencies required
- LocalStorage for persistent high scores
- Accessible with ARIA labels for screen readers

## Running the Game

### Option 1: Open Directly
Simply open `index.html` in any modern web browser.

### Option 2: Local Server (Recommended)
For best results, run a local server:

```bash
# Using Python 3
python3 -m http.server 8080

# Using Node.js (http-server)
npx http-server -p 8080
```

Then navigate to `http://localhost:8080` in your browser.

## Educational Value

This game helps children:
- Learn keyboard key locations
- Develop hand-eye coordination
- Practice quick key recognition
- Build typing confidence
- Have fun while learning!

## Browser Compatibility

Works in all modern browsers that support:
- HTML5 Canvas
- ES6 JavaScript
- LocalStorage

## License

See [LICENSE](LICENSE) file for details.

## Contributing

Feel free to fork this project and submit pull requests with improvements!

---

Made with ❤️ for kids learning to type!

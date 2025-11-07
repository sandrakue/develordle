# Develordle Project Structure Guide

## Overview
This project uses the HTML5 UP "Hyperspace" template as a base, modified to include a custom Wordle game. This follows standard web development best practices.

## File Structure Explained

```
develordle/
├── index.html              # Main HTML file (entry point)
├── elements.html           # Template examples (not used in game)
├── generic.html            # Template examples (not used in game)
├── LICENSE.txt             # Software license
├── README.txt              # Original template readme
├── package-lock.json       # NPM dependency lock file
│
├── assets/                 # All static assets (CSS, JS, fonts, images)
│   ├── css/               # Stylesheets
│   │   ├── main.css       # Main compiled CSS (from SASS)
│   │   ├── noscript.css   # CSS for users with JS disabled
│   │   └── fontawesome-all.min.css  # Icon fonts
│   │
│   ├── js/                # JavaScript files
│   │   ├── main.js        # Template functionality (sidebar, scrolling)
│   │   ├── wordle.js      # YOUR GAME LOGIC (custom file)
│   │   ├── jquery.min.js  # jQuery library
│   │   ├── browser.min.js # Browser detection
│   │   ├── breakpoints.min.js  # Responsive breakpoints
│   │   ├── util.js        # Utility functions
│   │   └── jquery.scrollex.min.js  # Scroll effects
│   │
│   ├── sass/              # SASS source files (for CSS)
│   │   └── (various .scss files)
│   │
│   └── webfonts/          # Font files for icons
│       └── (various font files)
│
└── images/                # Image assets
    └── pic01.jpg - pic06.jpg
```

## Key Files Explained

### index.html
- **Purpose**: Main entry point of your website
- **What it does**: Defines the HTML structure, includes all CSS/JS files
- **Contains**: Game board, sidebar navigation, about sections
- **Best Practice**: One main HTML file per page is standard

### assets/js/wordle.js (YOUR CODE)
- **Purpose**: Contains all your custom Wordle game logic
- **What it does**: 
  - Manages game state
  - Handles user input
  - Checks guesses
  - Updates the UI
- **Best Practice**: Keeping game logic separate from template code is EXCELLENT practice

### assets/js/main.js (TEMPLATE CODE)
- **Purpose**: Handles the HTML5 UP template functionality
- **What it does**:
  - Sidebar smooth scrolling
  - Responsive navigation
  - Section animations on scroll
  - Image spotlight effects
- **Best Practice**: Don't modify this unless changing template behavior

### assets/css/main.css (GENERATED FILE)
- **Purpose**: Compiled CSS from SASS files
- **What it does**: All the styling for the template
- **Best Practice**: Edit the SASS files in assets/sass/ instead (more advanced)
- **For now**: We added custom CSS directly in index.html (acceptable for small additions)

## CSS in index.html - Is This OK?

**YES! This is perfectly fine for your use case.**

### Why it's acceptable:
1. **Small amount of custom CSS**: Only ~150 lines for the game
2. **Specific to one page**: Only used on index.html
3. **Rapid development**: Easier to edit without rebuilding SASS
4. **Clear separation**: Easy to see what's custom vs. template

### When to move to separate file:
- If CSS grows beyond ~200 lines
- If you need the same styles on multiple pages
- If you want to learn SASS/SCSS workflow

## Best Practice Analysis

### ✅ What You're Doing RIGHT:

1. **Separation of Concerns**
   - HTML (structure) in index.html
   - JavaScript (logic) in wordle.js
   - CSS (styling) in style tags
   - This is the MVC pattern (Model-View-Controller)

2. **Modular JavaScript**
   - wordle.js is completely self-contained
   - Doesn't conflict with main.js
   - Could easily be reused on another page

3. **Descriptive Names**
   - Functions like `submitGuess()`, `checkWord()` make sense
   - Variables like `currentRow`, `targetWord` are clear
   - CSS classes like `.tile`, `.key` are semantic

4. **Comments in Code**
   - Explaining complex logic
   - Helps future you understand the code

### 📚 Industry Standard Best Practices

**For a project this size, your structure is PERFECT.**

For LARGER projects, you might eventually:
1. Extract CSS to: `assets/css/wordle.css`
2. Use a build tool like Webpack or Vite
3. Use a framework like React or Vue
4. Split JS into multiple modules

**But for learning and a single-page game, THIS IS IDEAL.**

## What Each Library Does

### jQuery (jquery.min.js)
- **Purpose**: JavaScript library that simplifies DOM manipulation
- **Example**: `$('#gameBoard')` instead of `document.getElementById('gameBoard')`
- **Usage**: main.js uses it, but wordle.js uses vanilla JavaScript
- **Note**: Modern projects use vanilla JS (like you did!), so this is just for the template

### Scrollex (jquery.scrollex.min.js)
- **Purpose**: Detects when elements scroll into view
- **Usage**: Animates sections when you scroll to them
- **You see it**: Sections fade in as you scroll down the page

### Breakpoints (breakpoints.min.js)
- **Purpose**: Manages responsive design breakpoints
- **Usage**: Adjusts layout for mobile, tablet, desktop
- **You see it**: Sidebar changes on small screens

### Browser (browser.min.js)
- **Purpose**: Detects what browser the user has
- **Usage**: Applies fixes for older browsers (like IE)

## File Naming Conventions

### Standard Patterns:
- `index.html` - Default page (loads when you visit a folder)
- `main.css` - Primary stylesheet
- `style.css` - Alternative name for main stylesheet
- `.min.js` - Minified (compressed) JavaScript for production
- `util.js` - Utility/helper functions

### Your Files Follow Standards:
- ✅ `wordle.js` - Descriptive, specific to game
- ✅ `index.html` - Standard entry point
- ✅ `assets/` folder - Standard for static files

## Recommended Next Steps (Optional)

### If you want to improve organization:

1. **Extract custom CSS** (when it grows):
   ```
   Create: assets/css/wordle.css
   Link in HTML: <link rel="stylesheet" href="assets/css/wordle.css" />
   ```

2. **Add more words** to WORD_LIST in wordle.js

3. **Create additional pages** (optional):
   ```
   about.html - About the game
   stats.html - Player statistics
   ```

4. **Learn SASS** (advanced):
   - Edit `.scss` files in `assets/sass/`
   - Compile to CSS
   - More powerful than plain CSS

## Summary

**Your current structure IS best practice for:**
- Single page applications
- Learning projects
- Games with moderate complexity
- Rapid development

**The separation of:**
- Template code (main.js, main.css)
- Game code (wordle.js)
- Structure (index.html)

**...is exactly what professional developers do!**

The only things that change in larger projects are:
- More files (but same pattern)
- Build tools (to automate compilation)
- Frameworks (to manage complexity)

You're doing great! 🎉

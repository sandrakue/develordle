// ============================================
// DEVELORDLE GAME LOGIC
// All the JavaScript code that makes the game work
// ============================================

// ============================================
// WORD BANK
// ============================================
// const: Creates a constant (value can't be reassigned)
// Array with all possible words the game can choose from
// All words must be exactly 5 letters and developer-related
const WORD_LIST = [
    'ASYNC', 'ARRAY', 'CLASS', 'DEBUG', 'ERROR', 'FETCH', 'GITHUB',
    'INDEX', 'JQUERY', 'LINUX', 'MERGE', 'NUMPY', 'OAUTH', 'PATCH',
    'QUERY', 'REACT', 'STACK', 'TOKEN', 'UTILS', 'VUE', 'WHILE',
    'XPATH', 'YIELD', 'CACHE', 'FLOAT', 'INPUT', 'LOGIC', 'MODEL',
    'NODES', 'PROPS', 'REGEX', 'STYLE', 'THROW', 'AWAIT', 'BUILD',
    'CLONE', 'HTTPS', 'PARSE', 'ADMIN', 'SHELL', 'CONST', 'FINAL',
    'STATE', 'REDIS', 'CRYPT', 'PROXY', 'ROUTE', 'SCOPE', 'JAVA',
    'SWIFT', 'RAILS', 'DJANGO', 'FLASK', 'MONGO', 'MYSQL', 'CLOUD'
];

// ============================================
// GAME STATE VARIABLES
// These track the current state of the game
// ============================================
// let: Creates a variable that CAN be changed (unlike const)

let targetWord = '';      // The secret word the player is trying to guess
                         // Empty string '' initially, set when game starts

let currentRow = 0;      // Which row (0-5) the player is currently on
                         // Starts at 0 (first row at top)

let currentTile = 0;     // Which tile (0-4) in the current row
                         // Tracks where next letter will appear

let gameOver = false;    // Boolean (true/false) tracking if game has ended
                         // false = game ongoing, true = won or lost

let guesses = [];        // Array storing all player guesses
                         // Will hold 6 strings, one for each row
                         // Example: ['ARRAY', 'REACT', '', '', '', '']

// ============================================
// KEYBOARD LAYOUT
// ============================================
// Defines the on-screen keyboard layout
// Array of arrays - each inner array is one row of keys
const KEYBOARD_ROWS = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],  // Top row
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],        // Middle row
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACK']  // Bottom row with special keys
];

// ============================================
// INITIALIZE GAME
// Sets up a new game (called at page load and when "New Game" is clicked)
// ============================================
function initGame() {
    // SELECT A RANDOM WORD
    // Math.random() generates a random decimal between 0 and 1 (e.g., 0.7452)
    // WORD_LIST.length is how many words we have (e.g., 56)
    // Math.random() * WORD_LIST.length gives us 0 to 56 (with decimals)
    // Math.floor() rounds down to whole number (e.g., 41.5 becomes 41)
    // WORD_LIST[41] gets the word at index 41
    targetWord = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
    
    // RESET GAME STATE
    currentRow = 0;              // Start at first row
    currentTile = 0;             // Start at first tile
    gameOver = false;            // Game is active
    guesses = Array(6).fill(''); // Create array [6] and fill with empty strings
                                 // Result: ['', '', '', '', '', '']
    
    // FOR TESTING: Show the answer in browser console
    // Open DevTools (F12) to see it - helpful for testing!
    console.log('Target word:', targetWord);
    
    // BUILD THE USER INTERFACE
    createGameBoard();   // Create the 6x5 grid of tiles
    createKeyboard();    // Create the on-screen keyboard
    updateMessage('');   // Clear any previous messages
    
    // LISTEN FOR KEYBOARD INPUT
    // addEventListener: Tells browser to run handleKeyPress when a key is pressed
    // 'keydown': The event type (fires when key is pressed down)
    document.addEventListener('keydown', handleKeyPress);
}

// ============================================
// CREATE GAME BOARD
// Dynamically generates the 6x5 grid of letter tiles
// ============================================
function createGameBoard() {
    // GET THE CONTAINER from HTML
    // getElementById: Finds element with id="gameBoard"
    const gameBoard = document.getElementById('gameBoard');
    
    // CLEAR ANY EXISTING CONTENT
    // innerHTML = '': Removes everything inside the element
    // Important when resetting the game
    gameBoard.innerHTML = '';
    
    // CREATE 6 ROWS (one for each guess attempt)
    // for loop: Runs code multiple times
    // let i = 0: Start at 0
    // i < 6: Keep going while i is less than 6 (runs 6 times: 0,1,2,3,4,5)
    // i++: Add 1 to i after each loop
    for (let i = 0; i < 6; i++) {
        // CREATE A ROW CONTAINER
        const row = document.createElement('div');  // Create new <div> element
        row.className = 'row';                      // Add CSS class for styling
        row.id = `row-${i}`;                        // Give unique id: row-0, row-1, etc.
                                                    // Backticks (``) allow ${} for variables
        
        // CREATE 5 TILES IN THIS ROW (one for each letter)
        // Nested loop: This runs 5 times for EACH of the 6 rows
        for (let j = 0; j < 5; j++) {
            // CREATE A TILE
            const tile = document.createElement('div');  // Create new <div> element
            tile.className = 'tile';                     // Add CSS class
            tile.id = `tile-${i}-${j}`;                  // Unique id: tile-0-0, tile-0-1, etc.
                                                         // i = row number, j = column number
            
            // ADD TILE TO ROW
            row.appendChild(tile);  // appendChild: Puts tile inside the row
        }
        
        // ADD COMPLETED ROW TO GAMEBOARD
        gameBoard.appendChild(row);  // Puts row inside gameBoard container
    }
    // Result: 6 rows x 5 tiles = 30 total tile elements!
}

// ============================================
// CREATE ON-SCREEN KEYBOARD
// Generates the clickable keyboard below the game board
// ============================================
function createKeyboard() {
    // GET THE KEYBOARD CONTAINER
    const keyboard = document.getElementById('keyboard');
    
    // CLEAR EXISTING KEYBOARD (important for resetting)
    keyboard.innerHTML = '';
    
    // LOOP THROUGH EACH ROW OF KEYS
    // forEach: Modern way to loop through arrays
    // Takes a function that runs for each item
    // row = current array item (e.g., ['Q','W','E'...])
    KEYBOARD_ROWS.forEach(row => {
        // CREATE A CONTAINER FOR THIS ROW
        const rowDiv = document.createElement('div');
        rowDiv.className = 'keyboard-row';  // CSS class for horizontal layout
        
        // LOOP THROUGH EACH KEY IN THIS ROW
        // key = current string (e.g., 'Q', 'W', 'ENTER', etc.)
        row.forEach(key => {
            // CREATE A BUTTON FOR THIS KEY
            const button = document.createElement('button');  // <button> element
            button.className = 'key';                         // CSS class for styling
            button.textContent = key;                         // Set button text
            
            // SPECIAL HANDLING FOR WIDE KEYS
            // === means "exactly equal to" (checks if strings match)
            // || means "or" (if either condition is true)
            if (key === 'ENTER' || key === 'BACK') {
                button.classList.add('wide');  // Add additional CSS class
            }
            
            // MAKE BUTTON CLICKABLE
            // addEventListener: Run code when button is clicked
            // () => is "arrow function" - modern JavaScript function syntax
            // Calls handleKeyClick and passes the key letter
            button.addEventListener('click', () => handleKeyClick(key));
            
            // ADD BUTTON TO ROW
            rowDiv.appendChild(button);
        });
        
        // ADD COMPLETED ROW TO KEYBOARD
        keyboard.appendChild(rowDiv);
    });
}

// ============================================
// HANDLE ON-SCREEN KEYBOARD CLICKS
// Called when player clicks a key button with mouse
// ============================================
function handleKeyClick(key) {
    // PREVENT ACTIONS IF GAME IS OVER
    // if (condition) return; = "guard clause" - exits function early
    if (gameOver) return;
    
    // ROUTE TO APPROPRIATE ACTION
    // Different keys do different things
    if (key === 'ENTER') {
        submitGuess();    // Check the current guess
    } else if (key === 'BACK') {
        deleteLetter();   // Remove last letter
    } else {
        addLetter(key);   // Add this letter to current row
    }
}

// ============================================
// HANDLE PHYSICAL KEYBOARD PRESSES
// Called when player types on their actual keyboard
// ============================================
function handleKeyPress(e) {
    // e = "event object" - contains info about what key was pressed
    
    // PREVENT ACTIONS IF GAME IS OVER
    if (gameOver) return;
    
    // GET THE KEY THAT WAS PRESSED
    // e.key = the key pressed (e.g., 'a', 'Enter', 'Backspace')
    // .toUpperCase() converts to uppercase (e.g., 'a' becomes 'A')
    const key = e.key.toUpperCase();
    
    // ROUTE TO APPROPRIATE ACTION
    if (key === 'ENTER') {
        submitGuess();
    } else if (key === 'BACKSPACE') {
        deleteLetter();
    } else if (/^[A-Z]$/.test(key)) {
        // REGEX (Regular Expression) VALIDATION
        // /^[A-Z]$/: Pattern that matches exactly one letter A-Z
        // ^ = start, [A-Z] = any letter A to Z, $ = end
        // .test(key): Returns true if key matches the pattern
        // This ensures we only accept letter keys, not numbers or symbols
        addLetter(key);
    }
}

// ============================================
// ADD LETTER TO CURRENT TILE
// Adds a letter to the next empty tile in the current row
// ============================================
function addLetter(letter) {
    // CHECK IF ROW IS FULL
    // currentTile tracks position (0-4)
    // < 5 means we haven't filled all 5 tiles yet
    if (currentTile < 5) {
        // FIND THE CORRECT TILE
        // Uses template literal to build id like "tile-2-3" (row 2, column 3)
        const tile = document.getElementById(`tile-${currentRow}-${currentTile}`);
        
        // PUT LETTER IN THE TILE
        tile.textContent = letter;        // Display the letter
        tile.classList.add('filled');     // Add CSS class to change border color
        
        // STORE THE LETTER IN OUR GUESS ARRAY
        // += adds to end of string (e.g., 'AR' += 'R' becomes 'ARR')
        guesses[currentRow] += letter;
        
        // MOVE TO NEXT TILE
        // ++ increments by 1 (currentTile = currentTile + 1)
        currentTile++;
    }
    // If currentTile is already 5, do nothing (row is full)
}

// ============================================
// DELETE LAST LETTER
// Removes the most recently typed letter
// ============================================
function deleteLetter() {
    // CHECK IF THERE'S A LETTER TO DELETE
    // > 0 means we're not at the beginning of the row
    if (currentTile > 0) {
        // MOVE BACK ONE TILE
        // -- decrements by 1 (currentTile = currentTile - 1)
        currentTile--;
        
        // FIND THE TILE WE JUST MOVED BACK TO
        const tile = document.getElementById(`tile-${currentRow}-${currentTile}`);
        
        // CLEAR THE TILE
        tile.textContent = '';               // Remove the letter display
        tile.classList.remove('filled');     // Remove the filled styling
        
        // REMOVE LETTER FROM GUESS ARRAY
        // .slice(0, -1) returns string without last character
        // Example: 'ARRAY'.slice(0, -1) = 'ARRA'
        guesses[currentRow] = guesses[currentRow].slice(0, -1);
    }
    // If currentTile is 0, do nothing (nothing to delete)
}

// ============================================
// SUBMIT CURRENT GUESS
// Called when player presses Enter - validates and checks the guess
// ============================================
function submitGuess() {
    // GET THE CURRENT GUESS
    // guesses[currentRow] gets the string for the current row
    // Example: If currentRow is 2, gets guesses[2] which might be "REACT"
    const guess = guesses[currentRow];
    
    // VALIDATE: CHECK IF GUESS IS COMPLETE
    // !== means "not exactly equal to"
    // A valid guess must be exactly 5 letters
    if (guess.length !== 5) {
        // SHOW ERROR MESSAGE
        updateMessage('Not enough letters!');
        
        // CLEAR MESSAGE AFTER 2 SECONDS
        // setTimeout: Run function after delay (in milliseconds)
        // 2000ms = 2 seconds
        // () => is arrow function (shorthand for function())
        setTimeout(() => updateMessage(''), 2000);
        
        // EXIT FUNCTION EARLY
        // return: Stops function execution here, doesn't continue below
        return;
    }
    
    // SAVE CURRENT ROW NUMBER
    // We need to save this BEFORE incrementing currentRow
    // Because checkWord uses async setTimeout, and by the time it runs,
    // currentRow will have changed (see detailed explanation in checkWord)
    const rowToCheck = currentRow;
    
    // CHECK THE GUESS AND ANIMATE RESULTS
    // This function will determine which letters are correct/present/absent
    // and animate the tiles with colors
    checkWord(guess, rowToCheck);
    
    // CHECK WIN CONDITION
    // === checks if guess exactly matches the target word
    if (guess === targetWord) {
        gameOver = true;  // End the game
        
        // SHOW WIN MESSAGE AFTER ANIMATION COMPLETES
        // We wait 1500ms (1.5 seconds) so all tiles finish animating first
        // The last tile animates at 4 * 300ms = 1200ms, so 1500ms is safe
        setTimeout(() => {
            updateMessage('🎉 Congratulations! You won!', 'win');
        }, 1500);
        
        return;  // Exit function (don't check for loss)
    }
    
    // MOVE TO NEXT ROW
    // ++ adds 1 (if we were on row 2, now we're on row 3)
    currentRow++;
    currentTile = 0;  // Reset to start of new row
    
    // CHECK LOSE CONDITION
    // If currentRow is 6, we've used all 6 attempts (rows 0-5)
    if (currentRow === 6) {
        gameOver = true;  // End the game
        
        // SHOW LOSE MESSAGE WITH THE ANSWER
        // Template literal: ${targetWord} inserts the variable value
        setTimeout(() => {
            updateMessage(`Game Over! The word was: ${targetWord}`, 'lose');
        }, 1500);
    }
}

// ============================================
// CHECK WORD AND UPDATE TILE COLORS
// The heart of the game! Determines which letters are correct/present/absent
// ============================================
// Parameters:
//   guess - the word the player typed, e.g., "ARRAY" (string)
//   rowIndex - which row to animate, e.g., 2 (number)
function checkWord(guess, rowIndex) {
    // Split the target word and guess into arrays of individual letters
    // .split('') turns "REACT" into ['R','E','A','C','T']
    const targetLetters = targetWord.split('');
    const guessLetters = guess.split('');
    
    // Create an array to store the status of each letter
    // We start by assuming all letters are 'absent' (gray)
    const letterStatus = Array(5).fill('absent');
    
    // FIRST PASS: Check for letters in the CORRECT position (green)
    // We do this first because correct positions take priority
    for (let i = 0; i < 5; i++) {
        if (guessLetters[i] === targetLetters[i]) {
            letterStatus[i] = 'correct';  // Mark this position as correct
            targetLetters[i] = null;      // Mark this letter as "used" so we don't match it again
        }
    }
    
    // SECOND PASS: Check for letters in the WRONG position (yellow)
    // Only check letters that weren't already marked as correct
    for (let i = 0; i < 5; i++) {
        if (letterStatus[i] !== 'correct') {
            // indexOf finds the first occurrence of this letter in the target
            const index = targetLetters.indexOf(guessLetters[i]);
            if (index !== -1) {
                letterStatus[i] = 'present';  // Letter exists but wrong position
                targetLetters[index] = null;  // Mark as used
            }
        }
    }
    
    // ANIMATE the tiles one by one with a delay
    // 
    // IMPORTANT CONCEPT - ASYNCHRONOUS CODE:
    // setTimeout is ASYNCHRONOUS - it schedules code to run LATER
    // 
    // Here's what happens:
    // 1. This forEach loop runs IMMEDIATELY and completes in milliseconds
    // 2. It SCHEDULES 5 animations to happen in the future (at 0ms, 300ms, 600ms, etc)
    // 3. The checkWord function FINISHES and returns control to submitGuess()
    // 4. submitGuess() continues and does currentRow++
    // 5. THEN, 0ms, 300ms, 600ms later, the animations actually run
    //
    // Without passing rowIndex, by the time step 5 happens, currentRow has changed!
    //
    // Think of setTimeout like setting an alarm clock - you set it (fast), 
    // then continue doing other things, and the alarm goes off later.
    //
    guessLetters.forEach((letter, index) => {
        // This setTimeout doesn't pause here - it just schedules the animation
        // and immediately moves to the next iteration
        setTimeout(() => {
            // THIS CODE runs LATER (after checkWord has already finished)
            const tile = document.getElementById(`tile-${rowIndex}-${index}`);
            tile.classList.add(letterStatus[index]);
            updateKeyboardKey(letter, letterStatus[index]);
        }, index * 300);  // First tile at 0ms, second at 300ms, third at 600ms, etc.
    });
    
    // The function returns HERE, but the setTimeout callbacks haven't run yet!
}

// ============================================
// UPDATE KEYBOARD KEY COLOR
// Changes the color of keyboard keys based on letter status
// ============================================
function updateKeyboardKey(letter, status) {
    // GET ALL KEYBOARD KEYS
    // querySelectorAll: Finds ALL elements matching the selector
    // Returns a NodeList (array-like list) of all elements with class="key"
    const keys = document.querySelectorAll('.key');
    
    // LOOP THROUGH EACH KEY
    keys.forEach(key => {
        // FIND THE KEY THAT MATCHES THIS LETTER
        // textContent gets the text inside the element
        if (key.textContent === letter) {
            // DETERMINE CURRENT STATUS OF THIS KEY
            // Ternary operator: condition ? valueIfTrue : valueIfFalse
            // Contains checks if element has a class
            // This chain checks correct first, then present, then absent, then ''
            const currentClass = key.classList.contains('correct') ? 'correct' :
                                key.classList.contains('present') ? 'present' :
                                key.classList.contains('absent') ? 'absent' : '';
            
            // ONLY UPDATE IF NEW STATUS IS "BETTER"
            // Priority: correct > present > absent
            // We don't want to downgrade a "correct" to "present"
            // || means "or" - if ANY condition is true, the whole thing is true
            if (status === 'correct' || 
                (status === 'present' && currentClass !== 'correct') ||
                (status === 'absent' && !currentClass)) {
                
                // REMOVE OLD STATUS CLASSES
                key.classList.remove('correct', 'present', 'absent');
                
                // ADD NEW STATUS CLASS
                // This triggers the CSS color change
                key.classList.add(status);
            }
        }
    });
}

// ============================================
// UPDATE MESSAGE DISPLAY
// Shows messages to the player (errors, win/lose messages, etc.)
// ============================================
// Parameters:
//   text - the message to display, e.g., "Not enough letters!"
//   type - optional CSS class for styling, e.g., 'win' or 'lose'
//          = '' means it defaults to empty string if not provided
function updateMessage(text, type = '') {
    // GET THE MESSAGE ELEMENT
    const message = document.getElementById('message');
    
    // SET THE TEXT
    // textContent: Sets the text content (safer than innerHTML)
    message.textContent = text;
    
    // RESET CSS CLASSES
    // className = 'message': Replaces ALL classes with just 'message'
    // This removes any previous 'win' or 'lose' classes
    message.className = 'message';
    
    // ADD TYPE CLASS IF PROVIDED
    // if (type) checks if type has a value (not empty string)
    if (type) {
        // classList.add: Adds a class without removing existing ones
        // So element will have both 'message' and 'win' (or 'lose')
        message.classList.add(type);
    }
}

// ============================================
// PAGE LOAD AND NEW GAME HANDLER
// This code runs when the page finishes loading
// ============================================
// addEventListener on document: Listen for events on the entire page
// 'DOMContentLoaded': Event that fires when HTML is fully loaded and parsed
// () => { }: Arrow function that contains the code to run
document.addEventListener('DOMContentLoaded', () => {
    // START THE GAME!
    // This runs automatically when page loads
    initGame();
    
    // SET UP NEW GAME BUTTON
    // Get the button element
    const newGameBtn = document.getElementById('newGameBtn');
    
    // CHECK IF BUTTON EXISTS
    // if (newGameBtn): Only runs code if element was found
    // Good practice - prevents errors if element doesn't exist
    if (newGameBtn) {
        // LISTEN FOR CLICKS ON NEW GAME BUTTON
        newGameBtn.addEventListener('click', () => {
            // RESET ALL KEYBOARD KEY COLORS
            // When starting new game, all keys should be gray again
            const keys = document.querySelectorAll('.key');
            keys.forEach(key => {
                // Remove all status classes
                key.classList.remove('correct', 'present', 'absent');
            });
            
            // START A NEW GAME
            // This resets all game state and creates fresh board/keyboard
            initGame();
        });
    }
});

// ============================================
// END OF DEVELORDLE GAME CODE
// You did it! You have a fully functional Wordle game!
// ============================================

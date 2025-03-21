# Story Warz

A multiplayer storytelling game with a 90s rock hip-hop aesthetic. Players submit stories, guess story owners, and score points across 8 rounds.

## Features

1. **Multiplayer Lobby**
   - Firebase Realtime Database for lobby state
   - 6-character invite code generation
   - Host controls game start

2. **Story Submission**
   - 3 stories per player at game start
   - Character limit: 500
   - Random story selection per round

3. **Voting System**
   - One vote per player per round
   - Vote locking mechanism
   - Reveal phase with story explanation

4. **Scoring**
   - Rounds 1-4: 1pt (fooled), 2pt (correct guess)
   - Rounds 5-8: 2pt (fooled), 4pt (correct guess)
   - Real-time scoreboard updates

## Setup

### Prerequisites

- Node.js (LTS version)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Firebase account

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd StoryWarz
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure Firebase:
   - Create a new Firebase project at https://console.firebase.google.com/
   - Enable Authentication and Realtime Database
   - Add a web app to your Firebase project
   - Copy the Firebase config values
   - Update the `firebaseConfig.js` file in the `constants` folder with your config values

4. Add fonts:
   - Place font files in the `assets/fonts` directory:
     - GraffitiFont.ttf
     - GrungeRock.ttf
     
5. Add images:
   - Place image files in the `assets/images` directory:
     - cassette-tape-bg.png
     - boombox-icon.png
     - vinyl-record.png

### Running the App

Start the development server:
```
npm start
```

You can then:
- Press `a` to run on Android emulator/device
- Press `i` to run on iOS simulator/device (requires a Mac)
- Press `w` to run in web browser
- Scan the QR code with the Expo Go app on your physical device

## Game Rules

1. **Game Setup**
   - 3-10 players per game
   - Each player needs a device with the app installed
   - One player creates a lobby, others join with the 6-character code

2. **Gameplay**
   - Each round has a topic (e.g., "Most Epic Party", "Worst Date Ever")
   - Players submit a story about the topic (500 character limit)
   - A random story is selected and read to all players
   - Players vote on who they think wrote the story
   - Points are awarded for correct guesses and for fooling others
   - After 8 rounds, the player with the most points wins

## Game Design Credits

Designed with a 90s rock hip-hop aesthetic featuring:
- Neon color palette
- Graffiti-style fonts
- Cassette tape and vinyl record textures
- Boombox and music imagery

## License

[MIT License](LICENSE)

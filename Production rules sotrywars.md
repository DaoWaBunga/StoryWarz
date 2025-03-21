Here's a Cursor .md file for your "Story Warz" game with a 90s rock hip-hop style UI theme:

```markdown
# Story Warz - React Native Expo App

## Project Overview
A multiplayer storytelling game with a 90s rock hip-hop aesthetic. Players submit stories, guess story owners, and score points across 8 rounds.

## Tech Stack
- React Native
- Expo
- Firebase (Authentication & Realtime Database)
- Redux Toolkit (State Management)

## File Structure
```
story-warz/
├── assets/
│   ├── fonts/
│   │   ├── GraffitiFont.ttf
│   │   └── GrungeRock.ttf
│   ├── images/
│   │   ├── cassette-tape-bg.png
│   │   ├── boombox-icon.png
│   │   └── vinyl-record.png
├── components/
│   ├── GameLobby.js
│   ├── StoryInput.js
│   ├── VotingCard.js
│   ├── Scoreboard.js
│   └── RetroButton.js
├── screens/
│   ├── LoginScreen.js
│   ├── LobbyScreen.js
│   ├── GameScreen.js
│   └── LeaderboardScreen.js
├── redux/
│   ├── gameSlice.js
│   └── store.js
├── App.js
└── constants/
    ├── colors.js
    └── themes.js
```

## Design System
### Colors
```javascript
// constants/colors.js
export const COLORS = {
  primary: '#FF0066',    // Neon Pink
  secondary: '#00FFCC',  // Cyan
  accent: '#FFFF00',     // Yellow
  background: '#1A1A1A', // Dark Gray
  text: '#FFFFFF',       // White
  altText: '#666633'     // Grunge Olive
}
```

### Theme
```javascript
// constants/themes.js
export const THEME = {
  fontFamily: 'GraffitiFont',
  altFont: 'GrungeRock',
  borderStyle: 'solid',
  borderWidth: 2,
  borderColor: COLORS.secondary,
  shadow: {
    shadowColor: COLORS.accent,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  }
}
```

## Core Components

### LoginScreen.js
```javascript
const LoginScreen = () => {
  return (
    <View style={styles.container}>
      <ImageBackground source={cassetteTapeBg} style={styles.bg}>
        <Text style={styles.title}>STORY WARZ</Text>
        <TextInput 
          style={styles.input}
          placeholder="Username"
          placeholderTextColor={COLORS.altText}
        />
        <TextInput 
          style={styles.input}
          placeholder="Lobby Code"
          placeholderTextColor={COLORS.altText}
        />
        <RetroButton 
          title="Start Lobby"
          onPress={handleStartLobby}
          style={styles.button}
        />
      </ImageBackground>
    </View>
  );
};
```

### GameScreen.js
```javascript
const GameScreen = () => {
  const [round, setRound] = useState(1);
  const [currentStory, setCurrentStory] = useState(null);

  const topics = [
    "Most Epic Party",
    "Worst Date Ever",
    "Craziest Road Trip",
    // ... more topics
  ];

  return (
    <View style={styles.gameContainer}>
      <Image source={boomboxIcon} style={styles.icon} />
      <Text style={styles.round}>Round {round}: {topics[round-1]}</Text>
      
      {isHost && (
        <RetroButton 
          title="Start Round"
          onPress={startRound}
        />
      )}
      
      <ScrollView>
        <Text style={styles.story}>{currentStory?.text}</Text>
        <FlatList
          data={players}
          renderItem={({ item }) => (
            <VotingCard 
              player={item}
              onVote={handleVote}
              locked={voteLocked}
            />
          )}
        />
      </ScrollView>
      
      <Scoreboard players={players} />
    </View>
  );
};
```

## Game Logic (gameSlice.js)
```javascript
const gameSlice = createSlice({
  name: 'game',
  initialState: {
    players: [],
    stories: [],
    round: 1,
    scores: {},
    currentStory: null,
    votes: {},
    voteLocked: false,
  },
  reducers: {
    submitStory: (state, action) => {
      state.stories.push({
        text: action.payload.text,
        owner: action.payload.playerId,
        round: state.round
      });
    },
    lockVote: (state, action) => {
      state.votes[action.payload.playerId] = action.payload.vote;
      state.voteLocked = true;
    },
    endRound: (state) => {
      // Calculate points
      const storyOwner = state.currentStory.owner;
      Object.entries(state.votes).forEach(([voter, vote]) => {
        const multiplier = state.round > 4 ? 2 : 1;
        if (vote === storyOwner) {
          state.scores[voter] += 2 * multiplier;
        }
        if (voter === storyOwner) {
          const fooledCount = Object.values(state.votes)
            .filter(v => v !== storyOwner).length;
          state.scores[storyOwner] += fooledCount * multiplier;
        }
      });
      state.round += 1;
      state.voteLocked = false;
      state.votes = {};
    },
  },
});
```

## Features Implementation
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

5. **Leaderboard**
   - Global ranking by total points
   - Games played counter
   - Persistent storage via Firebase

## Styling Notes
- Use graffiti-style fonts for headers
- Neon color accents on dark backgrounds
- Cassette tape and vinyl record textures
- Boombox and microphone icons
- Animated transitions with 90s VHS glitch effects
```

This design incorporates:
- A 90s rock hip-hop aesthetic with neon colors, graffiti fonts, and retro audio equipment imagery
- Clean multiplayer functionality with lobby system
- Exact game rules as specified (3-10 players, 8 rounds, precise scoring)
- Mobile-friendly UI components
- State management for real-time gameplay
- Visual flair while maintaining readability

To implement this, you'd need to:
1. Set up Expo project
2. Install dependencies (Firebase, Redux, etc.)
3. Download/create the themed assets
4. Implement the full component logic
5. Connect to Firebase backend

The UI will feel like a mix of 90s MTV and urban street art, perfect for the game's social, competitive vibe.
// redux/gameSlice.js
import { createSlice } from '@reduxjs/toolkit';

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
    addPlayer: (state, action) => {
      state.players.push(action.payload);
      state.scores[action.payload.id] = 0;
    },
    setCurrentStory: (state, action) => {
      state.currentStory = action.payload;
    },
    resetGame: (state) => {
      state.players = [];
      state.stories = [];
      state.round = 1;
      state.scores = {};
      state.currentStory = null;
      state.votes = {};
      state.voteLocked = false;
    }
  },
});

export const { 
  submitStory, 
  lockVote, 
  endRound, 
  addPlayer, 
  setCurrentStory,
  resetGame
} = gameSlice.actions;

export default gameSlice.reducer; 
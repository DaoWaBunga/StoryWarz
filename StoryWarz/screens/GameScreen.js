// screens/GameScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getDatabase, ref, set, onValue, off } from 'firebase/database';
import { COLORS } from '../constants/colors';
import StoryInput from '../components/StoryInput';
import VotingCard from '../components/VotingCard';
import Scoreboard from '../components/Scoreboard';
import RetroButton from '../components/RetroButton';
import { submitStory, lockVote, endRound, setCurrentStory } from '../redux/gameSlice';
import { getStoryTopics, shuffleArray } from '../utils/helpers';

// Import assets
const boomboxIcon = require('../assets/images/boombox-icon.png');

const GameScreen = ({ route, navigation }) => {
  const { playerId, lobbyCode, isHost } = route.params;
  const [phase, setPhase] = useState('submission'); // submission, voting, results
  const [topic, setTopic] = useState('');
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const dispatch = useDispatch();
  const gameState = useSelector(state => state.game);
  const topics = getStoryTopics();
  
  useEffect(() => {
    // Set up database listeners
    const db = getDatabase();
    const lobbyRef = ref(db, `lobbies/${lobbyCode}`);
    
    onValue(lobbyRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        Alert.alert(
          'Lobby Closed',
          'This lobby has been closed by the host.',
          [
            { text: 'OK', onPress: () => navigation.navigate('Login') }
          ]
        );
        return;
      }
      
      // Get players
      const playersData = data.players ? Object.values(data.players) : [];
      setPlayers(playersData);
      
      // Get game phase
      if (data.phase) {
        setPhase(data.phase);
      }
      
      // Get current topic
      if (data.currentTopic) {
        setTopic(data.currentTopic);
      } else if (isHost && data.round) {
        // Host sets the topic for the round
        const currentTopic = topics[data.round - 1];
        set(ref(db, `lobbies/${lobbyCode}/currentTopic`), currentTopic);
        setTopic(currentTopic);
      }
      
      // Get current story
      if (data.currentStory) {
        dispatch(setCurrentStory(data.currentStory));
      }
      
      setLoading(false);
    });
    
    // Clean up
    return () => {
      off(lobbyRef);
    };
  }, [dispatch, lobbyCode, playerId, isHost, navigation, topics]);
  
  const handleSubmitStory = (text) => {
    const story = {
      text,
      owner: playerId,
      round: gameState.round
    };
    
    // Update Firebase
    const db = getDatabase();
    set(ref(db, `lobbies/${lobbyCode}/stories/${playerId}`), story);
    
    // Update Redux
    dispatch(submitStory({ text, playerId }));
    
    // If host, check if all players have submitted
    if (isHost) {
      checkAllSubmitted();
    }
  };
  
  const checkAllSubmitted = () => {
    const db = getDatabase();
    const storiesRef = ref(db, `lobbies/${lobbyCode}/stories`);
    
    onValue(storiesRef, (snapshot) => {
      const stories = snapshot.val();
      if (stories && Object.keys(stories).length === players.length) {
        // All players have submitted, start voting phase
        set(ref(db, `lobbies/${lobbyCode}/phase`), 'voting');
        
        // Choose a random story
        const storiesArray = Object.values(stories);
        const randomStory = storiesArray[Math.floor(Math.random() * storiesArray.length)];
        set(ref(db, `lobbies/${lobbyCode}/currentStory`), randomStory);
      }
    }, { onlyOnce: true });
  };
  
  const handleVote = (votedForId) => {
    // Can't vote for yourself
    if (votedForId === playerId) {
      Alert.alert('Invalid Vote', 'You cannot vote for yourself!');
      return;
    }
    
    // Update Firebase
    const db = getDatabase();
    set(ref(db, `lobbies/${lobbyCode}/votes/${playerId}`), votedForId);
    
    // Update Redux
    dispatch(lockVote({ playerId, vote: votedForId }));
    
    // If host, check if all players have voted
    if (isHost) {
      checkAllVoted();
    }
  };
  
  const checkAllVoted = () => {
    const db = getDatabase();
    const votesRef = ref(db, `lobbies/${lobbyCode}/votes`);
    
    onValue(votesRef, (snapshot) => {
      const votes = snapshot.val();
      if (votes && Object.keys(votes).length === players.length) {
        // All players have voted, show results
        set(ref(db, `lobbies/${lobbyCode}/phase`), 'results');
      }
    }, { onlyOnce: true });
  };
  
  const handleNextRound = () => {
    // Update Firebase
    const db = getDatabase();
    
    // Calculate scores
    const currentStory = gameState.currentStory;
    const votes = gameState.votes;
    const storyOwner = currentStory.owner;
    const round = gameState.round;
    
    // Update scores in Firebase
    players.forEach(player => {
      let score = player.score || 0;
      const multiplier = round > 4 ? 2 : 1;
      
      // Points for correct guesses
      if (votes[player.id] === storyOwner) {
        score += 2 * multiplier;
      }
      
      // Points for fooling others
      if (player.id === storyOwner) {
        const fooledCount = Object.values(votes).filter(v => v !== storyOwner).length;
        score += fooledCount * multiplier;
      }
      
      set(ref(db, `lobbies/${lobbyCode}/players/${player.id}/score`), score);
    });
    
    // Reset for next round
    set(ref(db, `lobbies/${lobbyCode}/votes`), null);
    set(ref(db, `lobbies/${lobbyCode}/currentStory`), null);
    
    const nextRound = round + 1;
    set(ref(db, `lobbies/${lobbyCode}/round`), nextRound);
    
    // If this was the last round, end the game
    if (nextRound > 8) {
      set(ref(db, `lobbies/${lobbyCode}/phase`), 'gameOver');
    } else {
      // Otherwise, start next round
      set(ref(db, `lobbies/${lobbyCode}/phase`), 'submission');
    }
    
    // Update Redux
    dispatch(endRound());
  };
  
  const renderPhase = () => {
    switch (phase) {
      case 'submission':
        return (
          <StoryInput 
            onSubmit={handleSubmitStory}
            topic={topic}
          />
        );
      case 'voting':
        return (
          <View>
            <Text style={styles.story}>{gameState.currentStory?.text}</Text>
            <Text style={styles.votingTitle}>Who wrote this story?</Text>
            {players.map(player => (
              player.id !== playerId && (
                <VotingCard
                  key={player.id}
                  player={player}
                  onVote={handleVote}
                  locked={gameState.votes[playerId] === player.id}
                />
              )
            ))}
          </View>
        );
      case 'results':
        const storyOwner = players.find(p => p.id === gameState.currentStory?.owner);
        return (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsTitle}>The story was written by:</Text>
            <Text style={styles.storyOwner}>{storyOwner?.name}</Text>
            {isHost && (
              <RetroButton
                title="Next Round"
                onPress={handleNextRound}
                style={styles.nextButton}
              />
            )}
          </View>
        );
      case 'gameOver':
        return (
          <View style={styles.gameOverContainer}>
            <Text style={styles.gameOverTitle}>Game Over!</Text>
            <RetroButton
              title="Return to Lobby"
              onPress={() => navigation.navigate('Login')}
              style={styles.returnButton}
            />
          </View>
        );
      default:
        return <Text>Loading...</Text>;
    }
  };
  
  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <Image source={boomboxIcon} style={styles.icon} />
      <Text style={styles.round}>Round {gameState.round}: {topic}</Text>
      
      <ScrollView style={styles.content}>
        {renderPhase()}
      </ScrollView>
      
      <Scoreboard players={players} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.background,
  },
  icon: {
    width: 60,
    height: 60,
    alignSelf: 'center',
    marginTop: 20,
  },
  round: {
    color: COLORS.accent,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
  },
  content: {
    flex: 1,
  },
  loadingText: {
    color: COLORS.text,
    fontSize: 18,
    textAlign: 'center',
    marginTop: 32,
  },
  story: {
    color: COLORS.text,
    fontSize: 16,
    lineHeight: 24,
    padding: 16,
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    marginBottom: 16,
  },
  votingTitle: {
    color: COLORS.secondary,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  resultsContainer: {
    alignItems: 'center',
    padding: 16,
  },
  resultsTitle: {
    color: COLORS.text,
    fontSize: 18,
    marginBottom: 8,
  },
  storyOwner: {
    color: COLORS.accent,
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  nextButton: {
    marginTop: 24,
    minWidth: 200,
  },
  gameOverContainer: {
    alignItems: 'center',
    padding: 24,
  },
  gameOverTitle: {
    color: COLORS.primary,
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 32,
  },
  returnButton: {
    marginTop: 24,
    minWidth: 200,
  },
});

export default GameScreen; 
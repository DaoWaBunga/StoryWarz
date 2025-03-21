import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ImageBackground, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { getDatabase, ref, set, onValue, off } from 'firebase/database';
import { v4 as uuidv4 } from 'uuid';
import { COLORS } from '../constants/colors';
import GameLobby from '../components/GameLobby';
import RetroButton from '../components/RetroButton';
import { addPlayer, resetGame } from '../redux/gameSlice';

// Import the background image
const cassetteTapeBg = require('../assets/images/cassette-tape-bg.png');

const LobbyScreen = ({ route, navigation }) => {
  const { username, lobbyCode, isHost } = route.params;
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  
  // Generate a unique ID for this player
  const playerId = uuidv4();
  
  useEffect(() => {
    // Reset the game state
    dispatch(resetGame());
    
    // Get reference to the lobby in Firebase
    const db = getDatabase();
    const lobbyRef = ref(db, `lobbies/${lobbyCode}`);
    
    // If host, create the lobby
    if (isHost) {
      // Set initial lobby data
      set(ref(db, `lobbies/${lobbyCode}`), {
        host: playerId,
        status: 'waiting',
        createdAt: new Date().toISOString(),
      });
    }
    
    // Add this player to the players list
    const newPlayer = {
      id: playerId,
      name: username,
      isHost,
      joinedAt: new Date().toISOString(),
    };
    
    set(ref(db, `lobbies/${lobbyCode}/players/${playerId}`), newPlayer);
    dispatch(addPlayer(newPlayer));
    
    // Listen for changes to the lobby
    onValue(lobbyRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        // Lobby doesn't exist
        Alert.alert(
          'Lobby Not Found',
          'This lobby code does not exist or has expired.',
          [
            { text: 'OK', onPress: () => navigation.navigate('Login') }
          ]
        );
        return;
      }
      
      // Get players
      const playersData = data.players ? Object.values(data.players) : [];
      setPlayers(playersData);
      
      // Check if game has started
      if (data.status === 'playing') {
        navigation.navigate('Game', { 
          lobbyCode,
          playerId,
          isHost
        });
      }
      
      setLoading(false);
    });
    
    // Clean up the listeners
    return () => {
      off(lobbyRef);
    };
  }, [lobbyCode, isHost, username, dispatch, navigation, playerId]);
  
  const handleStartGame = () => {
    if (players.length < 3) {
      Alert.alert('Not Enough Players', 'You need at least 3 players to start a game.');
      return;
    }
    
    // Update the lobby status to playing
    const db = getDatabase();
    set(ref(db, `lobbies/${lobbyCode}/status`), 'playing');
  };
  
  const handleLeaveLobby = () => {
    // Remove this player from the lobby
    const db = getDatabase();
    set(ref(db, `lobbies/${lobbyCode}/players/${playerId}`), null);
    
    // If host, delete the entire lobby
    if (isHost) {
      set(ref(db, `lobbies/${lobbyCode}`), null);
    }
    
    navigation.navigate('Login');
  };
  
  return (
    <View style={styles.container}>
      <ImageBackground source={cassetteTapeBg} style={styles.bg} resizeMode="cover">
        <GameLobby 
          players={players}
          lobbyCode={lobbyCode}
          isHost={isHost}
          onStartGame={handleStartGame}
        />
        
        <RetroButton
          title="Leave Lobby"
          onPress={handleLeaveLobby}
          style={styles.leaveButton}
        />
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  bg: {
    flex: 1,
    padding: 20,
  },
  leaveButton: {
    backgroundColor: '#CC3333',
    alignSelf: 'center',
    marginTop: 20,
  },
});

export default LobbyScreen; 
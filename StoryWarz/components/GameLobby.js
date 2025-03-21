import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { COLORS } from '../constants/colors';
import { THEME } from '../constants/themes';
import RetroButton from './RetroButton';

const GameLobby = ({ players, lobbyCode, isHost, onStartGame }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>LOBBY CODE:</Text>
      <Text style={styles.lobbyCode}>{lobbyCode}</Text>
      
      <View style={styles.playerContainer}>
        <Text style={styles.playersTitle}>PLAYERS ({players.length}/10):</Text>
        <FlatList
          data={players}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <View style={styles.playerItem}>
              <Text style={styles.playerNumber}>{index + 1}.</Text>
              <Text style={styles.playerName}>{item.name}</Text>
              {item.isHost && <Text style={styles.hostTag}>HOST</Text>}
            </View>
          )}
        />
      </View>
      
      {isHost && players.length >= 3 && (
        <RetroButton
          title="Start Game"
          onPress={onStartGame}
          style={styles.startButton}
        />
      )}
      
      {isHost && players.length < 3 && (
        <Text style={styles.waitingText}>
          Waiting for more players... (Min 3)
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    color: COLORS.secondary,
    fontSize: 18,
    textAlign: 'center',
  },
  lobbyCode: {
    color: COLORS.accent,
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: 8,
  },
  playerContainer: {
    backgroundColor: COLORS.background,
    borderWidth: THEME.borderWidth,
    borderColor: COLORS.secondary,
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    ...THEME.shadow,
  },
  playersTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  playerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  playerNumber: {
    color: COLORS.secondary,
    width: 30,
    fontSize: 16,
  },
  playerName: {
    color: COLORS.text,
    flex: 1,
    fontSize: 16,
  },
  hostTag: {
    color: COLORS.accent,
    fontWeight: 'bold',
    fontSize: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: COLORS.accent,
    borderRadius: 4,
  },
  startButton: {
    alignSelf: 'center',
    minWidth: 200,
  },
  waitingText: {
    color: COLORS.altText,
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
});

export default GameLobby; 
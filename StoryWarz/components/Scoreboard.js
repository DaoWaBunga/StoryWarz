// components/Scoreboard.js
import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { COLORS } from '../constants/colors';
import { THEME } from '../constants/themes';

const Scoreboard = ({ players }) => {
  // Sort players by score in descending order
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  const renderScoreItem = ({ item, index }) => (
    <View style={styles.scoreRow}>
      <Text style={styles.position}>{index + 1}</Text>
      <Text style={styles.playerName}>{item.name}</Text>
      <Text style={styles.score}>{item.score}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SCOREBOARD</Text>
      <View style={styles.headerRow}>
        <Text style={styles.headerText}>#</Text>
        <Text style={styles.headerText}>Player</Text>
        <Text style={styles.headerText}>Points</Text>
      </View>
      <FlatList
        data={sortedPlayers}
        keyExtractor={(item) => item.id}
        renderItem={renderScoreItem}
        scrollEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    borderWidth: THEME.borderWidth,
    borderColor: COLORS.secondary,
    borderRadius: 8,
    padding: 16,
    marginVertical: 16,
    ...THEME.shadow,
  },
  title: {
    color: COLORS.accent,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.secondary,
    marginBottom: 8,
  },
  headerText: {
    color: COLORS.secondary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  scoreRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  position: {
    color: COLORS.text,
    width: 30,
    fontSize: 16,
  },
  playerName: {
    color: COLORS.text,
    flex: 1,
    fontSize: 16,
  },
  score: {
    color: COLORS.primary,
    width: 50,
    textAlign: 'right',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Scoreboard; 
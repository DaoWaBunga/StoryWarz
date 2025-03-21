import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/colors';
import { THEME } from '../constants/themes';

const VotingCard = ({ player, onVote, locked }) => {
  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => !locked && onVote(player.id)}
      disabled={locked}
      activeOpacity={locked ? 1 : 0.7}
    >
      <View style={[styles.cardInner, locked && styles.cardLocked]}>
        <Text style={styles.playerName}>{player.name}</Text>
        {locked && <Text style={styles.lockedText}>VOTE LOCKED</Text>}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    borderRadius: 8,
    overflow: 'hidden',
    ...THEME.shadow,
  },
  cardInner: {
    backgroundColor: COLORS.background,
    borderWidth: THEME.borderWidth,
    borderColor: COLORS.secondary,
    padding: 16,
    alignItems: 'center',
  },
  cardLocked: {
    borderColor: COLORS.accent,
    opacity: 0.8,
  },
  playerName: {
    color: COLORS.text,
    fontSize: 18,
    marginBottom: 4,
    fontWeight: 'bold',
  },
  lockedText: {
    color: COLORS.accent,
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 5,
  },
});

export default VotingCard; 
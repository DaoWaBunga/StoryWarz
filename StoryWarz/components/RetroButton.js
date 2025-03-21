import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';
import { THEME } from '../constants/themes';

const RetroButton = ({ title, onPress, style }) => {
  return (
    <TouchableOpacity 
      style={[styles.button, style]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.primary,
    borderWidth: THEME.borderWidth,
    borderColor: COLORS.secondary,
    borderStyle: THEME.borderStyle,
    padding: 12,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    minWidth: 150,
    ...THEME.shadow,
  },
  buttonText: {
    color: COLORS.text,
    fontSize: 18,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

export default RetroButton; 
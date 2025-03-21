// components/StoryInput.js
import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import { COLORS } from '../constants/colors';
import { THEME } from '../constants/themes';
import RetroButton from './RetroButton';

const MAX_CHARS = 500;

const StoryInput = ({ onSubmit, topic }) => {
  const [story, setStory] = useState('');

  const handleSubmit = () => {
    if (story.trim().length > 0) {
      onSubmit(story);
      setStory('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.topic}>Topic: {topic}</Text>
      <TextInput
        style={styles.input}
        multiline
        placeholder="Write your story here..."
        placeholderTextColor={COLORS.altText}
        value={story}
        onChangeText={setStory}
        maxLength={MAX_CHARS}
      />
      <Text style={styles.charCount}>{story.length}/{MAX_CHARS}</Text>
      <RetroButton 
        title="Submit Story" 
        onPress={handleSubmit} 
        style={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: COLORS.background,
    borderWidth: THEME.borderWidth,
    borderColor: COLORS.secondary,
    borderRadius: 8,
    marginVertical: 16,
    ...THEME.shadow,
  },
  topic: {
    color: COLORS.accent,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#2A2A2A',
    color: COLORS.text,
    borderRadius: 4,
    minHeight: 150,
    padding: 12,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  charCount: {
    color: COLORS.altText,
    textAlign: 'right',
    marginTop: 4,
    fontSize: 12,
  },
  button: {
    marginTop: 16,
    alignSelf: 'center',
  },
});

export default StoryInput; 
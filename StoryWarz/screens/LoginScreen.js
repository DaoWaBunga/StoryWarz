// screens/LoginScreen.js
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  ImageBackground, 
  KeyboardAvoidingView, 
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { COLORS } from '../constants/colors';
import RetroButton from '../components/RetroButton';
import { generateLobbyCode } from '../utils/helpers';

// Import Boombox icon or vinyl record for the UI
// This placeholder will be replaced once you add your assets
const cassetteTapeBg = require('../assets/images/cassette-tape-bg.png');

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [lobbyCode, setLobbyCode] = useState('');

  const handleStartLobby = () => {
    if (username.trim().length === 0) {
      alert('Please enter a username');
      return;
    }

    // Generate a random lobby code if none is provided
    const gameCode = lobbyCode.trim() || generateLobbyCode();
    
    // Navigate to the lobby screen with params
    navigation.navigate('Lobby', {
      username,
      lobbyCode: gameCode,
      isHost: !lobbyCode.trim(),
    });
  };

  const handleJoinLobby = () => {
    if (username.trim().length === 0 || lobbyCode.trim().length === 0) {
      alert('Please enter both username and lobby code');
      return;
    }

    // Navigate to the lobby screen with params
    navigation.navigate('Lobby', {
      username,
      lobbyCode: lobbyCode.trim(),
      isHost: false,
    });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <ImageBackground source={cassetteTapeBg} style={styles.bg} resizeMode="cover">
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.formContainer}
          >
            <Text style={styles.title}>STORY WARZ</Text>
            <Text style={styles.subtitle}>The Ultimate Storytelling Battle</Text>
            
            <TextInput 
              style={styles.input}
              placeholder="Username"
              placeholderTextColor={COLORS.altText}
              value={username}
              onChangeText={setUsername}
              maxLength={15}
            />
            
            <TextInput 
              style={styles.input}
              placeholder="Lobby Code (leave empty to create)"
              placeholderTextColor={COLORS.altText}
              value={lobbyCode}
              onChangeText={setLobbyCode}
              autoCapitalize="characters"
              maxLength={6}
            />
            
            <View style={styles.buttonContainer}>
              <RetroButton 
                title="Create Lobby"
                onPress={handleStartLobby}
                style={styles.button}
              />
              
              <RetroButton 
                title="Join Lobby"
                onPress={handleJoinLobby}
                style={[styles.button, styles.joinButton]}
              />
            </View>
          </KeyboardAvoidingView>
        </ImageBackground>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bg: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    width: '85%',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderWidth: 2,
    borderColor: COLORS.secondary,
    borderRadius: 8,
    alignItems: 'center',
  },
  title: {
    color: COLORS.primary,
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: COLORS.accent,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    color: COLORS.secondary,
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    backgroundColor: '#2A2A2A',
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  button: {
    width: '100%',
    marginVertical: 8,
  },
  joinButton: {
    backgroundColor: COLORS.secondary,
  },
});

export default LoginScreen; 
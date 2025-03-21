import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './constants/firebaseConfig';
import store from './redux/store';
import { COLORS } from './constants/colors';

// Screens
import LoginScreen from './screens/LoginScreen';
import LobbyScreen from './screens/LobbyScreen';
import GameScreen from './screens/GameScreen';

// Keep the splash screen visible until all assets are loaded
SplashScreen.preventAutoHideAsync();

// Initialize Firebase
try {
  initializeApp(firebaseConfig);
} catch (err) {
  console.log('Firebase initialization error:', err);
}

const Stack = createStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    'GraffitiFont': require('./assets/fonts/GraffitiFont.ttf'),
    'GrungeRock': require('./assets/fonts/GrungeRock.ttf'),
  });

  useEffect(() => {
    async function prepare() {
      if (fontsLoaded) {
        // Hide splash screen when fonts are loaded
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: COLORS.background }
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Lobby" component={LobbyScreen} />
          <Stack.Screen name="Game" component={GameScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
} 
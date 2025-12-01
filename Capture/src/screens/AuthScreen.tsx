import React, { useState, useEffect } from 'react';
import { StatusBar, StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import SignIn from '../components/SignIn';
import SignUp from '../components/SignUp';
import log from '../utils/logger';

interface AuthScreenProps {
  navigation: any; // Important: We pass this down to SignIn
}

const AuthScreen: React.FC<AuthScreenProps> = ({ navigation }) => {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);

  useEffect(() => {
    log.debug("DEBUG: AuthScreen mounted - initializing authentication flow");
  }, []);

  const switchToSignUp = () => {
    log.info("INFO: Switching to SignUp view");
    setIsSignUp(true);
  };

  const switchToSignIn = () => {
    log.info("INFO: Switching to SignIn view");
    setIsSignUp(false);
  };

  // --- Render Sign Up ---
  if (isSignUp) {
    log.info("INFO: Rendering SignUp component");
    return (
      <SafeAreaView style={styles.flexContainer}>
        <StatusBar barStyle="dark-content" />
        <SignUp onSwitchToSignIn={switchToSignIn} />
      </SafeAreaView>
    );
  }

  // --- Render Sign In ---
  return (
    <SafeAreaView style={styles.flexContainer}>
      <StatusBar barStyle="dark-content" />
      
      {/* We pass 'navigation' to SignIn so it can handle 
         the redirect after a successful backend login 
      */}
      <SignIn 
        onSwitchToSignUp={switchToSignUp} 
        navigation={navigation}
      />
      
      {/* Footer UI (Unchanged) */}
      <View style={styles.signUpContainer}>
        <Text style={styles.signUpText}>Don't have an account?</Text>
        <TouchableOpacity 
          style={styles.signUpButton} 
          onPress={switchToSignUp}
          onPressIn={() => log.debug("DEBUG: SignUp button pressed")}
        >
          <Text style={styles.signUpButtonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  signUpContainer: {
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: 'white',
    // Fix for iPhone bottom safe area
    paddingBottom: Platform.OS === 'ios' ? 0 : 20,
  },
  signUpText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  signUpButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 120,
  },
  signUpButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default AuthScreen;
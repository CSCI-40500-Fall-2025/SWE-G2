import React from 'react';
import { StatusBar, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import SignIn from '../components/SignIn';
import SignUp from '../components/SignUp';
import log from '../utils/logger'; // Add logger import

interface AuthScreenProps {
  navigation: any;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ navigation }) => {
  const [isSignUp, setIsSignUp] = React.useState<boolean>(false);

  // Component lifecycle logs with error focus
  React.useEffect(() => {
    // DEBUG (1x)
    log.debug("DEBUG: AuthScreen mounted - initializing authentication flow");
  }, []);

  const switchToSignUp = () => {
    // INFO (1x)
    log.info("INFO: User selected SignUp option");
    setIsSignUp(true);
  };

  const switchToSignIn = () => {
    // INFO (1x)
    log.info("INFO: User selected SignIn option");
    setIsSignUp(false);
  };

  // If user wants to sign up, show the SignUp component
  if (isSignUp) {
    // INFO (1x)
    log.info("INFO: Rendering SignUp component - new user registration");
    
    return (
      <SafeAreaView style={styles.flexContainer}>
        <StatusBar barStyle="dark-content" />
        <SignUp onSwitchToSignIn={switchToSignIn} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.flexContainer}>
      <StatusBar barStyle="dark-content" />
      
      {/* Sign In Form */}
      <SignIn 
        onSwitchToSignUp={switchToSignUp} 
        navigation={navigation}
      />
      
      {/* Sign Up Button */}
      <View style={styles.signUpContainer}>
        <Text style={styles.signUpText}>Don't have an account?</Text>
        <TouchableOpacity 
          style={styles.signUpButton} 
          onPress={switchToSignUp}
          onPressIn={() => {
            // DEBUG (1x)
            log.debug("DEBUG: SignUp button pressed - user interaction detected");
          }}
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
import React from 'react';
import { StatusBar, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import SignIn from '../components/SignIn';
import SignUp from '../components/SignUp';

interface AuthScreenProps {
  navigation: any;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ navigation }) => {
  const [isSignUp, setIsSignUp] = React.useState<boolean>(false);

  const switchToSignUp = () => {
    setIsSignUp(true);
  };

  const switchToSignIn = () => {
    setIsSignUp(false);
  };

  // If user wants to sign up, show the SignUp component
  if (isSignUp) {
    return (
      <SafeAreaView style={styles.flexContainer}>
        <StatusBar barStyle="dark-content" />
        <SignUp onSwitchToSignIn={switchToSignIn} />
      </SafeAreaView>
    );
  }

  // Default: Show Sign In with a Sign Up button
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
        <TouchableOpacity style={styles.signUpButton} onPress={switchToSignUp}>
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
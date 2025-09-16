import React, { useState } from 'react';
import { StatusBar, StyleSheet, Button,Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import SignIn from '../components/SignIn';
import SignUp from '../components/SignUp';

import { AuthScreenProps } from '../types/navigation'; 

const AuthScreen: React.FC<AuthScreenProps> = ({ navigation }) => {
    // false = Signup page, true = Signin page
    const [isSignUp, setIsSignUp] = useState<boolean>(false);
    // Function to switch to the SignUp form
    const switchToSignUp = () => {
      setIsSignUp(true);
    };
  
    // Function to switch to the SignIn form
    const switchToSignIn = () => {
      setIsSignUp(false);
    };
  
    return (
      <SafeAreaView style={styles.flexContainer}>
        <StatusBar barStyle="dark-content" />
        {!isSignUp ? (
          <SignUp onSwitchToSignIn={switchToSignUp} />
        ) : (
          <SignIn onSwitchToSignUp={switchToSignIn} 
          // Navigates to homepage after signing in
          // Add button that goes back to sign up later 
          navigation={navigation}/>
        )}
      </SafeAreaView>
    );
  };
  
  const styles = StyleSheet.create({
      flexContainer: {
          flex: 1,
      }
  })
  
  export default AuthScreen;
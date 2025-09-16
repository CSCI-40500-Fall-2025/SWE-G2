import React, { useState } from 'react';
import { Text, TextInput, Alert,StyleSheet, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SignUpFormProps } from '../types/navigation'; 
  
const SignUp: React.FC<SignUpFormProps> = ({ onSwitchToSignIn }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
  
    const handleSignUp = () => {
        // If one of the inputs not filled
      if (!email || !password || !confirmPassword) {
        Alert.alert("Error", "Please fill in the form completely");
        return;
      }
      // If password and confirm password do not match
      if(password !== confirmPassword){
        Alert.alert("Error", "Passwords do not match.");
        return; 
      }
        Alert.alert("Signed Up", `Welcome ${email}`);
        // Calls parameter function
        onSwitchToSignIn();
    };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Sign Up</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        textContentType="emailAddress"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true} 
        value={password}
        onChangeText={setPassword}
        textContentType="oneTimeCode"
      />

      <TextInput
        style={styles.input}
        placeholder="Retype Password"
        secureTextEntry={true} 
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        textContentType="oneTimeCode"
      />
      <Button title="Sign In" onPress={handleSignUp} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 50,
    backgroundColor: "#fff",
    height:'80%',
  },
  heading: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 50,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
});

export default SignUp;
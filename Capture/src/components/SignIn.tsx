import React, {useState} from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { validateEmail, validateSignInPassword } from "../utils/validation";
interface SignInProps {
  onSwitchToSignUp: () => void;
  navigation: any;
}

const SignIn: React.FC<SignInProps> = ({ onSwitchToSignUp, navigation }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });
  
  const handleSignIn = () => {
    
    //error state structure
    const newErrors = {
      email: '',
      password: '',
    };
    let isValid = true;

    //email validation
    const emailCheck = validateEmail(formData.email);
    if (!emailCheck.valid) {
      newErrors.email = emailCheck.error;
      isValid = false;
    }

    //password validation
    const passwordCheck = validateSignInPassword(formData.password);
    if (!passwordCheck.valid) {
      newErrors.password = passwordCheck.error;
      isValid = false;
    }

    setErrors(newErrors);

    // if (!isValid) {
    //   console.log('Validation failed:', newErrors);
    //   return; //stop here if invalid input
    // }

    //if everything is valid, continue sign-in logic
    console.log('Validation passed. Navigating to HomeTabs...');
    navigation.navigate('HomeTabs');
    };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email or Username"
        placeholderTextColor="#999"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#999"
        secureTextEntry
      />
      
      <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
        <Text style={styles.signInButtonText}>Sign In</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: 'white',
  },
  signInButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  signInButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SignIn;
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { validateUsername, validateEmail, validatePassword, validateConfirmPassword} from '../utils/validation';
import log from '../utils/logger';
import API_BASE from "../utils/api";

interface SignUpProps {
  onSwitchToSignIn: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ onSwitchToSignIn }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    //clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors = {
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    };

    let isValid = true;

    //username validation
    const usernameCheck = validateUsername(formData.username);
    if (!usernameCheck.valid) {
      log.warn("WARNING: SignUp - username validation failed");
      newErrors.username = usernameCheck.error;
      isValid = false;
    }

    //email validation
    const emailCheck = validateEmail(formData.email);
    if (!emailCheck.valid) {
      log.warn("WARNING: SignUp - email validation failed");
      newErrors.email = emailCheck.error;
      isValid = false;
    }

    //password validation
    const passwordCheck = validatePassword(formData.password);
    if (!passwordCheck.valid) {
      log.warn("WARNING: SignUp - password validation failed");
      newErrors.password = passwordCheck.error;
      isValid = false;
    }

    //confirm password validation
    const confirmCheck = validateConfirmPassword(
      formData.password,
      formData.confirmPassword
    );
    if (!confirmCheck.valid) {
      log.warn("WARNING: SignUp - confirm password validation failed");
      newErrors.confirmPassword = confirmCheck.error;
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

const handleSignUp = async () => {
  if (!validateForm()) {
    Alert.alert("Error", "Please fix the errors in the form");
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/user/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        // backend expects: name, user_name, email, password
        user_name: formData.username,   // map your field name to backend
        email: formData.email,
        password: formData.password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      Alert.alert("Sign up failed", data.message || "Unknown error");
      return;
    }

    Alert.alert("Success!", "Account created successfully! Please sign in.", [
      {
        text: "OK",
        onPress: () => {
          // Clear form and switch to sign in
          setFormData({
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
          });
          onSwitchToSignIn();
        },
      },
    ]);
  } catch (err) {
    console.error(err);
    Alert.alert("Error", "Could not connect to server");
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      
      {/* Username Field */}
      <View>
        <TextInput
          style={[styles.input, errors.username && styles.inputError]}
          placeholder="Username"
          placeholderTextColor="#999"
          autoCapitalize="none"
          autoComplete="username"
          value={formData.username}
          onChangeText={(text) => handleInputChange('username', text)}
        />
        {errors.username ? <Text style={styles.errorText}>{errors.username}</Text> : null}
      </View>
      
      {/* Email Field */}
      <View>
        <TextInput
          style={[styles.input, errors.email && styles.inputError]}
          placeholder="Email"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          value={formData.email}
          onChangeText={(text) => handleInputChange('email', text)}
        />
        {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
      </View>
      
      {/* Password Field */}
      <View>
        <TextInput
          style={[styles.input, errors.password && styles.inputError]}
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry
          textContentType="newPassword"
          autoComplete="new-password"
          autoCapitalize="none"
          value={formData.password}
          onChangeText={(text) => handleInputChange('password', text)}
        />
        {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
      </View>
      
      {/* Confirm Password Field */}
      <View>
        <TextInput
          style={[styles.input, errors.confirmPassword && styles.inputError]}
          placeholder="Confirm Password"
          placeholderTextColor="#999"
          secureTextEntry
          textContentType="newPassword"
          autoComplete="new-password"
          autoCapitalize="none"
          value={formData.confirmPassword}
          onChangeText={(text) => handleInputChange('confirmPassword', text)}
        />
        {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}
      </View>
      
      <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
        <Text style={styles.signUpButtonText}>Create Account</Text>
      </TouchableOpacity>
      
      <View style={styles.switchContainer}>
        <Text style={styles.switchText}>Already have an account? </Text>
        <TouchableOpacity onPress={onSwitchToSignIn}>
          <Text style={styles.switchLink}>Sign In</Text>
        </TouchableOpacity>
      </View>
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
    marginBottom: 5, // Reduced margin since error text will take space
    fontSize: 16,
    backgroundColor: 'white',
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginBottom: 10,
    marginLeft: 5,
  },
  signUpButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  signUpButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  switchText: {
    fontSize: 16,
    color: '#666',
  },
  switchLink: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
});

export default SignUp;
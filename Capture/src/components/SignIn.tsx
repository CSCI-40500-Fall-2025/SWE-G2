import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,              
} from "react-native";
import { validateEmail, validateSignInPassword } from "../utils/validation";
import log from "../utils/logger";
import API_BASE from "../utils/api";

interface SignInProps {
  onSwitchToSignUp: () => void;
  navigation: any;
}

const SignIn: React.FC<SignInProps> = ({ onSwitchToSignUp, navigation }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (field: "email" | "password", value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSignIn = async () => {
    const newErrors = { email: "", password: "" };
    let isValid = true;

    // email validation
    const emailCheck = validateEmail(formData.email);
    if (!emailCheck.valid) {
      log.warn("WARNING: SignIn - email validation failed");
      newErrors.email = emailCheck.error;
      isValid = false;
    }

    // password validation
    const passwordCheck = validateSignInPassword(formData.password);
    if (!passwordCheck.valid) {
      log.warn("WARNING: SignIn - password validation failed");
      newErrors.password = passwordCheck.error;
      isValid = false;
    }

    setErrors(newErrors);
    if (!isValid) return;

    try {
      const response = await fetch(`${API_BASE}/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Sign in failed", data.message || "Unknown error");
        return;
      }

      log.info("INFO: SignIn - user successfully signed in");
      navigation.navigate("HomeTabs");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Could not connect to server");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>

      <TextInput
        style={[styles.input, errors.email && styles.inputError]}
        placeholder="Email"
        placeholderTextColor="#999"
        autoCapitalize="none"
        keyboardType="email-address"
        value={formData.email}
        onChangeText={(text) => handleInputChange("email", text)}
      />

      <TextInput
        style={[styles.input, errors.password && styles.inputError]}
        placeholder="Password"
        placeholderTextColor="#999"
        secureTextEntry
        value={formData.password}
        onChangeText={(text) => handleInputChange("password", text)}
      />

      {errors.email ? (
        <Text style={styles.errorText}>{errors.email}</Text>
      ) : null}
      {errors.password ? (
        <Text style={styles.errorText}>{errors.password}</Text>
      ) : null}

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
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: "white",
  },
  inputError: {
    borderColor: "#FF3B30",
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 14,
    marginBottom: 5,
    marginLeft: 5,
  },
  signInButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  signInButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default SignIn;

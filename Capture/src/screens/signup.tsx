import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";

const SignUpForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState<string[]>(["",""]);

  const handleSignUp = () => {
    if (!email || !password[0] || !password[1]) {
      Alert.alert("Error", "Please fill in the form completely");
      return;
    }
    if(password[0] != password[1]){
      Alert.alert("Error", "Please retype the correct password");
    }
    // Replace this with your real sign-in logic (API call, Firebase, etc.)
    Alert.alert("Signed In", `Welcome ${email}`);
  };
  const handleSetPassword = (index: number, value: string) =>{
    const update = [...password];
    update[index] = value;
    setPassword(update);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Sign Up</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password[0]}
        onChangeText={(text) => handleSetPassword(0,text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Retype Password"
        secureTextEntry
        value={password[1]}
        onChangeText={(text) => handleSetPassword(1,text)}
      />
      <Button title="Sign In" onPress={handleSignUp} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
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
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
});

export default SignUpForm;
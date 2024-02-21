import { View, StyleSheet, Text, KeyboardAvoidingView } from "react-native";
import { TextInput, Button, ActivityIndicator } from "react-native-paper";
import React from "react";
import { useState } from "react";
import { FIREBASE_AUTH } from "../../FirebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NavigationProp } from "@react-navigation/native";
interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const Login = ({ navigation }: RouterProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const auth = FIREBASE_AUTH;
  const [validated, setValidated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const signIn = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log(response);
    } catch (error: any) {
      console.log(error);
      alert(`Sign in failed: ${error.message} `);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior="padding">
        <TextInput
          style={styles.input}
          mode="outlined"
          placeholder="Email"
          outlineColor="black"
          activeOutlineColor="black"
          onChangeText={(text) => setEmail(text)}
        />

        <View>
          <TextInput
            style={styles.input}
            secureTextEntry={!showPassword}
            mode="outlined"
            placeholder="Password"
            outlineColor="black"
            activeOutlineColor="black"
            onChangeText={(text) => setPassword(text)}
          />
          <MaterialCommunityIcons
            name={showPassword ? "eye-off" : "eye"}
            size={24}
            color="#aaa"
            style={styles.icon}
            onPress={toggleShowPassword}
          />
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="black" />
        ) : (
          <View>
            <Button
              mode="contained"
              buttonColor="black"
              style={styles.button}
              onPress={() => {
                signIn();
              }}
            >
              Login
            </Button>
            <Button
              mode="text"
              textColor="black"
              style={styles.button}
              onPress={() => {
                navigation.navigate("Register");
              }}
            >
              Don't have an account? Sign Up
            </Button>
          </View>
        )}
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    // alignItems: "center",
  },
  input: {
    width: "80%",
    marginLeft: "auto",
    marginRight: "auto",
    margin: 10,
  },
  button: {
    borderRadius: 10,
    margin: 10,
    width: "60%",
    marginLeft: "auto",
    marginRight: "auto",
  },
  icon: {
    marginLeft: "80%",
    marginTop: "6%",
    position: "absolute",
  },
});

export default Login;

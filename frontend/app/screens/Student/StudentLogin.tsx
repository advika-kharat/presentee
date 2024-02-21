import {
  View,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  ImageBackground,
} from "react-native";
import { TextInput, Button, ActivityIndicator } from "react-native-paper";
import React from "react";
import { useState } from "react";
import { FIREBASE_AUTH } from "../../../FirebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NavigationProp } from "@react-navigation/native";
import LandingNavbar from "../LandingNavbar";
import Navbar from "../Navbar";
interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const StudentLogin = ({ navigation }: RouterProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const signIn = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate("StudentCourses");
      console.log(response);
    } catch (error: any) {
      console.log(error);
      alert(`Sign in failed: ${error.message} `);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require("../assets/background.jpg")}
      style={styles.background}
    >
      <View style={styles.container}>
        <Navbar navigation={navigation} onlyBackAction={true} />
        <KeyboardAvoidingView
          behavior="padding"
          style={{ flex: 1, justifyContent: "center" }}
        >
          <Text style={styles.textStyle}>Log in as Student</Text>
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
                  navigation.navigate("StudentRegister");
                }}
              >
                Don't have an account? Sign Up
              </Button>
            </View>
          )}
        </KeyboardAvoidingView>
      </View>
    </ImageBackground>
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
  },
  textStyle: {
    justifyContent: "center",
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    margin: 10,
    padding: 10,
    lineHeight: 28,
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

export default StudentLogin;

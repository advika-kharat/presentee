import {
  View,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { TextInput, Button, ActivityIndicator } from "react-native-paper";
import React from "react";
import { useState } from "react";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../../FirebaseConfig";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import PasswordValidate from "react-native-password-validate-checklist";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { doc, setDoc } from "firebase/firestore";

import { NavigationProp } from "@react-navigation/native";
import Navbar from "../Navbar";
interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const TeacherRegister = ({ navigation }: RouterProps) => {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;
  const [validated, setValidated] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const toggleShowPassword1 = () => {
    setShowPassword1(!showPassword1);
  };
  const toggleShowPassword2 = () => {
    setShowPassword2(!showPassword2);
  };

  const signUp = async () => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password1
      );

      await updateProfile(userCredential.user, {
        displayName: displayName,
      });

      await setDoc(doc(FIRESTORE_DB, "Teacher", email), {
        name: displayName,
        email: email,
        courses: [],
      });

      navigation.navigate("TeacherProfile");
      console.log("User registered successfully:", userCredential.user);
    } catch (error: any) {
      console.log(error);
      alert(`Sign up failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Navbar navigation={navigation} onlyBackAction={true}/>
      <ScrollView>
        <Text style={styles.textStyle}>Sign up as Teacher</Text>
        <TextInput
          style={styles.input}
          mode="outlined"
          placeholder="Username"
          outlineColor="black"
          activeOutlineColor="black"
          onChangeText={(text) => setDisplayName(text)}
        />

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
            // secureTextEntry={true}
            mode="outlined"
            placeholder="Password"
            outlineColor="black"
            activeOutlineColor="black"
            secureTextEntry={!showPassword1}
            onChangeText={(text) => setPassword1(text)}
          />
          <MaterialCommunityIcons
            name={showPassword1 ? "eye-off" : "eye"}
            size={24}
            color="#aaa"
            style={styles.icon}
            onPress={toggleShowPassword1}
          />
        </View>

        <View>
          <TextInput
            style={styles.input}
            secureTextEntry={!showPassword2}
            mode="outlined"
            placeholder="Confirm Password"
            outlineColor="black"
            activeOutlineColor="black"
            onChangeText={(text) => setPassword2(text)}
          />

          <MaterialCommunityIcons
            name={showPassword2 ? "eye-off" : "eye"}
            size={24}
            color="#aaa"
            style={styles.icon}
            onPress={toggleShowPassword2}
          />
        </View>

        <View style={{ width: "80%", marginLeft: "auto", marginRight: "auto" }}>
          {validated ? (
            <Text> Passwords Match</Text>
          ) : (
            <Text> Passwords Do not Match</Text>
          )}
          <PasswordValidate
            newPassword={password1}
            confirmPassword={password2}
            validationRules={[
              {
                key: "MIN_LENGTH",
                ruleValue: 9,
                label: "Should contain more than 9 characters",
              },
              { key: "LOWERCASE_LETTER" },
              { key: "UPPERCASE_LETTER" },
              { key: "NUMERIC" },
              { key: "PASSWORDS_MATCH"  },
            ]}
            onPasswordValidateChange={(validatedBoolean) =>
              setValidated(validatedBoolean)
            }
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
                if (validated) {
                  signUp();
                } else {
                  alert("Please check all the conditions");
                }
              }}
            >
              Sign Up
            </Button>
            <Button
              textColor="black"
              onPress={() => navigation.navigate("TeacherLogin")}
            >
              Already have an account? Login
            </Button>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    // marginTop: "10%",
  },
  textStyle: {
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
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

export default TeacherRegister;

import {
  View,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  ImageBackground,
} from "react-native";
import { TextInput, Button, ActivityIndicator } from "react-native-paper";
import React from "react";
import { useState } from "react";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../../FirebaseConfig";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import PasswordValidate from "react-native-password-validate-checklist";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  doc,
  setDoc,
  collection,
  getDocs,
  where,
  query,
} from "firebase/firestore";

import { NavigationProp } from "@react-navigation/native";
import Navbar from "../Navbar";
interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const CreateCourse = ({ navigation }: RouterProps) => {
  const [course, setCourse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addCourse = async () => {
    setLoading(true);
    try {
      const currentUser = FIREBASE_AUTH.currentUser;
      if (currentUser) {
        const courseQuery = query(
          collection(FIRESTORE_DB, "Courses"),
          where("courseName", "==", course)
        );
        const querySnapshot = await getDocs(courseQuery);
        if (!querySnapshot.empty) {
          setError("Course already exists.");
          return;
        }

        const courseRef = doc(collection(FIRESTORE_DB, "Courses"), course);
        await setDoc(courseRef, {
          courseName: course,
          instructor: currentUser.displayName,
          students: [],
        });

        const teacherRef = doc(
          collection(FIRESTORE_DB, "Teacher"),
          currentUser.email || ""
        );
        await setDoc(teacherRef, {
          courseName: course,
        });

        console.log("Course added successfully");
        navigation.navigate("TeacherCourses");
      }

      console.log("successful");
      navigation.navigate("TeacherCourses");
    } catch (error: any) {
      console.log(error);
      alert(`failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require("../assets/background.jpg")}
      style={styles.background}
    >
      <Navbar navigation={navigation} onlyBackAction={true} />
      <View style={styles.container}>
        <TextInput
          mode="outlined"
          placeholder="Course Name"
          outlineColor="black"
          activeOutlineColor="black"
          style={styles.input}
          onChangeText={(text) => {
            setCourse(text);
            setError(""); // Reset error message when typing
          }}
        />

        {error ? <Text>{error}</Text> : null}

        {loading ? (
          <ActivityIndicator size="large" color="black" />
        ) : (
          <Button
            mode="contained"
            buttonColor="black"
            style={styles.button}
            onPress={addCourse}
          >
            Add Course
          </Button>
        )}
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
    alignItems: "center",
  },
  input: {
    width: "80%",
    marginLeft: "auto",
    marginRight: "auto",
  },
  button: {
    borderRadius: 10,
    margin: 10,
    width: "60%",
    marginLeft: "auto",
    marginRight: "auto",
    backgroundColor: "#3C6696",
  },
});

export default CreateCourse;

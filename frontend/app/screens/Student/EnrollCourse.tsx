import {
  View,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  FlatList,
} from "react-native";
import { TextInput, Button, ActivityIndicator } from "react-native-paper";
import React from "react";
import { useState, useEffect } from "react";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../../FirebaseConfig";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import PasswordValidate from "react-native-password-validate-checklist";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { doc, setDoc, collection, getDoc, getDocs } from "firebase/firestore";

interface Course {
  courseName: string;
  instructor: string;
}

import { NavigationProp } from "@react-navigation/native";
interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const EnrollCourse = ({ navigation }: RouterProps) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const fetchCourses = async () => {
    try {
      const currentUser = FIREBASE_AUTH.currentUser;
      if (currentUser) {
        const querySnapshot = await getDocs(
          collection(FIRESTORE_DB, "Courses")
        );
        const courseData: Course[] = [];
        querySnapshot.forEach((doc) => {
          const { courseName, instructor } = doc.data();
          courseData.push({ courseName, instructor });
        });
        console.log(courseData);
        setCourses(courseData);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };
  useEffect(() => {
    fetchCourses();
  }, []);

  const renderCourseItem = ({ item }: { item: Course }) => (
    <View style={styles.courseItemContainer}>
      <Text>{item.courseName}</Text>
      <Text>Instructor: {item.instructor}</Text>
    </View>
  );

  return (
    <View>
      <Text>Enrol</Text>
      <FlatList
        data={courses}
        renderItem={renderCourseItem}
        keyExtractor={(item, index) => `${item.courseName}_${index}`}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  courseItemContainer: {
    backgroundColor: "lightgrey",
    marginVertical: 5,
    padding: 10,
  },
});

export default EnrollCourse;

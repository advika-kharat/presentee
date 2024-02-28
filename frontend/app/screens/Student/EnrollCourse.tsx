import {
  View,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  FlatList,
  ImageBackground,
  RefreshControl,
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
import Navbar from "../Navbar";
import CourseEnrollment from "../../components/CourseEnrollment";
interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const EnrollCourse = ({ navigation }: RouterProps) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
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
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <ImageBackground
      source={require("../assets/background.jpg")}
      style={styles.background}
    >
      <Navbar navigation={navigation} onlyBackAction={true} />
      <View style={{ flex: 1 }}>
        <Text style={styles.text}>Enroll in course</Text>

        <ScrollView style={{ flex: 0.1 }}>
          {courses.map((course, index) => (
            <CourseEnrollment
              key={index}
              courseName={course.courseName}
              instructor={course.instructor}
              num={index}
            />
          ))}
        </ScrollView>
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
  courseItemContainer: {
    backgroundColor: "white",
    marginVertical: 5,
    padding: 10,
  },
  text: {
    fontSize: 25,
    fontWeight: "600",
    margin: "10%",
  },
});

export default EnrollCourse;

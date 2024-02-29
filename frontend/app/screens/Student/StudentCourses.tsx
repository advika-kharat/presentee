import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  RefreshControl,
  ScrollView,
} from "react-native";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../../FirebaseConfig";
import { ActivityIndicator, FAB, Button } from "react-native-paper";
import { Timestamp, doc, getDoc } from "firebase/firestore";
import DataTable from "react-native-paper";

import { NavigationProp } from "@react-navigation/native";
import Navbar from "../Navbar";

interface Student {
  name: String;
  uid: String;
  email: String;
  courses: {
    attendedOn: {
      present: boolean;
      date: Timestamp;
    };
    courseName: String;
  }[];
}

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const StudentCourses = ({ navigation }: RouterProps) => {
  const [courses, setCourses] = useState<Student["courses"]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      // Fetch courses from Firestore
      const currentUser = FIREBASE_AUTH.currentUser;
      if (currentUser) {
        const studentEmail = currentUser.email;
        const studentDoc = doc(FIRESTORE_DB, "Student", studentEmail || "");
        const studentSnap = await getDoc(studentDoc);
        if (studentSnap.exists()) {
          const studentData = studentSnap.data() as Student;
          setCourses(studentData.courses);
        }
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAttendancePercentage = (courseName: String) => {
    const courseAttendances = courses.filter(
      (course) => course.courseName === courseName && course.attendedOn
    );

    const totalAttendances = courseAttendances.length;
    const presentAttendances = courseAttendances.filter(
      (course) => course.attendedOn.present
    ).length;

    if (totalAttendances === 0) {
      return 0; // Avoid division by zero
    }

    return (presentAttendances / totalAttendances) * 100;
  };

  return (
    <ImageBackground
      source={require("../assets/background.jpg")}
      style={styles.background}
    >
      <Navbar navigation={navigation} onlyBackAction={true} />
      <View style={styles.container}>
        <Text style={styles.title}>My Courses</Text>
        {loading ? (
          <ActivityIndicator size="large" color="black" />
        ) : (
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={loading} onRefresh={fetchCourses} />
            }
          >
            {courses.map((course, index) => {
              if (
                index === 0 ||
                course.courseName !== courses[index - 1].courseName
              ) {
                const percentage = calculateAttendancePercentage(
                  course.courseName
                );
                return (
                  <View key={index} style={styles.courseItemContainer}>
                    <Text style={{ fontWeight: "500" }}>
                      {course.courseName}
                    </Text>
                    <Text
                      style={{
                        position: "absolute",
                        right: 10,
                        margin: 20,
                        verticalAlign: "middle",
                        color: percentage < 75.0 ? "red" : "green",
                        fontWeight: "500",
                      }}
                    >
                      {percentage.toFixed(2)}%
                    </Text>
                  </View>
                );
              }
              return null; // Skip displaying for duplicate course names
            })}
          </ScrollView>
        )}
        <FAB
          icon="plus"
          style={styles.fab}
          color="white"
          onPress={() => navigation.navigate("EnrollCourse")}
        />
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
  },
  title: {
    margin: 20,
    fontSize: 20,
    fontWeight: "500",
  },
  courseItemContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    marginBottom: 10,
    padding: 20,
    width: "90%",
    marginLeft: "auto",
    marginRight: "auto",
    elevation: 5,
  },
  button: {
    position: "absolute",
    right: 10,
    top: 10,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 15,
    color: "black",
  },
  fab: {
    backgroundColor: "#0C328A",
    position: "absolute",
    bottom: 10,
    right: 10,
  },
});

export default StudentCourses;

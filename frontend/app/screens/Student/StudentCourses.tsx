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

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const currentUser = FIREBASE_AUTH.currentUser;
      if (currentUser) {
        const studentEmail = currentUser.email;
        const studentDoc = doc(FIRESTORE_DB, "Student", studentEmail || "");
        const studentSnap = await getDoc(studentDoc);
        if (studentSnap.exists()) {
          const studentData = studentSnap.data() as Student;
          if (studentData && studentData.courses) {
            setCourses(studentData.courses);
          }
        }
      }
    } catch (error: any) {
      console.log("Error fetching courses:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const calculatePercentage = (attendedOn: { present: boolean }[]) => {
    const total = attendedOn.length;
    const presentCount = attendedOn.filter((item) => item.present).length;
    const percentage = (presentCount / total) * 100 || 0;
    return percentage.toFixed(2);
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
            {courses.map((course, index) => (
              <View style={styles.courseItemContainer} key={index}>
                <Text>{course.courseName}</Text>
                <Text>{calculatePercentage([course.attendedOn])}%</Text>
                <Button
                  style={styles.button}
                  labelStyle={styles.buttonText}
                  buttonColor="#B8E2FC"
                >
                  View Attendance
                </Button>
              </View>
            ))}
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

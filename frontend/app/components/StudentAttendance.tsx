import {
  View,
  Text,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Timestamp, doc, getDoc } from "firebase/firestore";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../FirebaseConfig";
import styles from "react-native-password-validate-checklist/src/styles";

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

const StudentAttendance = ({
  studentName,
  studentEmail,
  studentUid,
  courseName,
}: any) => {
  const [courses, setCourses] = useState<Student["courses"]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const studentDocRef = doc(FIRESTORE_DB, "Student", studentEmail || "");
      console.log("Student Document Reference:", studentDocRef.path);
      const studentSnap = await getDoc(studentDocRef);
      if (studentSnap.exists()) {
        const studentData = studentSnap.data() as Student;
        const filteredCourses = studentData.courses.filter(
          (course) => course.courseName === courseName
        );
        setCourses(filteredCourses);
      } else {
        console.error("Student document does not exist");
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
    <View>
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
                <View key={index}>
                  <Text style={{ fontWeight: "500" }}>{course.courseName}</Text>
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
    </View>
  );
};

export default StudentAttendance;

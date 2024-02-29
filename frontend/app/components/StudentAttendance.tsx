import {
  View,
  Text,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Timestamp, doc, getDoc } from "firebase/firestore";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../FirebaseConfig";

const StudentAttendance = ({
  studentName,
  studentEmail,
  studentUid,
  courseName,
}: any) => {
  const [loading, setLoading] = useState(false);
  const [attendancePercentage, setAttendancePercentage] = useState<
    number | null
  >(null);

  const fetchAttendancePercentage = async () => {
    setLoading(true);
    try {
      const studentDocRef = doc(FIRESTORE_DB, "Student", studentEmail || "");
      const studentSnap = await getDoc(studentDocRef);
      if (studentSnap.exists()) {
        const studentData = studentSnap.data();
        //console.log(studentData);
        const courses = studentData?.courses || [];
        const filteredCourses = courses.filter(
          (course: any) => course.courseName === courseName && course.attendedOn
        );
        const totalAttendances = filteredCourses.length;
        const presentAttendace = filteredCourses.filter(
          (course: any) => course.attendedOn.present
        ).length;
        const percentage =
          totalAttendances === 0
            ? 0
            : (presentAttendace / totalAttendances) * 100;
        setAttendancePercentage(percentage);
      } else {
        console.log("student doc doesnt exist");
      }
    } catch (e: any) {
      console.log(e.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAttendancePercentage();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="black" />;
  }

  return (
    <View>
      <Text
        style={{
          fontSize: 16,
          color:
            attendancePercentage && attendancePercentage < 75 ? "red" : "green",
        }}
      >
        {attendancePercentage !== null
          ? attendancePercentage.toFixed(2) + "%"
          : 0}
      </Text>
    </View>
  );
};

export default StudentAttendance;

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Button,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../../FirebaseConfig";
import { ActivityIndicator, Checkbox } from "react-native-paper";
import { signOut } from "firebase/auth";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";

import { NavigationProp } from "@react-navigation/native";
import Navbar from "../Navbar";

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

interface StudentInfo {
  name: string;
  email: string;
  uid: string;
  present: boolean;
}

const DatesAttendance = ({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) => {
  const { courseName, instructor } = route.params;
  const [students, setStudents] = useState<StudentInfo[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchStudentsEnrolled = async () => {
    setLoading(true);
    try {
      const courseRef = collection(FIRESTORE_DB, "Courses");
      const querySnapshot = await getDocs(courseRef);
      const enrolledStudents = querySnapshot.docs
        .filter((doc) => doc.data().courseName === courseName)
        .map((doc) => doc.data().students)
        .flat();

      const studentInfo: StudentInfo[] = enrolledStudents.map((student) => ({
        name: student.studentName,
        email: student.studentEmail,
        uid: student.studentUid,
        present: student.present,
      }));

      setStudents(studentInfo);
    } catch (error: any) {
      console.log("Error fetching students:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentsEnrolled();
  }, []);

  // const handleConfirmAttendance = async () => {
  //   setLoading(true);
  //   try {
  //     const currentDate = new Date();
  //     const attendanceDate = Timestamp.fromDate(currentDate);

  //     const checkedStudentsData = students
  //       .filter((student) => student.present)
  //       .map((student) => ({
  //         studentName: student.name,
  //         studentEmail: student.email,
  //         present: student.present,
  //       }));

  //     const timestampString = attendanceDate.toDate().toISOString();

  //     const dataRef = doc(collection(FIRESTORE_DB, "Date"), timestampString);
  //     await setDoc(dataRef, {
  //       date: timestampString,
  //       courseName: courseName,
  //       courseInstructor: instructor,
  //       students: checkedStudentsData,
  //     });

  //     // Save attendance data in Student collection for each checked student
  //     const batch: any[] = [];
  //     checkedStudentsData.forEach(async (student) => {
  //       const studentRef = doc(
  //         collection(FIRESTORE_DB, "Student"),
  //         student.studentEmail
  //       );
  //       batch.push(
  //         updateDoc(studentRef, {
  //           courses: arrayUnion({
  //             courseName: courseName,
  //             attendedOn: {
  //               date: attendanceDate,
  //               present: student.present,
  //             },
  //           }),
  //         })
  //       );
  //     });
  //     await Promise.all(batch);

  //     alert("Attendance Taken Successfully.");
  //   } catch (error: any) {
  //     console.log("Error storing attendance:", error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleConfirmAttendance = async () => {
    setLoading(true);
    try {
      const currentDate = new Date();
      const attendanceDate = Timestamp.fromDate(currentDate);

      // Map over all students, not just the present ones
      const allStudentsData = students.map((student) => ({
        studentName: student.name,
        studentEmail: student.email,
        present: !!student.present,
      }));

      const timestampString = attendanceDate.toDate().toISOString();

      console.log("allStudentsData:", allStudentsData);

      const dataRef = doc(collection(FIRESTORE_DB, "Date"), timestampString);
      await setDoc(dataRef, {
        date: timestampString,
        courseName: courseName,
        courseInstructor: instructor,
        students: allStudentsData, // Save data for all students
      });

      // Save attendance data in Student collection for each student
      const batch: any[] = [];
      allStudentsData.forEach(async (student) => {
        const studentRef = doc(
          collection(FIRESTORE_DB, "Student"),
          student.studentEmail
        );
        batch.push(
          updateDoc(studentRef, {
            courses: arrayUnion({
              courseName: courseName,
              attendedOn: {
                date: attendanceDate,
                present: student.present,
              },
            }),
          })
        );
      });
      await Promise.all(batch);

      alert("Attendance Taken Successfully.");
    } catch (error: any) {
      console.log("Error storing attendance:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePresent = (student: StudentInfo) => {
    setStudents((prevStudents) =>
      prevStudents.map((s) =>
        s.uid === student.uid ? { ...s, present: !s.present } : s
      )
    );
  };

  return (
    <ImageBackground
      source={require("../assets/background.jpg")}
      style={styles.background}
    >
      <Navbar navigation={navigation} onlyBackAction={true} />
      <View style={{ flex: 1 }}>
        <View style={styles.container}>
          <Text style={styles.heading}>Course: {courseName}</Text>
          <Text style={styles.subheading}>Instructor: {instructor}</Text>
          <Text style={styles.subheading}>Students Enrolled:</Text>
          {students.map((student, index) => (
            <View key={index} style={styles.studentItem}>
              <Text>{student.name}</Text>

              <View
                style={{
                  position: "absolute",
                  right: 10,
                  flexDirection: "row",
                }}
              >
                <Text
                  style={{
                    verticalAlign: "middle",
                  }}
                >
                  {student.present ? "Present" : "Absent"}
                </Text>
                <Checkbox
                  status={student.present ? "checked" : "unchecked"}
                  onPress={() => {
                    handlePresent(student);
                  }}
                />
              </View>
            </View>
          ))}
          {loading ? (
            <ActivityIndicator />
          ) : (
            <Button
              title="Confirm Attendance"
              onPress={handleConfirmAttendance}
            />
          )}
        </View>
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
    padding: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subheading: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  studentItem: {
    backgroundColor: "white",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    flexDirection: "row",
  },
});

export default DatesAttendance;

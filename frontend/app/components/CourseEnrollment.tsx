import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Button,
  PaperProvider,
  Portal,
  TextInput,
} from "react-native-paper";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../FirebaseConfig";
import {
  doc,
  getDoc,
  collection,
  FieldValue,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";

const CourseEnrollment = ({ courseName, instructor, num }: any) => {
  const [loading, setLoading] = useState(false);
  const [enrolled, setEnrolled] = useState("");
  const [courseConfirm, setCourseConfirm] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [displayNotConfirm, setDisplayNotConfirm] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  const [visible, setVisible] = React.useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = {
    backgroundColor: "transparent",
    padding: 20,
    height: 100,
  };

  const enrollStudent = async () => {
    setLoading(true);
    try {
      const currentUser = FIREBASE_AUTH.currentUser;
      if (currentUser) {
        const docRef = doc(FIRESTORE_DB, "Student", currentUser.email || " ");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const studentData = docSnap.data();
          console.log("Student data:", studentData); // Add this line

          const studentEmail = studentData.email;

          const isAlreadyEnrolled = studentData.courses.some(
            (course: any) => course.courseName === courseName
          );

          if (isAlreadyEnrolled) {
            setIsEnrolled(true);
            alert(`You are already enrolled in this course!`);
            return;
          }

          // Update the student document with the new course
          await updateDoc(docRef, {
            courses: arrayUnion({ courseName }),
          });

          // Update the course document with the new student
          await updateDoc(doc(FIRESTORE_DB, "Courses", courseName), {
            students: arrayUnion({
              studentName: studentData.name,
              studentEmail: studentEmail,
              studentUid: studentData.uid,
              studentAttendance: [],
            }),
          });

          console.log("Document data:", docSnap.data());
          alert(`Successfully enrolled in ${courseName}`);
        } else {
          console.log("No such document!");
        }
      }
    } catch (e: any) {
      console.log(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleModalButton = () => {
    if (courseConfirm === courseName) {
      enrollStudent();
      setIsConfirmed(true);
      setDisplayNotConfirm(false);
      setVisible(false);
    } else {
      setIsConfirmed(false);
      setDisplayNotConfirm(true);
    }
  };

  return (
    <View style={styles.container}>
      <PaperProvider>
        <Portal>
          <Modal
            visible={visible}
            onDismiss={hideModal}
            transparent={true}
            animationType="fade"
          >
            <TouchableWithoutFeedback onPress={hideModal}>
              <View style={styles.modalContainer}>
                <View style={styles.modalView}>
                  <View>
                    <Text style={{ marginBottom: 20, fontSize: 15 }}>
                      Please type{" "}
                      <Text style={{ fontWeight: "500" }}>"{courseName}"</Text>{" "}
                      to enroll in this course.
                    </Text>
                    <TextInput
                      placeholder={courseName}
                      mode="outlined"
                      outlineColor="grey"
                      activeOutlineColor="#011E91"
                      onChangeText={(text) => setCourseConfirm(text)}
                    />
                    {loading ? (
                      <ActivityIndicator />
                    ) : (
                      <>
                        <Button
                          onPress={handleModalButton}
                          buttonColor="#0075E2"
                          textColor="white"
                          style={{
                            borderRadius: 5,
                            marginTop: 10,
                            marginBottom: 10,
                          }}
                        >
                          Confirm
                        </Button>
                        {displayNotConfirm && (
                          <Text>Please enter the correct Course Name.</Text>
                        )}
                      </>
                    )}
                  </View>
                  <Text>Click anywhere to close</Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </Portal>
        <View style={{ margin: 10 }}>
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>{courseName}</Text>
          <Text style={{ color: "grey" }}>Instructor : {instructor}</Text>
        </View>
        <Button
          style={{
            marginTop: 30,
            position: "absolute",
            right: 10,
            bottom: 10,
            width: 100,
            borderRadius: 5,
          }}
          onPress={showModal}
          labelStyle={{ fontSize: 15, color: "#FFFFFF" }}
          buttonColor="#0075E2"
        >
          Enroll
        </Button>
      </PaperProvider>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "90%",
    alignSelf: "center",
    backgroundColor: "white",
    marginBottom: 10,
    borderRadius: 10,
    elevation: 3,
  },
  textView: {},
  courseName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  instructor: {
    fontSize: 16,
    color: "gray",
    paddingBottom: 8,
  },
  button: {
    borderRadius: 20,
    overflow: "hidden",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    elevation: 5,
    width: "80%",
  },
});

export default CourseEnrollment;

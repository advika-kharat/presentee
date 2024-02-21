import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../../FirebaseConfig";
import { ActivityIndicator, Button } from "react-native-paper";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import { NavigationProp } from "@react-navigation/native";
interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const StudentProfile = ({ navigation }: RouterProps) => {
  const [username, setUsername] = useState("");
  const [uid, setUid] = useState("");
  const [email, setEmail] = useState("");
  const [attendance, setAttendace] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchStudentDetails = async () => {
    setLoading(true);
    try {
      const currentUser = FIREBASE_AUTH.currentUser;
      if (currentUser) {
        const docRef = doc(FIRESTORE_DB, "Student", currentUser.email || " ");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const student = docSnap.data();
          setUsername(student.name);
          setUid(student.uid);
          setEmail(student.email);
          setAttendace(student.attendance);
          console.log("Document data:", docSnap.data());
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

  useEffect(() => {
    fetchStudentDetails();
  }, []);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      {loading ? (
        <ActivityIndicator size="large" color="black" />
      ) : (
        <>
          <Text>Name :{username}</Text>
          <Text>UID :{uid}</Text>
          <Text>Email :{email}</Text>
          <Button>View Attendance</Button>
          <Button
            onPress={() => {
              signOut(FIREBASE_AUTH);
              navigation.navigate("LandingPage");
            }}
          >
            Logout
          </Button>
        </>
      )}
    </View>
  );
};

export default StudentProfile;

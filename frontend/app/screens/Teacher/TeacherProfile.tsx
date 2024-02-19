import { View, Text, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../../FirebaseConfig";
import { Button } from "react-native-paper";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import { NavigationProp } from "@react-navigation/native";
interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const TeacherProfile = ({ navigation }: RouterProps) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchTeacherDetails = async () => {
    setLoading(true);
    try {
      const currentUser = FIREBASE_AUTH.currentUser;
      if (currentUser) {
        const docRef = doc(FIRESTORE_DB, "Teacher", currentUser.email || " ");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const teacher = docSnap.data();
          setUsername(teacher.name);

          setEmail(teacher.email);

          console.log("Document data:", docSnap.data());
        } else {
          // docSnap.data() will be undefined in this case
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
    fetchTeacherDetails();
  }, []);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      {loading ? (
        <ActivityIndicator size="large" color="black" />
      ) : (
        <>
          <Text>Name :{username}</Text>
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

export default TeacherProfile;

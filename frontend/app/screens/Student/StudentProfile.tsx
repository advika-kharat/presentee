import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import React, { useEffect, useState } from "react";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../../FirebaseConfig";
import { ActivityIndicator, Button } from "react-native-paper";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import { NavigationProp } from "@react-navigation/native";
import Navbar from "../Navbar";
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
    <ImageBackground
      source={require("../assets/background.jpg")}
      style={styles.background}
    >
      <Navbar navigation={navigation} onlyBackAction={false} />

      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        {loading ? (
          <ActivityIndicator size="large" color="black" />
        ) : (
          <>
            <View style={[styles.card, styles.cardElevated]}>
              <View style={styles.headerContainer}>
                <Text style={styles.headerText}>{username}</Text>
              </View>
              <Image
                source={{
                  uri: "https://media.licdn.com/dms/image/D4D03AQHPjBYoXiTIIA/profile-displayphoto-shrink_400_400/0/1706794512809?e=1714003200&v=beta&t=wjtb89H-cJyJZrZO8VwmCMSd11EvPLA0zZ-T4h8YpBs",
                }}
                style={styles.cardImage}
              />
              <View style={styles.cardBodyContainer}>
                <Text style={styles.cardBodyText}>UID: {uid}</Text>
                <Text style={styles.cardBodyText}>EMAIl: {email}</Text>
              </View>
              <View style={styles.cardFooterContainer}>
                <TouchableOpacity onPress={() => {}}>
                  <View style={styles.cardFooterLeft}>
                    <Text style={styles.cardFooterText}>Check Attendance</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    signOut(FIREBASE_AUTH);
                    navigation.navigate("LandingPage");
                  }}
                >
                  <View style={styles.cardFooterRight}>
                    <Text style={styles.cardFooterText}>Logout</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            {/* <Text>Name :{username}</Text>
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
          </Button> */}
          </>
        )}
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
  card: {
    width: 380,
    height: 500,
    borderRadius: 10,
    marginVertical: 12,
    marginHorizontal: 16,
    backgroundColor: "white",
  },
  cardElevated: {
    elevation: 4,
    shadowOffset: {
      height: 4,
      width: 4,
    },
    shadowOpacity: 0.4,
  },
  headerContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    textAlign: "center",
    padding: 10,
    fontSize: 22,
    fontWeight: "bold",
    color: "black",
  },
  cardImage: {
    height: 300,
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 4,
  },
  cardBodyContainer: {
    alignItems: "center",
    padding: 4,
  },
  cardBodyText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  cardFooterContainer: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  cardFooterLeft: {
    backgroundColor: "#8ecae6",
    borderRadius: 12,
    margin: 10,
  },
  cardFooterRight: {
    backgroundColor: "#8ecae6",
    borderRadius: 12,
    margin: 10,
  },
  cardFooterText: {
    color: "black",
    fontWeight: "bold",
    padding: 12,
    fontSize: 20,
  },
});

export default StudentProfile;

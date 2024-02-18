import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { FIREBASE_AUTH } from "../../FirebaseConfig";
import { Button } from "react-native-paper";
import { signOut } from "firebase/auth";

import { NavigationProp } from "@react-navigation/native";
interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const List = ({ navigation }: RouterProps) => {
  const [username, setUsername] = useState("");

  useEffect(() => {
    // Fetch current user's display name
    const currentUser = FIREBASE_AUTH.currentUser;
    if (currentUser) {
      setUsername(currentUser.displayName || "");
    }
  }, []);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Welcome, {username}</Text>
      <Button onPress={() => navigation.navigate("details")}>
        Open Details
      </Button>
      <Button
        onPress={() => {
          signOut(FIREBASE_AUTH);
          navigation.navigate("LandingPage");
        }}
      >
        Logout
      </Button>
    </View>
  );
};

export default List;

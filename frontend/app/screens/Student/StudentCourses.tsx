import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../../FirebaseConfig";
import { ActivityIndicator, Button, FAB } from "react-native-paper";
import { doc, getDoc } from "firebase/firestore";

import { NavigationProp } from "@react-navigation/native";
import Navbar from "../Navbar";
interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const StudentCourses = ({ navigation }: RouterProps) => {
  const [courses, setCourses] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const renderCourseItem = ({ item }: { item: string }) => (
    <View style={styles.courseItemContainer}>
      <Text>{item}</Text>
    </View>
  );

  return (
    <ImageBackground
      source={require("../assets/background.jpg")}
      style={styles.background}
    >
      <Navbar navigation={navigation} onlyBackAction={true} />
      <View style={styles.container}>
        <View style={styles.addButtonContainer}>
          <Text style={styles.addCourseText}>Add Course</Text>
          <FAB
            icon="plus"
            style={styles.fab}
            color="white"
            onPress={() => navigation.navigate("EnrollCourse")}
          />
        </View>
        {loading ? <ActivityIndicator size="large" color="black" /> : <></>}
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
  addButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
    marginTop: 10,
  },
  addCourseText: {
    marginRight: 10,
    fontSize: 16,
  },
  fab: {
    backgroundColor: "black",
  },
  flatListContent: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  courseItemContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "lightgrey",
    margin: 5,
    padding: 10,
    height: 100,
  },
});

export default StudentCourses;

import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../../FirebaseConfig";
import { ActivityIndicator, Button, FAB } from "react-native-paper";
import { doc, getDoc } from "firebase/firestore";

import { NavigationProp } from "@react-navigation/native";
interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const StudentCourses = ({ navigation }: RouterProps) => {
  const [courses, setCourses] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchStudentDetails = async () => {
    setLoading(true);
    try {
      const currentUser = FIREBASE_AUTH.currentUser;
      if (currentUser) {
        const docRef = doc(FIRESTORE_DB, "Student", currentUser.email || "");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const studentData = docSnap.data();
          if (studentData && Array.isArray(studentData.courses)) {
            setCourses(studentData.courses);
          }
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

  const renderCourseItem = ({ item }: { item: string }) => (
    <View style={styles.courseItemContainer}>
      <Text>{item}</Text>
    </View>
  );

  const keyExtractor = (item: string, index: number) => `${item}_${index}`;

  return (
    <View style={styles.container}>
      <View style={styles.addButtonContainer}>
        <Text style={styles.addCourseText}>Add Course</Text>
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => navigation.navigate("EnrollCourse")}
          color="white"
        />
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="black" />
      ) : (
        <FlatList
          data={[...courses]}
          renderItem={renderCourseItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.flatListContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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

import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  RefreshControl,
  ScrollView,
  ImageBackground,
} from "react-native";
import { FAB, Button } from "react-native-paper";
import { NavigationProp } from "@react-navigation/native";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../../FirebaseConfig";
import Navbar from "../Navbar";

interface Course {
  courseName: string;
  instructor: string;
}

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const TeacherCourses = ({ navigation }: RouterProps) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const currentUser = FIREBASE_AUTH.currentUser;
      if (currentUser) {
        const querySnapshot = await getDocs(
          collection(FIRESTORE_DB, "Courses")
        );
        const courseData: Course[] = [];
        querySnapshot.forEach((doc) => {
          const { courseName, instructor } = doc.data();
          courseData.push({ courseName, instructor });
        });
        console.log(courseData);
        setCourses(courseData);
      }
    } catch (error: any) {
      console.log("Error fetching courses:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const renderCourseItem = ({ item }: { item: Course }) => (
    <View style={styles.courseItemContainer}>
      <Text>{item.courseName}</Text>
      <Text>Instructor: {item.instructor}</Text>
    </View>
  );
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <ImageBackground
      source={require("../assets/background.jpg")}
      style={styles.background}
    >
      <Navbar navigation={navigation} onlyBackAction={true} />
      <View style={styles.container}>
        <>
          <Button
            mode="contained"
            buttonColor="#4B61CD"
            style={styles.button}
            onPress={() => {
              navigation.navigate("CreateCourse");
            }}
          >
            Add Courses
          </Button>

          <FlatList
            data={courses}
            renderItem={renderCourseItem}
            keyExtractor={(item, index) => `${item.courseName}_${index}`}
            contentContainerStyle={styles.flatListContent}
            refreshControl={
              <RefreshControl refreshing={loading} onRefresh={fetchCourses} />
            }
          />
        </>
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
  flatListContent: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  courseItemContainer: {
    backgroundColor: "white",
    marginVertical: 5,
    padding: 10,
  },
  fab: {
    backgroundColor: "#67C3ED",
    // position: "absolute",
    right: 10,
    bottom: 10,
  },
  button: {
    borderRadius: 10,
    margin: 10,
  },
});

export default TeacherCourses;

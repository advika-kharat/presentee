import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  RefreshControl,
  ScrollView,
  Button,
  ImageBackground,
} from "react-native";
import { FAB } from "react-native-paper";
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
          if (instructor === currentUser.displayName) {
            courseData.push({ courseName, instructor });
          }
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

      <View style={{ width: "50%", position: "absolute", right: 10, top: 10 }}>
        <Button
          title="Take Attendance"
          color={"#3C6696"}
          onPress={() =>
            navigation.navigate("Attendance", {
              courseName: item.courseName,
              instructor: item.instructor,
            })
          }
        />
      </View>
    </View>
  );
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const handlePress = () => {
    navigation.navigate("CreateCourse"); // Navigate to the "CreateCourse" screen
  };

  return (
    <ImageBackground
      source={require("../assets/background.jpg")}
      style={styles.background}
    >
      <Navbar navigation={navigation} onlyBackAction={true} />
      <View style={styles.container}>
        <>
          <FAB
            icon="plus"
            style={styles.fab}
            color="white"
            rippleColor={"#3C6696"}
            onPress={() => {
              navigation.navigate("CreateCourse");
            }}
          />

          {/* <Button
            title="addcourse"
            color={"#577FD4"}
            onPress={() => {
              navigation.navigate("CreateCourse");
            }}
          /> */}

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
    zIndex: 100,
    backgroundColor: "#3C6696",
    position: "absolute",
    bottom: 10,
    right: 10,
  },
  button: {
    borderRadius: 10,
    margin: 10,
  },
});

export default TeacherCourses;

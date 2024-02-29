import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  FlatList,
  ScrollView,
} from "react-native";
import Navbar from "../Navbar";
import { NavigationProp } from "@react-navigation/native";
import { getDocs, collection, addDoc } from "firebase/firestore";
import { FIRESTORE_DB } from "../../../FirebaseConfig";
import { ActivityIndicator, Button, DataTable } from "react-native-paper";
import EnrolledStudents from "../../components/EnrolledStudents";
import AttendanceHistory from "../../components/AttendanceHistory";
import { useWindowDimensions } from "react-native";
import { TabView, TabBar, SceneMap } from "react-native-tab-view";
import Searchbar from "../../components/Seachbar";
import StudentAttendance from "../../components/StudentAttendance";

const FirstRoute = ({
  courseName,
  instructor,
  navigation,
}: {
  courseName: string;
  instructor: string;
  navigation: any;
}) => (
  <View style={{ flex: 1, backgroundColor: "white" }}>
    <Button
      buttonColor="#0870BF"
      style={{
        borderRadius: 5,
        width: "90%",
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: 20,
      }}
      labelStyle={{
        fontSize: 20,
        color: "white",
        fontWeight: "500",
      }}
      onPress={() =>
        navigation.navigate("DatesAttendance", {
          courseName: courseName,
          instructor: instructor,
        })
      }
    >
      Take Attendance Now
    </Button>

    <Text
      style={{
        margin: 20,
        marginBottom: 10,
        fontSize: 20,
        textAlign: "center",
        fontWeight: "500",
      }}
    >
      Attendance Records
    </Text>

    <AttendanceHistory courseName={courseName} navigation={navigation} />
  </View>
);

const SecondRoute = ({
  loading,
  students,
  fetchStudentsEnrolled,
  courseName,
}: {
  loading: boolean;
  students: any[];
  fetchStudentsEnrolled: () => void;
  courseName: any;
}) => {
  // useEffect(() => {
  //   fetchStudentsEnrolled();
  // }, [fetchStudentsEnrolled]); // Fetch students when the tab is focused

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <Text style={{ margin: 20, fontSize: 20, fontWeight: "500" }}>
        Students Enrolled in this course
      </Text>

      {loading ? (
        <ActivityIndicator />
      ) : (
        <ScrollView>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Student Name</DataTable.Title>
              <DataTable.Title>UID</DataTable.Title>
              <DataTable.Title>Attendance</DataTable.Title>
            </DataTable.Header>

            {students.map((student, index) => (
              // <EnrolledStudents
              //   key={index}
              //   studentName={student.name}
              //   studentEmail={student.email}
              //   studentUid={student.uid}
              //   courseName={courseName}
              // />

              <DataTable.Row key={index}>
                <DataTable.Cell>{student.name}</DataTable.Cell>
                <DataTable.Cell>{student.uid}</DataTable.Cell>
                <DataTable.Cell>
                  {" "}
                  <StudentAttendance
                    studentEmail={student.email}
                    studentName={student.name}
                    studentUid={student.uid}
                    courseName={courseName}
                  />
                </DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>
        </ScrollView>
      )}
    </View>
  );
};

const renderScene = ({
  courseName,
  instructor,
  navigation, // Add the navigation prop here
  loading,
  students,
  fetchStudentsEnrolled,
}: {
  courseName: string;
  instructor: string;
  navigation: NavigationProp<any, any>; // Add the navigation prop type here
  loading: boolean;
  students: any[];
  fetchStudentsEnrolled: () => void;
}) =>
  SceneMap({
    first: () => (
      <FirstRoute
        courseName={courseName}
        instructor={instructor}
        navigation={navigation}
      />
    ), // Pass navigation to FirstRoute
    second: () => (
      <SecondRoute
        loading={loading}
        students={students}
        fetchStudentsEnrolled={fetchStudentsEnrolled}
        courseName={courseName}
      />
    ),
  });

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

interface StudentInfo {
  name: string;
  email: string;
  uid: string;
}

const Attendance = ({ route, navigation }: { route: any; navigation: any }) => {
  const { courseName, instructor } = route.params;

  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<StudentInfo[]>([]);

  const fetchStudentsEnrolled = async () => {
    setLoading(true);
    try {
      // Fetch the course document from Firestore
      const courseRef = collection(FIRESTORE_DB, "Courses");
      const querySnapshot = await getDocs(courseRef);

      // Extract the "students" array from the course document
      const enrolledStudents = querySnapshot.docs
        .filter((doc) => doc.data().courseName === courseName)
        .map((doc) => doc.data().students)
        .flat();

      const studentInfo: StudentInfo[] = enrolledStudents.map((student) => ({
        name: student.studentName,
        email: student.studentEmail,
        uid: student.studentUid,
      }));

      // Update the state with the list of student names
      setStudents(studentInfo);
      console.log(enrolledStudents);
    } catch (error: any) {
      console.log("Error fetching students:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentsEnrolled();
  }, []);

  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first", title: "History" },
    { key: "second", title: "Students" },
  ]);

  return (
    <ImageBackground
      source={require("../assets/background.jpg")}
      style={styles.background}
    >
      <Navbar navigation={navigation} onlyBackAction={true} />
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 20,
            margin: 20,
            fontWeight: "500",
          }}
        >
          Course Name: {courseName}
        </Text>

        {/* <Button
          buttonColor="#0870BF"
          style={{
            borderRadius: 5,
            width: "90%",
            marginLeft: "auto",
            marginRight: "auto",
          }}
          labelStyle={{
            fontSize: 20,
            color: "white",
            fontWeight: "500",
          }}
          onPress={() =>
            navigation.navigate("DatesAttendance", {
              courseName: courseName,
              instructor: instructor,
            })
          }
        >
          Take Attendance Now
        </Button> */}

        {/* <Text
          style={{
            margin: 20,
            fontSize: 20,
            fontWeight: "400",
          }}
        >
          Attendance History
        </Text> */}

        <TabView
          style={{
            marginTop: 0,
          }}
          navigationState={{ index, routes }}
          renderScene={renderScene({
            courseName,
            instructor,
            navigation,
            loading,
            students,
            fetchStudentsEnrolled,
          })}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          renderTabBar={(props) => (
            <TabBar
              {...props}
              indicatorStyle={{ backgroundColor: "#007CDA" }}
              style={{ backgroundColor: "#F8F8F8" }}
              activeColor="#007CDA"
              inactiveColor="#000000"
            />
          )}
        />

        {/* <AttendanceHistory courseName={courseName} navigation={navigation} />

        <Text
          style={{
            fontSize: 18,
            margin: 20,
            fontWeight: "500",
          }}
        >
          Students Enrolled in this course
        </Text>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <ScrollView>
            <EnrolledStudents studentName={"Student Name"} studentUid={"UID"} />
            {students.map((student, index) => (
              <EnrolledStudents
                key={index}
                studentName={student.name}
                studentEmail={student.email}
                studentUid={student.uid}
              />
            ))}
          </ScrollView>
        )} */}
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
  studentItem: {
    backgroundColor: "white",
    padding: 10,
    marginBottom: 5,
    borderRadius: 5,
  },
});

export default Attendance;

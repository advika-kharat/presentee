import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Modal,
  FlatList,
  ScrollView,
  RefreshControl,
} from "react-native";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Button } from "react-native-paper";

import { NavigationProp } from "@react-navigation/native";
interface RouterProps {
  navigate: any;
  navigation: NavigationProp<any, any>;
}

import { FIRESTORE_DB } from "../../FirebaseConfig";

const AttendanceHistory = ({
  courseName,
  navigation,
}: {
  courseName: any;
  navigation: RouterProps;
}) => {
  const [timestamps, setTimestamps] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [presentStudents, setPresentStudents] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [attendanceData, setAttendanceData] = useState<any[]>([]);

  const fetchTimestamps = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(
        query(
          collection(FIRESTORE_DB, "Date"),
          where("courseName", "==", courseName)
        )
      );
      const timestamps = querySnapshot.docs.map((doc) => doc.id);
      const reversedTimestamps = timestamps.reverse();

      setTimestamps(timestamps);
      console.log(timestamps);
    } catch (e: any) {
      console.log(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimestamps();
  }, []);

  const fetchPresentStudents = async (timestamp: any) => {
    try {
      if (!courseName) {
        console.error("Course name is undefined");
        return;
      }

      const presentStudentsSnapshot = await getDocs(
        query(
          collection(FIRESTORE_DB, "Date"),
          where("date", "==", timestamp),
          where("courseName", "==", courseName)
        )
      );

      const presentStudentsData = presentStudentsSnapshot.docs
        .flatMap((doc) => doc.data().students)
        .filter((student) => student.present)
        .map((student) => student.studentName);

      setPresentStudents(presentStudentsData);
      console.log(presentStudentsData);
      navigation.navigate("PresentStudentsList", {
        presentStudentsData,
        timestamp,
      });
    } catch (error) {
      console.error("Error fetching present students:", error);
    }
  };

  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchTimestamps} />
        }
      >
        {timestamps.map((timestamp, index) => (
          <Button
            key={index}
            onPress={() => fetchPresentStudents(timestamp)}
            buttonColor="#F0F0F0"
            style={{
              borderRadius: 5,
              padding: 6,
              borderWidth: 1,
              borderColor: "#90B3CED1",
              width: "90%",
              marginLeft: "auto",
              marginRight: "auto",
              marginTop: 5,
            }}
            labelStyle={{
              color: "#3C6696",
              fontSize: 18,
            }}
          >
            {new Date(timestamp).toLocaleString()}
          </Button>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default AttendanceHistory;

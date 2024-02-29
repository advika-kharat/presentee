import { View, Text, StyleSheet } from "react-native";
import React, { useState } from "react";
import { Checkbox, DataTable } from "react-native-paper";
import StudentAttendance from "./StudentAttendance";
import { DarkTheme } from "@react-navigation/native";

const EnrolledStudents = ({
  studentName,
  studentEmail,
  studentUid,
  courseName,
}: any) => {
  return (
    <View style={styles.container}>
      <DataTable>
        <DataTable.Row>
          <DataTable.Cell>{studentName}</DataTable.Cell>

          <DataTable.Cell>{studentUid}</DataTable.Cell>
          <DataTable.Cell>
            {" "}
            <StudentAttendance
              studentEmail={studentEmail}
              studentName={studentName}
              studentUid={studentUid}
              courseName={courseName}
            />
          </DataTable.Cell>
        </DataTable.Row>
      </DataTable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",

    padding: 10,
    // width: "90%",
    // marginLeft: "auto",
    // marginRight: "auto",
  },
});

export default EnrolledStudents;

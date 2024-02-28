import { View, Text, StyleSheet } from "react-native";
import React, { useState } from "react";
import { Checkbox } from "react-native-paper";

const EnrolledStudents = ({ studentName, studentEmail, studentUid }: any) => {
  return (
    <View style={styles.container}>
      <Text
        style={{
          fontSize: 16,
        }}
      >
        {studentName}
      </Text>
      <Text
        style={{
          position: "absolute",
          right: 10,
          top: 10,
          fontSize: 16,
        }}
      >
        {studentUid}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "white",
    borderBottomWidth: 4,
    borderBottomColor: "#C4E0FF",
    padding: 10,
    width: "90%",
    marginLeft: "auto",
    marginRight: "auto",
  },
});

export default EnrolledStudents;

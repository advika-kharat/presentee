import { View, Text, StyleSheet } from "react-native";
import React, { useState } from "react";
import { Button } from "react-native-paper";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer, NavigationProp } from "@react-navigation/native";
import Details from "./Details";
import List from "./List";
import StudentLogin from "./Student/StudentLogin";
import StudentRegister from "./Student/StudentRegister";
import TeacherLogin from "./Teacher/TeacherLogin";
import TeacherRegister from "./Teacher/TeacherRegister";
interface RouterProps {
  navigation: NavigationProp<any, any>;
}
const LandingPage = ({ navigation }: RouterProps) => {
  return (
    <View>
      <Button
        onPress={() => {
          navigation.navigate("Student");
        }}
      >
        Student
      </Button>
      <Button
        onPress={() => {
          navigation.navigate("Teacher");
        }}
      >
        Teacher
      </Button>
    </View>
  );
};

export default LandingPage;

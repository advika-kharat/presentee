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
import LandingPage from "./LandingPage";
import TeacherProfile from "./Teacher/TeacherProfile";
import StudentProfile from "./Student/StudentProfile";
interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const MainStack = createNativeStackNavigator();

const StudentStack = createNativeStackNavigator();

const StudentLayout = () => {
  return (
    <StudentStack.Navigator>
      <StudentStack.Screen
        name="StudentLogin"
        component={StudentLogin}
        options={{ headerShown: false }}
      />
      <StudentStack.Screen
        name="StudentRegister"
        component={StudentRegister}
        options={{ headerShown: false }}
      />
      <StudentStack.Screen
        name="StudentProfile"
        component={StudentProfile}
        options={{ headerShown: false }}
      />
    </StudentStack.Navigator>
  );
};

const TeacherStack = createNativeStackNavigator();

const TeacherLayout = () => {
  return (
    <TeacherStack.Navigator>
      <TeacherStack.Screen
        name="TeacherLogin"
        component={TeacherLogin}
        options={{ headerShown: false }}
      />
      <TeacherStack.Screen
        name="TeacherRegister"
        component={TeacherRegister}
        options={{ headerShown: false }}
      />
      <TeacherStack.Screen
        name="TeacherProfile"
        component={TeacherProfile}
        options={{ headerShown: false }}
      />
    </TeacherStack.Navigator>
  );
};

const Home = ({ navigation }: RouterProps) => {
  return (
    <View style={styles.container}>
      <MainStack.Navigator>
        <MainStack.Screen
          name="LandingPage"
          component={LandingPage}
          options={{ headerShown: false }}
        />

        <MainStack.Screen
          name="Student"
          component={StudentLayout}
          options={{ headerShown: false }}
        />

        <MainStack.Screen
          name="Teacher"
          component={TeacherLayout}
          options={{ headerShown: false }}
        />
      </MainStack.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default Home;

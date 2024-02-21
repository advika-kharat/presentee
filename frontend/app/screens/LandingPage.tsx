import { View, Text, StyleSheet, ImageBackground } from "react-native";
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
import LandingNavbar from "./LandingNavbar";

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const LandingPage = ({ navigation }: RouterProps) => {
  return (
    <View style={styles.container}>
      <LandingNavbar/>
      <View style={styles.buttonsContainer}>
        <Button
          onPress={() => {
            navigation.navigate("StudentLogin");
          }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Student</Text>
        </Button>
        <Button
          onPress={() => {
            navigation.navigate("TeacherLogin");
          }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Teacher</Text>
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    height: 100,
    width: 200,
    borderRadius: 30,
    backgroundColor: '#4fade3',
    margin: 20,
    padding: 30,
    elevation: 10,
    shadowOffset: {
      height: 10,
      width: 10,
    },
    shadowOpacity: 1,
  },
  buttonText: {
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    lineHeight: 28,
  }
})

export default LandingPage;

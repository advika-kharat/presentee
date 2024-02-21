import React from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";
import { Button } from "react-native-paper";
import { NavigationProp } from "@react-navigation/native";
import LandingNavbar from "./LandingNavbar";

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const LandingPage = ({ navigation }: RouterProps) => {
  return (
    <ImageBackground
      source={require('./assets/background.jpg')}
      style={styles.background}
    >
      <LandingNavbar/>
      <View style={styles.container}>
        <View style={styles.buttonsContainer}>
          <Button
            mode="contained"
            onPress={() => {
              navigation.navigate("StudentLogin");
            }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Student</Text>
          </Button>
          <Button
            mode="contained"
            onPress={() => {
              navigation.navigate("TeacherLogin");
            }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Teacher</Text>
          </Button>
        </View>
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
    padding: 20,
  },
  buttonsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    borderRadius: 30,
    backgroundColor: '#4fade3',
    margin: 10,
    paddingVertical: 12,
    paddingHorizontal: 24,
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  }
})

export default LandingPage;

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

import { NavigationProp } from "@react-navigation/native";
import Navbar from "../Navbar";

const PresentStudentsList = ({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) => {
  const { presentStudentsData, timestamp } = route.params;
  console.log(presentStudentsData);
  return (
    <ImageBackground
      source={require("../assets/background.jpg")}
      style={styles.background}
    >
      <Navbar navigation={navigation} onlyBackAction={true} />

      <View style={styles.container}>
        <View
          style={{
            margin: 20,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "500",
            }}
          >
            Students Present on {new Date(timestamp).toLocaleString()}
          </Text>
        </View>
        {presentStudentsData.map((student: any, index: any) => (
          <View
            key={index}
            style={{
              backgroundColor: "white",
              padding: 10,
              width: "90%",
              marginLeft: "auto",
              marginRight: "auto",
              borderBottomWidth: 1,
              borderBottomColor: "lightgrey",
              borderRadius: 1,
            }}
          >
            <Text
              key={index}
              style={{
                fontSize: 15,
              }}
            >
              {student}
            </Text>
          </View>
        ))}
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
});

export default PresentStudentsList;

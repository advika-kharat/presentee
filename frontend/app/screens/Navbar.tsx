import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Appbar } from "react-native-paper";
import { NavigationProp, useNavigation } from "@react-navigation/native";

interface RouterProps {
  navigation: NavigationProp<any, any>;
  onlyBackAction: Boolean;
}

const Navbar = ({ navigation, onlyBackAction = false }: RouterProps) => {
  return (
    <View>
      <Appbar.Header>
        <Appbar.BackAction
          onPress={() => {
            navigation.goBack();
          }}
        />
        {!onlyBackAction ? (
          <>
            <Appbar.Content title="Title" />
            <Appbar.Action icon="calendar" onPress={() => {}} />
            <Appbar.Action icon="magnify" onPress={() => {}} />
          </>
        ) : null}
      </Appbar.Header>
    </View>
  );
};

export default Navbar;

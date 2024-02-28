import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Button } from "react-native";
import * as Location from "expo-location";

const LocationComponent = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );

  const getLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.warn("Location permission denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    } catch (error) {
      console.error("Error getting location:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Welcome!</Text>
      <View style={styles.buttonContainer}>
        <Button title="Get Location" onPress={getLocation} />
      </View>
      {location && location.coords && (
        <View>
          <Text>Latitude: {location.coords.latitude}</Text>
          <Text>Longitude: {location.coords.longitude}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    width: "40%",
  },
});

export default LocationComponent;

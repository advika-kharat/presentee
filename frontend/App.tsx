import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Login from "./app/screens/Login";
import Details from "./app/screens/Details";
import List from "./app/screens/List";
import { useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH } from "./FirebaseConfig";
import Home from "./app/screens/Home";
import { Appbar } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Register from "./app/screens/Register";

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log("user", user);
      setUser(user);
    });
  }, []);

  return (
    <SafeAreaProvider>
      <View>
        <Appbar.Header>
          <Appbar.Content
            title="presentee"
            titleStyle={styles.appbarTitle}
          ></Appbar.Content>
        </Appbar.Header>
      </View>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          {!user ? (
            <>
              {/* <Stack.Screen
                name="Register"
                component={Register}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Login"
                component={Login}
                options={{ headerShown: false }}
              /> */}
              <Stack.Screen
                name="Home"
                component={Home}
                options={{ headerShown: false }}
              />
            </>
          ) : (
            <Stack.Screen
              name="Home"
              component={Home}
              options={{ headerShown: false }}
            />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  appbarTitle: {
    // Add your styles here
    fontSize: 30,
    textAlign: "center",
    fontWeight: "bold",
  },
});

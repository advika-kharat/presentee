import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet, Text, View, Image } from "react-native";
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
      <View style={styles.navbar}>
        <Image
          source={require('./assets/logo2.png')}
          style={styles.navbarLogo}
        />
        <Text style={styles.navbarText}>presentee
        </Text>
      </View>

{/* <Appbar.Header>
        {Stack.Screen.length > 1 ? (<Appbar.BackAction onPress={() => {}} />) : (null)}
        <Appbar.Content title="Title" />
        <Appbar.Action icon="calendar" onPress={() => {}} />
        <Appbar.Action icon="magnify" onPress={() => {}} />
      </Appbar.Header> */}
      
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={Home}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
const styles = StyleSheet.create({
  navbar: {
    height: '40%',
    padding: 8,
    paddingTop: 20,
    backgroundColor: 'white',
    // flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
  },
  navbarLogo: {
    height: 200,
    width: 200,
  },
  navbarText: {
    fontSize: 40,
    fontWeight: 'bold',
  }
});

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
import { Appbar } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Register from "./app/screens/Register";
import LandingPage from "./app/screens/LandingPage";
import StudentLogin from "./app/screens/Student/StudentLogin";
import StudentProfile from "./app/screens/Student/StudentProfile";
import StudentRegister from "./app/screens/Student/StudentRegister";
import TeacherLogin from "./app/screens/Teacher/TeacherLogin";
import TeacherProfile from "./app/screens/Teacher/TeacherProfile";
import TeacherRegister from "./app/screens/Teacher/TeacherRegister";
import Navbar from "./app/screens/Navbar";

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
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LandingPage">
        <Stack.Screen name="LandingPage" component={LandingPage} options={{headerShown: false}} />
        <Stack.Screen name="StudentLogin" component={StudentLogin} options={{headerShown: false}} />
        <Stack.Screen name="StudentRegister" component={StudentRegister} options={{headerShown: false}} />
        <Stack.Screen name="StudentProfile" component={StudentProfile} options={{headerShown: false}} />
        <Stack.Screen name="TeacherLogin" component={TeacherLogin} options={{headerShown: false}} />
        <Stack.Screen name="TeacherRegister" component={TeacherRegister} options={{headerShown: false}} />
        <Stack.Screen name="TeacherProfile" component={TeacherProfile} options={{headerShown: false}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
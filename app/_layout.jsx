import Recorder from "../components/Recorder";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { Drawer } from "expo-router/drawer";
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          drawerStyle: {
            backgroundColor: "#010709",
          },
          drawerActiveBackgroundColor: "#306A68",
          drawerInactiveBackgroundColor: "#010709",
          drawerActiveTintColor: "white",
          drawerInactiveTintColor: "grey",
        }}
      >
        <Drawer.Screen
          name="login"
          options={{
            drawerLabel: "Login",
          }}
        />
        <Drawer.Screen
          name="register"
          options={{
            drawerLabel: "Register",
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}

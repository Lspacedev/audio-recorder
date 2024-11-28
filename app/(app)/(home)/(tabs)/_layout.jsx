import { Tabs } from "expo-router";
import { Text } from "react-native";
import { useState, useEffect } from "react";
import { useSession } from "@/ctx";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function TabLayout() {
  const { signOut } = useSession();
  const [theme, setTheme] = useState("Dark");
  useEffect(() => {
    (async () => {
      setTheme(JSON.parse(await AsyncStorage.getItem("theme")));
    })();
  }, []);
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          borderTopWidth: 0,
          borderBottomWidth: 0,
        },
        tabBarLabelStyle: {
          color: "#BDBDBD",
        },
        tabBarActiveBackgroundColor: "black",
        tabBarInactiveBackgroundColor: "#0C0910",
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
          tabBarIcon: () => {
            return <AntDesign name="home" size={24} color="#C7D6D5" />;
          },
        }}
      />
      {/* <Tabs.Screen name="recordings" options={{ headerShown: false }} /> */}

      <Tabs.Screen
        name="profile"
        options={{
          headerTitle: "Profile",
          headerTintColor: "#F7F0F0",
          headerStyle: {
            backgroundColor: "#0C0910",
          },
          tabBarIcon: () => {
            return (
              <Ionicons name="person-circle-sharp" size={24} color="#C7D6D5" />
            );
          },

          headerRight: () => (
            <Text
              style={{ color: "#F7F0F0", paddingHorizontal: 15 }}
              onPress={() => {
                signOut();
              }}
            >
              Sign Out
            </Text>
          ),
        }}
      />
    </Tabs>
  );
}

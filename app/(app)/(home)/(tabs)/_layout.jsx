import { Tabs } from "expo-router";
import { Text } from "react-native";
import { useSession } from "@/ctx";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
export default function TabLayout() {
  const { signOut } = useSession();

  return (
    <Tabs
      screenOptions={{
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
            return <AntDesign name="home" size={24} color="#F7F0F0" />;
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
              <Ionicons name="person-circle-sharp" size={24} color="#F7F0F0" />
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

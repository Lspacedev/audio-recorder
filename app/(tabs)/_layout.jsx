import { Tabs } from "expo-router";
import { Image } from "react-native";
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarLabelStyle: {
          color: "#BDBDBD",
        },
        tabBarActiveBackgroundColor: "#306868",
        tabBarInactiveBackgroundColor: "#010709",
      }}
    >
      <Tabs.Screen
        name="login"
        options={{
          headerShown: false,
          // tabBarIcon: () => <Image source={require("")} />,
        }}
      />
      <Tabs.Screen name="register" options={{ headerShown: false }} />
    </Tabs>
  );
}

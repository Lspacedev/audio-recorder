import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="recordings" options={{ headerShown: false }} />
      <Stack.Screen
        name="settings"
        options={{
          headerShown: true,
          headerTitle: "Settings",
          headerTintColor: "whitesmoke",
          headerStyle: {
            backgroundColor: "#0C0910",
          },
        }}
      />
    </Stack>
  );
}

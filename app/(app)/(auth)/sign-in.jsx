import { router } from "expo-router";
import { Text, View, ScrollView, Pressable, StyleSheet } from "react-native";
import CustomInput from "@/components/CustomInput";
import { validateInput } from "@/utils/input-validation";
import { StatusBar } from "expo-status-bar";

import { useSession } from "../../../ctx";
import { useState } from "react";

export default function SignIn() {
  const { signIn } = useSession();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const handleInput = (type, stateName, value) => {
    setErrors((errors) => ({
      ...errors,
      [stateName]: validateInput(type, value),
    }));
  };
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.formTitle}>Login</Text>
        <CustomInput
          name={"Username"}
          onChange={(text) => {
            setUsername(text);
          }}
          onBlur={() => handleInput("string", "username", username)}
          error={errors?.username?.error}
        />
        <CustomInput
          name={"Password"}
          onChange={(text) => {
            setPassword(text);
          }}
          onBlur={() => handleInput("password", "password", password)}
          error={errors?.password?.error}
        />

        <Pressable style={styles.button}>
          <Text
            style={styles.buttonText}
            onPress={() => {
              signIn(username, password);
              // Navigate after signing in. You may want to tweak this to ensure sign-in is
              // successful before navigating.
              router.replace("/home");
            }}
          >
            Sign In
          </Text>
        </Pressable>
        <View style={styles.signInSection}>
          <Text style={{ color: "#BDBDBD" }}>Don't have an account?</Text>
          <Pressable>
            <Text
              style={{ color: "#F7F0F0", padding: 5 }}
              onPress={() => {
                router.replace("/register");
              }}
            >
              Sign up
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      <StatusBar backgroundColor="#010709" />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0C0910",
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollView: {
    gap: 15,
    paddingVertical: 20,
  },
  formTitle: {
    fontSize: 36,
    marginVertical: 10,
    color: "#F7F0F0",
  },
  inputContainer: {
    gap: 5,
  },
  label: {
    color: "#F7F0F0",
  },
  input: {
    borderRadius: 5,
    borderColor: "#BDBDBD",
    padding: 5,
    paddingHorizontal: 10,
    color: "#BDBDBD",
    borderWidth: 0.8,
  },
  button: {
    backgroundColor: "#F7F0F0",
    padding: 15,
    marginTop: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "#0C0910",
    textAlign: "center",
    textTransform: "uppercase",
  },
});

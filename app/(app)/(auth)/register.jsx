import { Stack } from "expo-router";
import {
  ScrollView,
  FlatList,
  View,
  Text,
  TextInput,
  Image,
  ActivityIndicator,
  Pressable,
  Alert,
  ToastAndroid,
  KeyboardAvoidingView,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as NavigationBar from "expo-navigation-bar";
import { useState, useEffect } from "react";
import CustomInput from "@/components/CustomInput";
import { validateInput } from "../../../utils/input-validation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useLocalSearchParams } from "expo-router";

export default function Registration() {
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState([]);
  const params = useLocalSearchParams();

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync("#020709");
    NavigationBar.setBorderColorAsync("#717171");
  }, []);

  const handleInput = (type, stateName, value) => {
    setErrors((errors) => ({
      ...errors,
      [stateName]: validateInput(type, value),
    }));
  };
  const handleOnSubmit = async () => {
    let data = JSON.parse(await AsyncStorage.getItem("reg"));
    if (data === null) {
      let arr = [];
      arr.push({ userName, password });
      await AsyncStorage.setItem("reg", JSON.stringify(arr));
    } else {
      const user = data.filter((account) => account.userName === data.userName);

      if (user.length > 0) {
        return "Account exists";
      } else {
        data.push({ userName, password });
        await AsyncStorage.setItem("reg", JSON.stringify(data));
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.formTitle}>Register</Text>
        <CustomInput
          name={"Username"}
          onChange={setUsername}
          onBlur={() => handleInput("string", "userName", userName)}
          error={errors?.userName?.error}
        />

        <CustomInput
          name={"Password"}
          onChange={setPassword}
          onBlur={() => handleInput("password", "password", password)}
          error={errors?.password?.error || errors?.password?.errors}
        />
        <CustomInput
          name={"Confirm Password"}
          onChange={setConfirmPassword}
          onBlur={() =>
            handleInput("password", "confirmPassword", confirmPassword)
          }
          error={errors?.confirmPassword?.error}
        />

        <View style={styles.signInSection}>
          <Text style={{ color: "#F7F0F0" }}>Already have an account?</Text>
          <Pressable>
            <Link href="/sign-in" style={{ color: "#F7F0F0", padding: 5 }}>
              Sign In
            </Link>
          </Pressable>
        </View>

        <Pressable
          style={styles.button}
          onPress={() => {
            handleOnSubmit();
          }}
        >
          <Text style={styles.buttonText}>Submit</Text>
        </Pressable>
      </ScrollView>
      {/* </KeyboardAvoidingView> */}

      <StatusBar backgroundColor="#0C0910" />
    </SafeAreaView>
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
    borderColor: "#F7F0F0",
    padding: 5,
    paddingHorizontal: 10,
    color: "#F7F0F0",
    borderWidth: 0.8,
  },
  button: {
    backgroundColor: "#F7F0F0",
    padding: 15,
    marginTop: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "#010709",
    textAlign: "center",
    textTransform: "uppercase",
  },
  signInSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});

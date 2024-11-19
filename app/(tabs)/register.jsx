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
import { validateInput } from "../../utils/input-validation";
import { RadioButton, RadioGroup } from "@/components/RadioButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link } from "expo-router";

export default function Registration() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [streetName, setStreetName] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [errors, setErrors] = useState([]);
  const [selectedGenderValue, setSelectedGenderValue] = useState("");
  useEffect(() => {
    console.log(firstName);
  }, [firstName]);
  useEffect(() => {
    NavigationBar.setBackgroundColorAsync("#020709");
    NavigationBar.setBorderColorAsync("#717171");
  }, []);
  const handleOnPress = () => {
    Alert.alert("Alert", "Button was pressed", [
      {
        text: "Okay",
        onPress: () => console.log("Okay was pressed"),
      },
      {
        text: "Cancel",
        style: "cancel",
        onPress: () => console.log("Cancel was pressed"),
      },
      {
        text: "Delete",
        style: "destructive",

        onPress: () => console.log("Delete was pressed"),
      },
    ]);
  };
  const handleOnLongPress = () => {
    ToastAndroid.show("Button was long pressed...", 3000);
  };
  const handleInput = (type, stateName, value) => {
    setErrors((errors) => ({
      ...errors,
      [stateName]: validateInput(type, value),
    }));
  };
  const handleOnSubmit = async () => {
    await AsyncStorage.setItem(
      "reg",
      JSON.stringify({ firstName, password, phoneNumber })
    );
  };
  const handleOnGetData = async () => {
    const data = JSON.parse(await AsyncStorage.getItem("reg"));
    console.log(data);
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.formTitle}>Register</Text>
        <CustomInput
          name={"First Name"}
          onChange={setFirstName}
          onBlur={() => handleInput("string", "firstName", firstName)}
          error={errors?.firstName?.error}
        />
        <CustomInput
          name={"Last Name"}
          onChange={setLastName}
          onBlur={() => handleInput("string", "lastName", lastName)}
          error={errors?.lastName?.error}
        />
        <RadioGroup
          groupName={"Gender"}
          selectedValue={selectedGenderValue}
          setSelectedValue={setSelectedGenderValue}
        >
          <RadioButton label={"Male"} value={"Male"} />
          <RadioButton label={"Female"} value={"Female"} />
        </RadioGroup>

        <CustomInput
          name={"Phone Number"}
          onChange={setPhoneNumber}
          onBlur={() => handleInput("number", "phoneNumber", phoneNumber)}
          error={errors?.phoneNumber?.error}
        />
        <CustomInput
          name={"Email"}
          onChange={setEmail}
          onBlur={() => handleInput("email", "email", email)}
          error={errors?.email?.error}
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
        <CustomInput
          name={"House Number"}
          onChange={setHouseNumber}
          onBlur={() => handleInput("number", "houseNumber", houseNumber)}
          error={errors?.houseNumber?.error}
        />
        <CustomInput
          name={"Street Name"}
          onChange={setStreetName}
          onBlur={() => handleInput("string", "streetName", streetName)}
          error={errors?.streetName?.error}
        />
        <CustomInput
          name={"City"}
          onChange={setCity}
          onBlur={() => handleInput("string", "city", city)}
          error={errors?.city?.error}
        />

        <CustomInput
          name={"Province"}
          onChange={setProvince}
          onBlur={() => handleInput("string", "province", province)}
          error={errors?.province?.error}
        />
        <CustomInput
          name={"Postal Code"}
          onChange={setPostalCode}
          onBlur={() => handleInput("number", "postalCode", postalCode)}
          error={errors?.postalCode?.error}
        />

        <View style={styles.signInSection}>
          <Text style={{ color: "#BDBDBD" }}>Already have an account?</Text>
          <Pressable
          // onPress={() => {
          //   handleShowAlert();
          // }}
          >
            <Link href="/login" style={{ color: "#306A68", padding: 5 }}>
              Sign In
            </Link>
          </Pressable>
        </View>
        <Pressable
          onPress={() => {
            handleOnGetData();
          }}
        >
          <Text style={{ color: "#306A68", padding: 5 }}>Get data</Text>
        </Pressable>
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

      <StatusBar backgroundColor="#010709" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#010709",
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
    color: "#BDBDBD",
  },
  inputContainer: {
    gap: 5,
  },
  label: {
    color: "#BDBDBD",
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
    backgroundColor: "#306A68",
    padding: 15,
    marginTop: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "#BDBDBD",
    textAlign: "center",
    textTransform: "uppercase",
  },
  signInSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});

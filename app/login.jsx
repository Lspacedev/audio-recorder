import {
  ScrollView,
  FlatList,
  View,
  Text,
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
import { TextInput } from "react-native-web";
import * as NavigationBar from "expo-navigation-bar";
import { useState, useEffect, Component } from "react";
import CustomInput from "@/components/CustomInput";
import { validateInput } from "../utils/input-validation";
import { Link } from "expo-router";
export default class Login extends Component {
  constructor() {
    super();
    this.handleOnPress = this.handleOnPress.bind(this);
    this.handleOnLongPress = this.handleOnLongPress.bind(this);
    this.state = {
      email: "",
      password: "",
      errors: [],
    };
  }
  //   const [firstName, setFirstName] = useState("");
  //   useEffect(() => {
  //     console.log(firstName);
  //   }, [firstName]);
  //   useEffect(() => {
  //     NavigationBar.setBackgroundColorAsync("#020709");
  //     NavigationBar.setBorderColorAsync("#717171");
  //   }, []);
  componentDidUpdate() {
    console.log({ state: this.state });
  }
  componentDidMount() {
    console.log("is mounted");
  }
  componentWillUnmount() {
    console.log("will be unmounted");
  }
  handleOnPress = () => {
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
  handleOnLongPress = () => {
    ToastAndroid.show("Button was long pressed...", 3000);
  };
  handleShowAlert = (ev) => {
    ToastAndroid.show("Tried to navigate to Registration", 300);
  };
  handleInput = (type, stateName, value) => {
    this.setState((state) => ({
      ...state,
      errors: { ...state.errors, [stateName]: validateInput(type, value) },
    }));
  };
  validateInput = (type, value) => {
    if (value.trim() === "") {
      return {
        valid: false,
        error: "Input is required",
      };
    }
    if (type === "email") {
      return /\S+\@S+\.\S+/.test(value)
        ? {
            valid: true,
            error: null,
          }
        : {
            valid: false,
            error: "Please insert a valid email",
          };
    }
    if (type === "string") {
      return /([A-Za-z])+/.test(value)
        ? {
            valid: true,
            error: null,
          }
        : {
            valid: false,
            error: "Only alphabets allowed as password",
          };
    }
  };
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <Text style={styles.formTitle}>Login</Text>
          <CustomInput
            name={"Email"}
            onChangeText={(text) => {
              this.setState({ email: text });
            }}
            onBlur={() => this.handleInput("email", "email", this.state.email)}
            error={this.state.errors?.email?.error}
          />
          <CustomInput
            name={"Password"}
            onChangeText={(text) => {
              this.setState({ password: text });
            }}
            onBlur={() =>
              this.handleInput("string", "password", this.state.password)
            }
            error={this.state.errors?.password?.error}
          />

          <Pressable
            style={styles.button}
            onPress={this.handleOnPress}
            onLongPress={this.handleOnLongPress}
          >
            <Text style={styles.buttonText}>Submit</Text>
          </Pressable>
          <View style={styles.signInSection}>
            <Link
              href={{ pathname: "/register", params: { from: "login" } }}
              style={{ color: "#BDBDBD" }}
            >
              Don't have an account?
            </Link>
            <Pressable
            // onPress={this.handleShowAlert}
            >
              <Text style={{ color: "#306A68", padding: 5 }}>Sign up</Text>
            </Pressable>
          </View>
        </ScrollView>

        <StatusBar backgroundColor="#010709" />
      </SafeAreaView>
    );
  }
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
});

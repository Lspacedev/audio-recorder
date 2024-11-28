import { Text, TextInput, View, Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
export default function Profile() {
  const isFocused = useIsFocused();
  const [theme, setTheme] = useState("Dark");
  const [user, setUser] = useState(null);
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [edit, setEdit] = useState(false);
  useEffect(() => {
    isFocused &&
      (async () => {
        setTheme(JSON.parse(await AsyncStorage.getItem("theme")));
      })();
  }, [isFocused]);
  useEffect(() => {
    getData("curr");
  }, []);
  const getData = async (storageKey) => {
    try {
      const value = await AsyncStorage.getItem(storageKey);

      let data = value !== null ? JSON.parse(value) : value;
      setUser(data);
    } catch (error) {
      // error reading value
      console.log(error);
    }
  };
  const updateProfile = async () => {
    let data = JSON.parse(await AsyncStorage.getItem("reg"));
    let acc = data.find((account) => account.userName === user.userName);
    if (userName !== "") {
      acc.userName = userName;
    }
    if (password !== "") {
      acc.password = password;
    }
    await AsyncStorage.setItem("reg", JSON.stringify(data));
  };

  return (
    <View
      style={[
        styles.container,
        theme === "Light"
          ? { backgroundColor: "white" }
          : { backgroundColor: "#0C0910" },
        ,
      ]}
    >
      {edit && (
        <Text
          style={[
            styles.text,
            theme === "Light" ? { color: "#0C0910" } : { color: "#F7F0F0" },
            ,
          ]}
          onPress={() => setEdit(false)}
        >
          x
        </Text>
      )}
      {user !== null &&
        (!edit ? (
          <Text
            style={[
              styles.text,
              theme === "Light" ? { color: "#0C0910" } : { color: "#F7F0F0" },
              ,
            ]}
          >
            Username: {user.userName}
          </Text>
        ) : (
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor={"#717171"}
            onChangeText={(text) => setUsername(text)}
          />
        ))}
      {user !== null &&
        (!edit ? (
          <Text
            style={[
              styles.text,
              theme === "Light" ? { color: "#0C0910" } : { color: "#F7F0F0" },
              ,
            ]}
          >
            Password: {user.password}
          </Text>
        ) : (
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={"#717171"}
            onChangeText={(text) => setPassword(text)}
          />
        ))}
      <Pressable
        style={styles.btn}
        onPress={!edit ? () => setEdit(true) : () => updateProfile()}
      >
        {!edit ? (
          <Text style={styles.btnText}>Edit</Text>
        ) : (
          <Text style={styles.btnText}>Update</Text>
        )}
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0C0910",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  text: {
    textAlign: "center",
    textTransform: "uppercase",
    padding: 15,
  },
  btn: {
    backgroundColor: "#F7F0F0",
    textAlign: "center",
    marginHorizontal: 80,
    padding: 10,
    borderRadius: 25,
  },
  btnText: {
    textAlign: "center",
  },
  input: {
    borderRadius: 5,
    borderColor: "#BDBDBD",
    padding: 5,
    margin: 15,
    paddingHorizontal: 10,
    color: "#BDBDBD",
    borderWidth: 0.8,
  },
});

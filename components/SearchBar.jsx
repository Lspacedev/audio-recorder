import { StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";

const SearchBar = ({ name, onChange }) => {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder={name}
        placeholderTextColor={"#717171"}
        onChangeText={(text) => onChange(text)}
      />
    </View>
  );
};

export default SearchBar;
const styles = StyleSheet.create({
  inputContainer: {
    width: 170,
  },

  input: {
    borderRadius: 5,
    borderColor: "#BDBDBD",
    textAlign: "center",
    color: "#BDBDBD",
    borderWidth: 0.8,
  },
});

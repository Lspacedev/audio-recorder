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
    gap: 5,
  },

  input: {
    borderRadius: 5,
    borderColor: "#BDBDBD",
    paddingHorizontal: 70,
    color: "#BDBDBD",
    borderWidth: 0.8,
  },
});

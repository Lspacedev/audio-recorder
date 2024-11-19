import { StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";

const CustomInput = ({ name, onChange, error, onBlur }) => {
  console.log(error);
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{name}</Text>
      <TextInput
        style={[styles.input, error && { borderColor: "#B9382C" }]}
        placeholder={name}
        placeholderTextColor={"#717171"}
        onChangeText={(text) => onChange(text)}
        onBlur={onBlur}
      />
      {error && typeof error === "string" && (
        <Text style={styles.error}>{error}</Text>
      )}
      {error &&
        typeof error === "object" &&
        error.map((error, i) => {
          return (
            <Text key={i} style={styles.error}>
              {error}
            </Text>
          );
        })}
    </View>
  );
};

export default CustomInput;
const styles = StyleSheet.create({
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
  error: {
    color: "#B9382C",
    marginVertical: -5,
  },
});

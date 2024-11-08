import { StyleSheet, Text, Pressable } from "react-native";
import React from "react";

const Button = ({ title, onPress }) => {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <Text style={{}}>{title}</Text>
    </Pressable>
  );
};

export default Button;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
  },
});

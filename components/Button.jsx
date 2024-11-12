import { StyleSheet, Text, Pressable } from "react-native";
import React from "react";

const Button = ({ title, onPress }) => {
  return (
    <Pressable
      style={[
        title === "Start"
          ? styles.start
          : title === "Stop"
          ? styles.stop
          : styles.default,
      ]}
      onPress={onPress}
    >
      {(title === "Play" || title === "Delete") && <Text>{title}</Text>}
    </Pressable>
  );
};

export default Button;
const styles = StyleSheet.create({
  default: {
    flex: 1,
    width: 50,
    height: 40,
    borderRadius: 40,
    flexDirection: "row",
    backgroundColor: "whitesmoke",
    justifyContent: "center",
    alignItems: "center",
  },
  start: {
    height: 20,
    width: 20,
    borderRadius: 20,
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "#eb4034",
  },
  stop: {
    height: 25,
    width: 25,
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "#bbb",
  },
});

import { StyleSheet, Text, Pressable } from "react-native";
import React from "react";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
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
      {(title === "Play" || title === "Pause" || title === "Delete") && (
        <Text>
          {title === "Play" ? (
            <Entypo name="controller-play" size={24} color="black" />
          ) : title === "Pause" ? (
            <FontAwesome name="pause" size={24} color="black" />
          ) : title === "Delete" ? (
            <MaterialIcons name="delete" size={24} color="black" />
          ) : (
            { title }
          )}
        </Text>
      )}
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
    height: 20,
    width: 20,
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "#bbb",
  },
});

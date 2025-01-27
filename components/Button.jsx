import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
const Button = ({ title, onPress, theme }) => {
  return (
    <TouchableOpacity style={[styles.parent]} onPress={onPress}>
      <View
        style={[
          title === "Start"
            ? styles.start
            : title === "Stop"
              ? styles.stop
              : styles.default,

          ,
        ]}
      >
        {(title === "Play" ||
          title === "Pause" ||
          title === "Delete" ||
          title === "Rename" ||
          title === "Backup" ||
          title === "Menu") && (
          <Text>
            {title === "Play" ? (
              <Entypo
                name="controller-play"
                size={24}
                style={styles.playbackBtn}
              />
            ) : title === "Pause" ? (
              <FontAwesome name="pause" size={24} style={styles.playbackBtn} />
            ) : title === "Menu" ? (
              <SimpleLineIcons name="options" size={24} color="black" />
            ) : (
              title
            )}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default Button;
const styles = StyleSheet.create({
  parent: {
    flex: 1,
    width: "100%",
    height: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  default: {
    flex: 1,
    width: 30,
    height: 50,
    flexDirection: "row",
    backgroundColor: "whitesmoke",
    justifyContent: "center",
    alignItems: "center",
  },
  start: {
    width: 30,
    height: 30,
    borderRadius: 50,
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "#eb4034",
  },
  stop: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "#bbb",
  },
  playbackBtn: {
    border: "1px solid black",
  },
});

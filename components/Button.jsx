import { StyleSheet, Text, View, Pressable } from "react-native";
import React from "react";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
const Button = ({ title, onPress }) => {
  return (
    <Pressable style={styles.parent} onPress={onPress}>
      <View
        style={[
          title === "Start"
            ? styles.start
            : title === "Stop"
              ? styles.stop
              : styles.default,
        ]}
      >
        {(title === "Play" ||
          title === "Pause" ||
          title === "Delete" ||
          title === "Rename" ||
          title === "Backup") && (
          <Text>
            {title === "Play" ? (
              <Entypo
                name="controller-play"
                size={24}
                style={styles.playbackBtn}
              />
            ) : title === "Pause" ? (
              <FontAwesome name="pause" size={24} style={styles.playbackBtn} />
            ) : title === "Delete" ? (
              <MaterialIcons
                name="delete"
                size={24}
                style={styles.playbackBtn}
              />
            ) : title === "Rename" ? (
              <MaterialIcons
                name="drive-file-rename-outline"
                size={24}
                color="black"
              />
            ) : title === "Backup" ? (
              <MaterialIcons name="backup" size={24} color="black" />
            ) : (
              { title }
            )}
          </Text>
        )}
      </View>
    </Pressable>
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
    width: 50,
    height: 50,
    borderRadius: 40,
    flexDirection: "row",
    backgroundColor: "whitesmoke",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#bbb",
    borderRadius: 50,
  },
  start: {
    width: 20,
    height: 20,
    borderRadius: 20,
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "#eb4034",
  },
  stop: {
    width: 20,
    height: 20,
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "#bbb",
  },
  playbackBtn: {
    border: "1px solid black",
  },
});

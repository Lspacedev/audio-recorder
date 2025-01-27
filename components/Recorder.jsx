import { Stack } from "expo-router";
import {
  ScrollView,
  View,
  Text,
  Image,
  Pressable,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useState, useEffect, useRef, useCallback } from "react";
import { Audio } from "expo-av";
import Button from "./Button";
import { router, useFocusEffect } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as MediaLibrary from "expo-media-library";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";

export default function Recorder() {
  const isFocused = useIsFocused();

  const [theme, setTheme] = useState("");

  const [recording, setRecording] = useState();

  const [recordingStatus, setRecordingStatus] = useState("idle");

  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [permResponse, requestPerm] = MediaLibrary.usePermissions();
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  useFocusEffect(
    useCallback(() => {
      (async () => {
        const saved = await AsyncStorage.getItem("theme");
        if (saved !== null) {
          setTheme(JSON.parse(saved));
        } else {
          setTheme("Dark");
        }
      })();
    }, [])
  );
  useEffect(() => {
    let timer = null;
    let s = 0;
    let m = 0;
    let h = 0;

    if (recordingStatus === "recording") {
      timer = setInterval(() => {
        if (s === 59) {
          s = 0;
          setSeconds(0);
          setMinutes((prev) => prev + 1);
          m++;
        }
        if (m == 59) {
          m = 0;
          setMinutes(0);
          setHours((prev) => prev + 1);
          h++;
        }
        if (h == 1) {
          clearInterval(timer);
        }
        s++;
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timer);
      setSeconds(0);
      setMinutes(0);
      setHours(0);
    }
    return () => {
      clearInterval(timer);
    };
  }, [recordingStatus]);
  async function startRecording() {
    try {
      if (permissionResponse.status !== "granted") {
        console.log("Requesting permission..");
        await requestPermission();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log("Starting recording..");
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setRecordingStatus("recording");
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }
  async function stopRecording() {
    console.log("Stopping recording..");
    setRecording(undefined);
    setRecordingStatus("stopped");
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const uri = recording.getURI();
    if (permResponse.status !== "granted") {
      await requestPerm();
    }
    try {
      const asset = await MediaLibrary.createAssetAsync(uri);
      const album = await MediaLibrary.getAlbumAsync("Audio Recorder");
      if (album == null) {
        await MediaLibrary.createAlbumAsync("Audio Recorder", asset, false);
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      }
    } catch (e) {
      handleError(e);
    }

    console.log("Recording stopped and stored at", uri);
  }
  if (theme === "") {
    return <View style={{ flex: 1 }}></View>;
  }
  return (
    <SafeAreaView
      style={[
        styles.container,
        theme === "Light"
          ? { backgroundColor: "white" }
          : { backgroundColor: "#0C0910" },
        ,
      ]}
    >
      <Text
        style={[
          styles.title,
          theme === "Light" ? { color: "#0C0910" } : { color: "#C7D6D5" },
          ,
        ]}
      >
        Audio Recorder
      </Text>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.micIcon}>
          <View
            style={[
              styles.iconBorder,
              theme === "Light"
                ? { backgroundColor: "#e6e6e7", borderColor: "#cecdcf" }
                : { backgroundColor: "#19181c", borderColor: "#141316" },
            ]}
          >
            <View
              style={[
                styles.innerIconBorder,
                theme === "Light"
                  ? { backgroundColor: "whitesmoke", borderColor: "#cecdcf" }
                  : { backgroundColor: "#141316", borderColor: "#0f0e10" },
              ]}
            >
              <FontAwesome
                name="microphone"
                size={50}
                color={theme === "Light" ? "#0C0910" : "#C7D6D5"}
              />
            </View>
          </View>
        </View>
        <Text
          style={[
            styles.time,
            theme === "Light" ? { color: "#0C0910" } : { color: "#C7D6D5" },
            ,
          ]}
        >
          {minutes < 10 ? "0" + minutes : minutes} :
          {seconds < 10 ? " 0" + seconds : seconds}
        </Text>
        <View style={styles.buttons}>
          <TouchableOpacity
            onPress={() => {
              router.push("settings");
            }}
            style={{ padding: 15 }}
          >
            <Feather
              name="settings"
              size={24}
              color={theme === "Light" ? "#0C0910" : "#C7D6D5"}
            />
          </TouchableOpacity>
          <View
            style={[
              styles.recordingBtn,
              theme === "Light"
                ? { borderWidth: 1, borderColor: "whitesmoke" }
                : { borderWidth: 1, borderColor: "white" },
            ]}
          >
            <Button
              title={recording ? "Stop" : "Start"}
              onPress={recording ? stopRecording : startRecording}
              theme={theme}
            />
          </View>
          <TouchableOpacity
            onPress={async () => {
              if (permResponse.status !== "granted") {
                await requestPerm();
              }
              router.push("recordings");
            }}
            style={{ padding: 15 }}
          >
            <Feather
              name="list"
              size={24}
              color={theme === "Light" ? "#0C0910" : "#C7D6D5"}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#010709" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: 50,
  },
  title: {
    textAlign: "center",
    fontSize: 20,
    marginVertical: 15,
  },
  time: {
    textAlign: "center",
    fontSize: 40,
    fontWeight: 200,
  },
  recordingContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: "#47454b",
    margin: 15,
    padding: 5,
    paddingHorizontal: 15,
    borderRadius: 30,
  },
  recordingTitle: {
    color: "white",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 50,
    marginVertical: 35,
  },
  recordingBtn: {
    width: 70,
    height: 70,
    borderRadius: 150,
    alignSelf: "center",
    justifyContent: "center",
    alignContent: "center",
    backgroundColor: "#e6e6e7",
  },
  navText: {
    color: "#C7D6D5",
  },
  micIcon: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  iconBorder: {
    width: 200,
    height: 200,
    borderWidth: 2,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  innerIconBorder: {
    width: 150,
    height: 150,
    borderWidth: 2,

    borderRadius: 75,
    alignItems: "center",
    justifyContent: "center",
  },
});

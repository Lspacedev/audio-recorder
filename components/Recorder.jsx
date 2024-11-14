import { Stack } from "expo-router";
import {
  ScrollView,
  View,
  Text,
  Image,
  Pressable,
  Alert,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as NavigationBar from "expo-navigation-bar";
import * as FileSystem from "expo-file-system";
import { useState, useEffect, useRef } from "react";
import { Audio } from "expo-av";
import Button from "./Button";
import { router } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as MediaLibrary from "expo-media-library";

export default function Recorder() {
  const [recording, setRecording] = useState();

  const [recordingStatus, setRecordingStatus] = useState("idle");

  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [permResponse, requestPerm] = MediaLibrary.usePermissions();
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let timer = null;
    let s = 0;
    let m = 0;
    let h = 0;
    console.log(recordingStatus);

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
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.title}>Audio Recorder</Text>
        <View style={styles.micIcon}>
          <FontAwesome name="microphone" size={50} color="white" />
        </View>
        <Text style={styles.title}>
          {minutes < 10 ? "0" + minutes : minutes} :
          {seconds < 10 ? "0" + seconds : seconds}
        </Text>

        <View style={styles.buttons}>
          <Pressable onPress={() => setRecordingStatus("stopped")}>
            <Feather name="settings" size={24} color="#C7D6D5" />
          </Pressable>
          <View style={styles.recordingBtn}>
            <Button
              title={recording ? "Stop" : "Start"}
              onPress={recording ? stopRecording : startRecording}
            />
          </View>
          <Pressable onPress={() => router.push("Recordings")}>
            <Feather name="list" size={24} color="#C7D6D5" />
          </Pressable>
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#010709" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0C0910",
  },
  scrollView: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: 100,
  },
  title: {
    color: "#C7D6D5",
    textAlign: "center",
    fontSize: 22,
  },
  recordingContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: "#333138",
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
    justifyContent: "space-around",
    alignItems: "center",
  },
  recordingBtn: {
    width: 50,
    height: 50,
    borderRadius: 150,
    alignSelf: "center",
    justifyContent: "center",
    alignContent: "center",
    backgroundColor: "whitesmoke",
  },
  navText: {
    color: "#C7D6D5",
  },
  micIcon: {
    alignItems: "center",
    justifyContent: "center",
  },
});

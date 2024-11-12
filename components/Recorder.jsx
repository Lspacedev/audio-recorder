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
import SearchBar from "./SearchBar";

import * as MediaLibrary from "expo-media-library";

export default function Recorder() {
  const [recording, setRecording] = useState();
  const [recordings, setRecordings] = useState([]);
  const [recordingStatus, setRecordingStatus] = useState("idle");
  const sound = useRef(new Audio.Sound());
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [permResponse, requestPerm] = MediaLibrary.usePermissions();

  useEffect(() => {
    getAllRecordings();
  }, []);
  useEffect(() => {
    if (searchText.length > 0) {
      const filteredRecordings = recordings.filter(
        (recording) =>
          recording.filename.toLowerCase() === searchText.toLowerCase()
      );
      if (filteredRecordings.length > 0) {
        setSearchResults(filteredRecordings);
      }
    }
  }, []);
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
      //console.log(asset, album)
      if (album == null) {
        await MediaLibrary.createAlbumAsync("Audio Recorder", asset, false);
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      }
      getAllRecordings();
    } catch (e) {
      handleError(e);
    }

    console.log("Recording stopped and stored at", uri);
  }
  const playRecordings = (array) => {
    return array.map((record, i) => {
      return (
        <View key={i} style={styles.recordingContainer}>
          <Text style={styles.recordingTitle}>
            {record.filename.slice(0, 20) + "..."} | {record.duration}
          </Text>
          <Button
            title="Delete"
            onPress={() => deleteRecording(record.id, record.albumId)}
          />

          <Button title="Play" onPress={() => playSound(record.uri)} />
          <Button title="Pause" onPress={() => pauseSound()} />
        </View>
      );
    });
  };
  const playSound = async (uri) => {
    // const playbackObject = new Audio.Sound();
    // await playbackObject.loadAsync({ uri: uri });
    // await playbackObject.playAsync();
    // await sound.current.loadAsync({ uri: uri });
    // try {
    //   const result = await sound.current.getStatusAsync();
    //   if (result.isLoaded) {
    //     if (result.isPlaying === false) {
    //       await sound.current.playAsync();
    //     }
    //   }
    // } catch (error) {
    //   console.log(error);
    // }
  };
  const deleteRecording = async (assetId, albumId) => {
    await MediaLibrary.removeAssetsFromAlbumAsync(assetId, albumId);
    getAllRecordings();
  };
  const pauseSound = async () => {
    // try {
    //   const result = await sound.current.getStatusAsync();
    //   if (result.isLoaded) {
    //     if (result.isPlaying === true) {
    //       sound.current.pauseAsync();
    //     }
    //   }
    // } catch (error) {
    //   console.log(error);
    // }
  };

  const getAllRecordings = async () => {
    let album = await MediaLibrary.getAlbumAsync("Audio Recorder");
    if (album !== null) {
      const media = await MediaLibrary.getAssetsAsync({
        album: album,
        mediaType: MediaLibrary.MediaType.audio,
        first: 40,
      });
      setRecordings(media.assets);
    } else {
      setRecordings([]);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.title}>Audio Recorder</Text>
        {searchResults.length > 0
          ? playRecordings(searchResults)
          : playRecordings(recordings)}
        <View style={styles.recordingBtn}>
          <Button
            title={recording ? "Stop" : "Start"}
            onPress={recording ? stopRecording : startRecording}
          />
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
  recordingBtn: {
    width: 50,
    height: 50,
    borderRadius: 150,
    alignSelf: "center",
    justifyContent: "center",
    alignContent: "center",
    backgroundColor: "whitesmoke",
  },
});

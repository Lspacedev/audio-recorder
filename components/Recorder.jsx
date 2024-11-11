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
import * as FileSystem from 'expo-file-system';
import { useState, useEffect } from "react";
import { Audio } from "expo-av";
import Button from "./Button";

import * as MediaLibrary from 'expo-media-library';

export default function Recorder() {
  const [recording, setRecording] = useState();
  const [recordings, setRecordings] = useState([]);
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [recordingStatus, setRecordingStatus] = useState('idle');
  const [permResponse, requestPerm] = MediaLibrary.usePermissions();
  useEffect(()=>{
    getAllRecordings();
  },[])
  
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
      setRecordingStatus('recording');
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }
  async function stopRecording() {
    console.log("Stopping recording..");
    setRecording(undefined);
    setRecordingStatus('stopped');
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const uri = recording.getURI();

  //   let allRecordings = [...recordings];
  //   const {sound, status} = await recording.createNewLoadedSoundAsync();
   
  //  allRecordings.push({
  //   sound: sound,
  //   duration: status.durationMillis,
  //   file: uri
  //  })
    //const fileName = `recording-${Date.now()}.m4a`;
    //console.log(recording)
    
    // await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'recordings/', { intermediates: true });
    // await FileSystem.moveAsync({
    //       from: uri,
    //       to: FileSystem.documentDirectory + 'recordings/' + `${fileName}`
    // });
    // const playbackObject = new Audio.Sound();
    // await playbackObject.loadAsync({ uri: FileSystem.documentDirectory + 'recordings/' + `${fileName}` });
    // await playbackObject.playAsync();


    if (permResponse.status !== 'granted') {
      await requestPerm();
    }
    try {
      const asset = await MediaLibrary.createAssetAsync(uri);
      const album = await MediaLibrary.getAlbumAsync('Audio Recorder');
      //console.log(asset, album)
      if (album == null) {
        await MediaLibrary.createAlbumAsync('Audio Recorder', asset, false);
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      }
      getAllRecordings();

    } catch (e) {
      handleError(e);
    }

    console.log("Recording stopped and stored at", uri);
  }
  const playRecordings = () => {
    return recordings.map((record, i) => {
      return (
        <View key={i} styles={styles.recordingContainer}>
          <Text style={styles.recordingTitle}>
            {record.filename} | {record.duration}
          </Text>
          <Button title="Delete" onPress={() => deleteRecording(record.id, record.albumId)} />

          <Button title="Play" onPress={() => playSound(record.uri)} />

        </View>
      );
    });
  }
  const playSound = async(uri) => {
     const playbackObject = new Audio.Sound();
    await playbackObject.loadAsync({ uri: uri});
    await playbackObject.playAsync();
  }
  const deleteRecording = async (assetId, albumId) => {
    await MediaLibrary.removeAssetsFromAlbumAsync(assetId, albumId);
    getAllRecordings();
  }

  const getAllRecordings = async() => {
      let album = await MediaLibrary.getAlbumAsync("Audio Recorder")
      if(album !== null){
        const media = await MediaLibrary.getAssetsAsync({
          album: album,
          mediaType: MediaLibrary.MediaType.audio,
          first: 40
      });
      setRecordings(media.assets);
    }else {
      setRecordings([]);
    }
  }
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.title}>Audio Recorder</Text>
        {playRecordings()}
        <View>
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
    backgroundColor: "#0C120C",
  },
  title: {
    color: "#C7D6D5",
    textAlign: "center",
    fontSize: 22,
  },
  recordingContainer: {
    backgroundColor: "white"
  },
  recordingTitle: {
    color: "white"
  }
});

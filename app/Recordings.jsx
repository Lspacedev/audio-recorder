import { StyleSheet, View, Text, Pressable } from "react-native";
import React from "react";
import { useState, useEffect, useRef } from "react";
import { Audio } from "expo-av";
//import * as MediaLibrary from "expo-media-library";

const Recordings = () => {
  const [recordings, setRecordings] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const sound = useRef(new Audio.Sound());

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
    // await MediaLibrary.removeAssetsFromAlbumAsync(assetId, albumId);
    // getAllRecordings();
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
    // let album = await MediaLibrary.getAlbumAsync("Audio Recorder");
    // if (album !== null) {
    //   const media = await MediaLibrary.getAssetsAsync({
    //     album: album,
    //     mediaType: MediaLibrary.MediaType.audio,
    //     first: 40,
    //   });
    //   setRecordings(media.assets);
    // } else {
    //   setRecordings([]);
    // }
  };
  return (
    <View style={styles.container}>
      {searchResults.length > 0 ? (
        playRecordings(searchResults)
      ) : recordings.length > 0 ? (
        playRecordings(recordings)
      ) : (
        <Text style={styles.text}>No recordings</Text>
      )}
    </View>
  );
};

export default Recordings;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0C0910",
  },
  text: {
    color: "#C7D6D5",
    textAlign: "center",
  },
});

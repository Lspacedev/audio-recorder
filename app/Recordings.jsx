import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  Modal,
  Alert,
} from "react-native";
import React from "react";
import { useState, useEffect, useRef } from "react";
import { Audio } from "expo-av";
import * as MediaLibrary from "expo-media-library";
import Button from "../components/Button";
import SearchBar from "../components/SearchBar";
import useAsyncStorage from "../hooks/useAsyncStorage";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";

const Recordings = () => {
  const [recordings, setRecordings] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [playing, setPlaying] = useState(false);
  const [updatedRecs, setUpdatedRecs] = useAsyncStorage("names", []);
  const [openForm, setOpenForm] = useState(false);
  const [name, setName] = useState("");

  const sound = useRef(new Audio.Sound());

  useEffect(() => {
    console.log(updatedRecs);
    getAllRecordings();
  }, []);
  useEffect(() => {
    updateRecordingNames();
  }, []);
  useEffect(() => {
    if (searchText.length > 0) {
      const filteredRecordings = recordings.filter((recording) =>
        recording.filename.match(searchText)
      );
      if (filteredRecordings.length > 0) {
        setSearchResults(filteredRecordings);
      }
    }
  }, [searchText]);
  const playRecordings = (array) => {
    return array.map((record, i) => {
      return (
        <View key={i} style={styles.recordingContainer}>
          <Modal
            style={styles.modal}
            animationType="slide"
            transparent={true}
            visible={openForm}
            // onRequestClose={() => {
            //   Alert.alert("Modal has been closed.");
            //   setModalVisible(!modalVisible);
            // }}
          >
            <TextInput
              style={styles.rename}
              placeholder="Enter new name"
              placeholderTextColor={"#717171"}
              onChangeText={(text) => setName(text)}
            />
            <Button
              title="Submit"
              onPress={() => renameFile(record.id, name)}
            />
          </Modal>

          <Text style={styles.recordingTitle}>
            {record.filename.slice(0, 20) + "..."} | {record.duration}
          </Text>
          <Button
            title="Delete"
            onPress={() => deleteRecording(record.id, record.albumId)}
          />

          {playing ? (
            <Button title="Pause" onPress={() => pauseSound()} />
          ) : (
            <Button title="Play" onPress={() => playSound(record.uri)} />
          )}
          <Button title="Rename" onPress={() => setOpenForm(true)} />
        </View>
      );
    });
  };
  const playSound = async (uri) => {
    try {
      const result = await sound.current.getStatusAsync();
      if (result.isLoaded === false) {
        await sound.current.loadAsync({ uri: uri });
      }

      if (result.isPlaying === false) {
        await sound.current.playAsync();
        setPlaying(true);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const deleteRecording = async (assetId, albumId) => {
    try {
      await MediaLibrary.removeAssetsFromAlbumAsync(assetId, albumId);
      getAllRecordings();
    } catch (error) {
      console.log(error);
    }
  };
  const pauseSound = async () => {
    try {
      const result = await sound.current.getStatusAsync();
      if (result.isLoaded) {
        if (result.isPlaying === true) {
          await sound.current.pauseAsync();
          setPlaying(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
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
  console.log(updatedRecs);
  const renameFile = (id, newName) => {
    const filteredFiles = updatedRecs.filter((file) => file.id === id);
    if (filteredFiles.length === 0) {
      setUpdatedRecs((prev) => [...prev, { id, name: newName }]);
    } else {
      const filesCopy = [...updatedRecs];
      let file = filesCopy.find((file) => file.id === id);
      file.name = newName;
      setUpdatedRecs(filesCopy);
    }
  };
  const updateRecordingNames = () => {
    if (updatedRecs.length > 0) {
      const recordingsCopy = [...recordings];
      for (let i = 0; i < updatedRecs.length; i++) {
        for (let k = 0; k < recordingsCopy.length; k++) {
          if (recordingsCopy[k].id === updatedRecs[i]) {
            recordingsCopy[k].filename = updatedRecs[i].name;
          }
        }
      }

      setRecordings(recordingsCopy);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.recordingsNav}>
        <Pressable
          onPress={() => router.push("./", { relativeToDirectory: true })}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </Pressable>

        <Text style={styles.recordingsTitle}>Recordings</Text>
        <SearchBar name="Find" onChange={setSearchText} />
      </View>

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
    backgroundColor: "whitesmoke",
  },
  recordingsNav: {
    backgroundColor: "#0C0910",
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    padding: 25,
  },
  recordingsTitle: {
    color: "white",
    fontSize: 20,
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
  navText: {
    color: "#C7D6D5",
  },
  modal: {
    felx: 1,
    backgroundColor: "blue",
  },
  rename: {
    borderRadius: 5,
    borderColor: "black",
    paddingHorizontal: 70,
    color: "black",
    borderWidth: 0.8,
  },
});

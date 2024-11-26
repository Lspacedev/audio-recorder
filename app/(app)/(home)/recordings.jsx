import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  Modal,
  Alert,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useState, useEffect, useRef } from "react";
import { Audio } from "expo-av";
import * as MediaLibrary from "expo-media-library";
import Button from "@/components/Button";
import SearchBar from "@/components/SearchBar";
import Rename from "@/components/Rename";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Slider from "@react-native-community/slider";
import { configureGoogleSignIn, signIn } from "@/config/google";
import {
  GDrive,
  MimeTypes,
} from "@robinbobin/react-native-google-drive-api-wrapper";
import RNFS from "react-native-fs";

const Recordings = () => {
  const [recordings, setRecordings] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);

  const [updatedRecs, setUpdatedRecs] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [name, setName] = useState("");
  const [curr, setCurr] = useState("");

  const [pos, setPos] = useState(0);
  const [soundStatus, setSoundStatus] = useState({});
  const [dur, setDur] = useState(0);

  const sound = useRef(new Audio.Sound());
  const lastTapTimeRef = useRef(null);

  const handleTap = () => {
    const now = new Date().getTime();
    const DOUBLE_TAP_DELAY = 300; // Adjust as needed for your use case (in milliseconds)

    if (now - lastTapTimeRef.current < DOUBLE_TAP_DELAY) {
      // Double tap detected
      console.log("Double tap!");
      // Perform 'like' action here
    } else {
      // Single tap detected
      console.log("Single tap!");
      // Toggle play/pause video
      setPlaying(!playing);
    }

    lastTapTimeRef.current = now;
  };
  const storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      // saving error
    }
  };
  const getData = async () => {
    try {
      const data = await AsyncStorage.getItem("updates");

      if (data !== null) {
        setUpdatedRecs(JSON.parse(data));
        return data;
      }
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  useEffect(() => {
    configureGoogleSignIn();
    getData();
  }, []);
  useEffect(() => {
    getAllRecordings();
  }, []);

  useEffect(() => {
    storeData("updates", JSON.stringify(updatedRecs));
  }, [updatedRecs]);

  useEffect(() => {
    if (playing === true) {
      sound.current.setOnPlaybackStatusUpdate(async (status) => {
        if (status.didJustFinish) {
          console.log("Done playing");
          await sound.current.unloadAsync();
          setPlaying(false);

          setCurr("");
          setPos(0);
        } else {
          const position = status.positionMillis / status.durationMillis;
          setPos(position);
        }
      });
    }
  }, [playing]);
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
        <View key={i}>
          <View key={i} style={styles.recordingContainer}>
            <Modal
              style={styles.modal}
              animationType="slide"
              transparent={true}
              visible={openForm}
            >
              <Rename
                setName={setName}
                name={name}
                closeForm={setOpenForm}
                renameFile={renameFile}
                id={record.id}
              />
            </Modal>

            <View style={styles.recordingTitle}>
              <Text>
                {record.filename.length > 20
                  ? record.filename.slice(0, 15) + "..."
                  : record.filename}{" "}
              </Text>
              <Text>{formatDuration(record.duration)}</Text>
            </View>
            <View style={styles.recordBtns}>
              {/* <Text>{JSON.stringify(playing)}</Text> */}

              <Button
                title="Delete"
                onPress={() => deleteRecording(record.id, record.albumId)}
              />
              {/* {playing && curr === record.uri ? (
                <Button title="Pause" onPress={() => pauseSound()} />
              ) : (
                <Button
                  title="Play"
                  onPress={() => playSound(record.uri, record.duration)}
                />
              )} */}
              {!playing ? (
                <Button
                  title="Play"
                  onPress={() => playSound(record.uri, record.duration)}
                />
              ) : curr === record.uri ? (
                <Button title="Pause" onPress={() => pauseSound()} />
              ) : (
                <Button
                  title="Play"
                  onPress={() => playSound(record.uri, record.duration)}
                />
              )}
              <Button title="Rename" onPress={() => setOpenForm(true)} />
              <Button title="Backup" onPress={() => backupAudio(record)} />
            </View>
          </View>

          {curr === record.uri && (
            <Slider
              style={{ width: "100%", margin: 0 }}
              minimumValue={0}
              maximumValue={1}
              value={pos}
              onChange={(value) => setPos(value)}
              onSlidingStart={async (value) => {
                console.log({ value });
                if (!playing) return;
                try {
                  await sound.current.pauseAsync();
                  setPlaying(false);
                } catch (error) {
                  console.log("err on slide");
                }
              }}
              onSlidingComplete={async (value) => {
                console.log("end");
                if (soundStatus === null) return;

                try {
                  const status = await sound.current.setPositionAsync(
                    Math.floor(dur * value)
                  );
                  setSoundStatus(status);
                  await sound.current.playAsync();
                  setPlaying(true);
                } catch (error) {
                  console.log("slide err", error);
                }
              }}
            />
          )}
        </View>
      );
    });
  };
  const playSound = async (uri, duration) => {
    try {
      const result = await sound.current.getStatusAsync();
      if (result.isLoaded === false) {
        setPlaying(true);
        setCurr(uri);
        setDur(duration * 1000);
        await sound.current.loadAsync({ uri: uri });
        await sound.current.playAsync();
      }

      if (result.isPlaying === false) {
        setPlaying(true);
        setCurr(uri);
        setDur(duration * 1000);
        await sound.current.playAsync();
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
  const formatDuration = (duration) => {
    const minutes = duration / 60;
    const seconds = Math.round((minutes - Math.floor(minutes)) * 60);
    return seconds < 10
      ? `${Math.floor(minutes)}:0${seconds}`
      : `${Math.floor(minutes)}:${seconds}`;
  };
  const getAllRecordings = async () => {
    let album = await MediaLibrary.getAlbumAsync("Audio Recorder");
    if (album !== null) {
      const media = await MediaLibrary.getAssetsAsync({
        album: album,
        mediaType: MediaLibrary.MediaType.audio,
        first: 40,
      });
      const data = await getData();
      updateRecordingNames(JSON.parse(data), media.assets);
    } else {
      setRecordings([]);
    }
  };
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
    updateRecordingNames(updatedRecs, recordings);

    setOpenForm(false);
  };
  const updateRecordingNames = (arr, recordingsArr) => {
    if (arr.length > 0) {
      const recordingsCopy = [...recordingsArr];
      for (let i = 0; i < arr.length; i++) {
        for (let k = 0; k < recordingsCopy.length; k++) {
          if (recordingsCopy[k].id === arr[i].id) {
            recordingsCopy[k].filename = arr[i].name;
          }
        }
      }
      setRecordings(recordingsCopy);
    } else {
      setRecordings(recordingsArr);
    }
  };

  const backupAudio = async (record) => {
    try {
      const res = await signIn();
      const gdrive = new GDrive();
      gdrive.accessToken = res;
      gdrive.fetchTimeout = 30000;

      RNFS.readFile(record.uri, "base64").then(async (data) => {
        // binary data
        const id = (
          await gdrive.files
            .newMultipartUploader()
            .setIsBase64(true)
            .setData(data, "audio/mp4")
            .setRequestBody({
              name: record.filename,
            })
            .execute()
        ).id;
        Alert.alert("Backup success");
      });
    } catch (error) {
      console.log(error);
      Alert.alert("An error occured while backing up");
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
    padding: 5,
    paddingVertical: 25,
  },
  recordingsTitle: {
    color: "white",
    fontSize: 20,
    flexDirection: "row",
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
    alignItems: "center",
    justifyContent: "space-between",

    padding: 15,
    paddingHorizontal: 5,
  },
  recordingTitle: {
    color: "black",
    flex: 1,
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
  recordBtns: {
    flex: 2,
    flexDirection: "row",
    gap: 2,
  },
  text: {
    textAlign: "center",
    margin: 20,
  },
  touch: {
    padding: 0,
    backgroundColor: "red",
  },
});

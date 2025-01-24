import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  Modal,
  Alert,
  ActivityIndicator,
  TouchableWithoutFeedback,
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

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import EvilIcons from "@expo/vector-icons/EvilIcons";
const Recordings = () => {
  const [recordings, setRecordings] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);

  const [updatedRecs, setUpdatedRecs] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [name, setName] = useState("");
  const [curr, setCurr] = useState("");

  const [pos, setPos] = useState(0);
  const [soundStatus, setSoundStatus] = useState({});
  const [dur, setDur] = useState(0);

  const [loading, setLoading] = useState(false);
  const [modalId, setModalId] = useState("");

  const sound = useRef(new Audio.Sound());

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
          setPaused(false);
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
              style={styles.menuModal}
              animationType="fade"
              transparent={true}
              visible={openMenu && modalId === record.id}
              onRequestClose={() => {
                setOpenMenu(false);
              }}
            >
              <TouchableWithoutFeedback
                onPress={() => {
                  setOpenMenu(false);
                }}
              >
                <View style={{ backgroundColor: "transparent", flex: 1 }}>
                  <TouchableWithoutFeedback onPress={() => {}}>
                    <View style={styles.menu}>
                      <Text
                        onPress={() => {
                          setOpenMenu(false);
                        }}
                        style={{
                          padding: 0,
                          margin: 0,
                          textAlign: "right",
                        }}
                      >
                        <EvilIcons name="close" size={24} color="black" />
                      </Text>

                      <Pressable
                        style={styles.menuItem}
                        onPress={() => {
                          setModalId(record.id);
                          setOpenForm(true);
                        }}
                      >
                        <MaterialIcons
                          name="drive-file-rename-outline"
                          size={24}
                          color="black"
                        />
                        <Text>Rename</Text>
                      </Pressable>
                      <Pressable
                        style={styles.menuItem}
                        onPress={() =>
                          deleteRecording(record.id, record.albumId)
                        }
                      >
                        <MaterialIcons name="delete" size={24} />
                        <Text>Delete</Text>
                      </Pressable>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
            <Modal
              style={styles.modal}
              animationType="slide"
              transparent={true}
              visible={openForm && modalId === record.id}
            >
              <Rename
                setName={setName}
                name={name}
                closeForm={setOpenForm}
                renameFile={renameFile}
                id={record.id}
              />
            </Modal>
            <View style={styles.playTitleContainer}>
              {!playing ? (
                <Button
                  style={{ flex: 1 }}
                  title="Play"
                  onPress={() => playSound(record.uri, record.duration)}
                />
              ) : curr === record.uri ? (
                <Button
                  style={{ flex: 1 }}
                  title="Pause"
                  onPress={() => pauseSound()}
                />
              ) : (
                <Button
                  style={{ flex: 1 }}
                  title="Play"
                  onPress={() => playSound(record.uri, record.duration)}
                />
              )}

              <View style={styles.recordingTitle}>
                <Text>
                  {record.filename.length > 20
                    ? record.filename.slice(0, 15) + "..."
                    : record.filename}{" "}
                </Text>
                <Text>{formatDuration(record.duration)}</Text>
              </View>
            </View>
            <View style={styles.recordBtns}>
              <Button
                title="Menu"
                onPress={() => {
                  setModalId(record.id);
                  setOpenMenu(!openMenu);
                }}
              />
            </View>
          </View>

          {curr === record.uri && (
            <Slider
              style={{ width: "100%", height: 50 }}
              minimumValue={0}
              maximumValue={1}
              value={pos}
              onChange={(value) => setPos(value)}
              onSlidingStart={async (value) => {
                if (!playing) return;
                try {
                  await sound.current.pauseAsync();
                  setPlaying(false);
                } catch (error) {
                  console.log("err on slide");
                }
              }}
              onSlidingComplete={async (value) => {
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
      if (paused && curr !== uri) {
        console.log("song is paused");
        return;
      }
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
      await sound.current.unloadAsync();
      await MediaLibrary.removeAssetsFromAlbumAsync(assetId, albumId);
      setPlaying(false);
      setPaused(false);
      setCurr("");
      setPos(0);
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
          setPaused(true);
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
    setLoading(true);
    let album = await MediaLibrary.getAlbumAsync("Audio Recorder");
    if (album !== null) {
      const media = await MediaLibrary.getAssetsAsync({
        album: album,
        mediaType: MediaLibrary.MediaType.audio,
        first: 40,
      });

      const data = await getData();
      updateRecordingNames(JSON.parse(data), media.assets);
      setLoading(false);
    } else {
      setRecordings([]);
      setLoading(false);
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
      {loading ? (
        <View
          style={{ flex: 1, alignContent: "center", justifyContent: "center" }}
        >
          <ActivityIndicator size="500" color="#0000ff" />
        </View>
      ) : (
        <View>
          {searchResults.length > 0 ? (
            playRecordings(searchResults)
          ) : recordings.length > 0 ? (
            playRecordings(recordings)
          ) : (
            <Text style={styles.text}>No recordings</Text>
          )}
        </View>
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
    marginTop: 20,
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
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  playTitleContainer: {
    flex: 4,
    flexDirection: "row",
  },
  recordingTitle: {
    color: "black",
    flex: 4,
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
    flex: 1,
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
    flex: 1,
    flexDirection: "row",
    gap: 2,
  },
  text: {
    textAlign: "center",
    margin: 20,
  },
  menuModal: {
    flex: 1,

    backgroundColor: "blue",
  },
  menu: {
    position: "absolute",
    right: 0,
    width: 200,
    height: 150,
    backgroundColor: "white",
    borderRadius: 5,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 15,
    alignItems: "center",
    padding: 5,
  },
});

import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";

export default function Rename({ setName, name, closeForm, renameFile, id }) {
  return (
    <View style={styles.modal}>
      <View style={styles.form}>
        <Pressable
          style={styles.closeBtn}
          onPress={() => {
            closeForm(false);
          }}
        >
          <Text style={styles.close}>x</Text>
        </Pressable>

        <TextInput
          style={styles.input}
          placeholder="Enter new name"
          placeholderTextColor={"#717171"}
          onChangeText={(text) => setName(text)}
        />

        <Pressable style={styles.button} onPress={() => renameFile(id, name)}>
          <Text style={styles.buttonText}>Submit</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#010709",
    flex: 1,
    paddingHorizontal: 5,
    width: 350,
  },
  scrollView: {
    gap: 15,
    paddingVertical: 20,
  },

  inputContainer: {
    gap: 5,
  },
  label: {
    color: "#BDBDBD",
  },
  input: {
    borderRadius: 5,
    borderColor: "#BDBDBD",
    padding: 5,
    width: "100%",
    color: "#BDBDBD",
    borderWidth: 0.8,
  },
  button: {
    backgroundColor: "#0C0910",
    padding: 5,
    paddingHorizontal: 50,
    width: "100%",
    marginTop: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#C7D6D5",
    textAlign: "center",
    textTransform: "uppercase",
  },
  signInSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 25,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  form: {
    margin: 25,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
  },
  imageUploadBtn: {
    padding: 0,
    marginLeft: 0,
  },
  imageUpload: {
    fontSize: 20,
    marginVertical: 10,
    color: "#BDBDBD",
  },
  closeBtn: {
    alignSelf: "flex-end",
  },
  close: {
    color: "#BDBDBD",
    fontSize: 25,
    margin: 0,
    padding: 0,
  },
});

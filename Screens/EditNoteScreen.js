import {
  View,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Animated,
  StatusBar,
} from "react-native";
import Constants from "expo-constants";
import React, { Component, useRef } from "react";
import { useState, useEffect } from "react";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { ScrollView } from "react-native-gesture-handler";
import FontAwesome from "../node_modules/@expo/vector-icons/FontAwesome";
import EvilIcon from "../node_modules/@expo/vector-icons/EvilIcons";
import AntDesign from "../node_modules/@expo/vector-icons/AntDesign";
import UserAvatar from "@muhzi/react-native-user-avatar";
import { SimpleLineIcons } from "@expo/vector-icons";
import { db } from "../components/FirestoreConfig";
import {
  collection,
  setDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
const CONTAINER_HEIGHT = 80;

export default function EditNoteScreen({ navigation, route }) {
  const { id } = route.params;
  const node = id.toString();
  const [note, setNote] = useState('');
  const [currentDate, setCurrentDate] = useState("");
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  
  //Lấy note đã touch ở NoteScreen
  useEffect(() => {
    const fetchNote = async () => {
      try {
        const noteDoc = await getDoc(doc(db, "Note", node));
        if (noteDoc.exists()) {
          const noteData = noteDoc.data();
          setNote(noteData);
          setTitle(noteData.Title);
          setDescription(noteData.Description);
          const timestamp = noteData.CreateAt;
          const seconds = timestamp.seconds;
          const date = new Date(seconds * 1000); // Chuyển đổi thành đối tượng Date
          const formattedDate = formatDate(date);
          setCurrentDate(formattedDate); // Định dạng ngày tháng
        } else {
          console.log("Note id does not exist");
        }
      } catch (error) {
        console.log("Error getting document:", error);
      }
    };
    fetchNote();
  }, [id]);
  //Format lại định dạng ngày tháng của note
  const formatDate = (date) => {
    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  //Hàm sửa Note
  const updateNote = async () => {
    try {
      const editedNote = {
        Title: title,
        Description: description,
      };
      console.log(editedNote);
      const noteRef = doc(db, "Note", node);
      // await setDoc(noteRef, editedNote);
      await updateDoc(noteRef, editedNote);
      console.log('Cập nhật thành công!');
    } catch (error) {
      console.error('Lỗi khi cập nhật:', error);
    }
    navigation.replace("NoteScreen");
  };

  // Header Animation
  const scrollY = useRef(new Animated.Value(0)).current;
  const offsetAnim = useRef(new Animated.Value(0)).current;
  const clampedScroll = Animated.diffClamp(
    Animated.add(
      scrollY.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
        extrapolateLeft: "clamp",
      }),
      offsetAnim
    ),
    0,
    CONTAINER_HEIGHT
  );

  var _clampedScrollValue = 0;
  var _offsetValue = 0;
  var _scrollValue = 0;
  useEffect(() => {
    scrollY.addListener(({ value }) => {
      const diff = value - _scrollValue;
      _scrollValue = value;
      _clampedScrollValue = Math.min(
        Math.max(_clampedScrollValue * diff, 0),
        CONTAINER_HEIGHT
      );
    });
    offsetAnim.addListener(({ value }) => {
      _offsetValue = value;
    });
  }, []);

  const headerTranslate = clampedScroll.interpolate({
    inputRange: [0, CONTAINER_HEIGHT],
    outputRange: [0, -CONTAINER_HEIGHT],
    extrapolate: "clamp",
  });
  // End of header animation
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      enabled
      keyboardVerticalOffset={Platform.select({ ios: 0, android: 500 })}
    >
      <View>
        <StatusBar barStyle={"dark-content"} />
        <Animated.View
          style={[
            styles.header,
            { transform: [{ translateY: headerTranslate }] },
          ]}
        >
          <View style={styles.rowSection}>
            {/* Button: back to previous screen */}
            <TouchableOpacity
              style={styles.headerBehave}
              onPress={() => navigation.goBack()}
            >
              <SimpleLineIcons name="arrow-left" size={20} color="black" />
            </TouchableOpacity>

            {/* Done  */}
            <TouchableOpacity
              style={styles.headerBehave}
              onPress={updateNote}
            >
              <Text style={styles.textHeader}>Done</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
        <Animated.ScrollView
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
        >
          <View>
            {/* Layout back button, small avatar, title of note, create date*/}
            <View style={{ marginTop: 80 }}>
              {/* Title */}
              <Text style={styles.smallTitle}>Title</Text>
              <TouchableOpacity style={styles.insertBox}>
                <TextInput
                  style={styles.textInInsertBox}
                  defaultValue={note.Title}
                  onChangeText={(text) => setTitle(text)}
                  placeholderTextColor={Colors.defaultValue}
                />
              </TouchableOpacity>

              {/* Date */}
              <Text style={styles.smallTitle}>Date</Text>
              <TouchableOpacity style={styles.insertBox}>
                <Text style={styles.textInInsertBox}>{currentDate}</Text>
              </TouchableOpacity>
            </View>

            {/* Description, button Create note */}
            {/* Description */}
            <View style={{ flex: 60, backgroundColor: "white" }}>
              <Text style={styles.smallTitle}>Description</Text>
              <TouchableOpacity style={styles.noteBox}>
                <TextInput
                  style={styles.textInNoteBox}
                  multiline={true}
                  defaultValue={note.Description}
                  onChangeText={(text) => setDescription(text)}
                  placeholderTextColor={Colors.defaultValue}
                />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

// const AddNoteScreen = () => {

// };

const styles = StyleSheet.create({
  headerBehave: {
    padding: 20,
  },

  header: {
    position: "absolute",
    width: "100%",
    height: CONTAINER_HEIGHT,
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: "white",
    zIndex: 1000,
    elevation: 1000,
  },
  rowSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  image: {
    height: 225,
    width: 225,
    alignItems: "center",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 20,
  },

  smallTitle: {
    marginLeft: 15,
    marginRight: "auto",
    color: "#363942",
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    shadowColor: "gray",
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    // fontStyle
  },

  normalTextOnBackGround: {
    marginLeft: "auto",
    marginRight: 30,
    color: "black",
    fontSize: 13,
    textDecorationLine: "underline",
  },

  button: {
    // bordercolor: "white",
    backgroundColor: "#4B7BE5",
    marginTop: 15,
    height: 50,
    borderRadius: 10,
    shadowColor: "gray",
    shadowOpacity: 10,
    marginHorizontal: 15,
    marginBottom: 30,
  },

  buttonCreateAccount: {
    backgroundColor: "#81A3ED",
    marginVertical: 15,
    height: 50,
    borderRadius: 10,
    shadowColor: "gray",
    shadowOpacity: 10,
    marginHorizontal: 30,
  },

  noteBox: {
    backgroundColor: "#F5F5F5",
    // marginVertical: 10,
    marginTop: 5,
    marginBottom: 10,
    height: 340,
    borderRadius: 10,
    shadowColor: "gray",
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    marginHorizontal: 15,
  },

  insertBox: {
    backgroundColor: "#F5F5F5",
    // marginVertical: 10,
    marginTop: 5,
    marginBottom: 10,
    height: 45,
    borderRadius: 10,
    shadowColor: "gray",
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    marginHorizontal: 15,
  },

  textInInsertBox: {
    fontSize: 16,
    // fontFamily: "Poppins",
    marginBottom: "auto",
    marginTop: "auto",
    marginLeft: 15,
    marginRight: "auto",
    width: "90%",
  },

  textInNoteBox: {
    fontSize: 16,
    // fontFamily: "Poppins",
    marginBottom: "auto",
    marginTop: 5,
    marginLeft: 15,
    marginRight: "auto",
    height: "auto",
    width: "90%",
  },

  separator: {
    marginTop: 10,
    marginRight: 20,
    marginLeft: "auto",
  },
  textHeader: {
    color: "#3379E4",
    fontWeight: "500",
    fontSize: 18
  },
  container: {
    // alignItems: "center",
    // justifyContent: "center",
    flex: 1,
    backgroundColor: "white",
    // padding: 8,
  },
});

import {
  View,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Animated,
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
import { db } from "../components/FirestoreConfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";
import NoteCard from "../components/NoteCard";

const CONTAINER_HEIGHT = 80;

const NoteInforScreen = ({ navigation, route }) => {
  const [currentDate, setCurrentDate] = useState("");
  const [note, setNote] = useState('');
  const { id } = route.params;
  const node = id.toString();

  //Lấy note đã touch ở NoteScreen
  useEffect(() => {
    const fetchNote = async () => {
      try {
        const noteDoc = await getDoc(doc(db, "Note", node));
        if (noteDoc.exists()) {
          const noteData = noteDoc.data();
          setNote(noteData);
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

  const deleteNote = async () => {
    try {
      const noteRef = doc(db, "Note", node);
      await deleteDoc(noteRef);
      console.log('Xóa document thành công!');
    } catch (error) {
      console.error('Lỗi khi xóa document:', error);
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
      style={{ backgroundColor: "white" }}
      enabled
      keyboardVerticalOffset={Platform.select({ ios: 0, android: 500 })}
    >
      <Animated.View
        style={[
          styles.header,
          { transform: [{ translateY: headerTranslate }] },
        ]}
      >
        <View style={styles.row}>
          {/* Button: back to previous screen */}
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign
              name="left"
              size={30}
              style={styles.headerBehave}
            ></AntDesign>
          </TouchableOpacity>

          {/* edit button */}
          <View>
            <TouchableOpacity onPress={() => navigation.navigate("EditNote", { id })}>
              <Text style={styles.editButton}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
      >
        <View style={{ backgroundColor: "white", flex: 1 }}>
          {/* Layout back button, small avatar, title of note, create date*/}
          <View style={{ flex: 50, backgroundColor: "white", marginTop: 85 }}>
            {/* Title */}
            <Text style={styles.smallTitle}>Title</Text>
            <View style={styles.insertBox}>
              {/* Load title của note lên <text> */}
              <Text style={styles.textInInsertBox}>{note.Title}</Text>
            </View>

            {/* Date */}
            <Text style={styles.smallTitle}>Date</Text>
            <View style={styles.insertBox}>
              {/* Load ngày tạo note lên <Text> */}
              <Text style={styles.textInInsertBox}>{currentDate}</Text>
            </View>
          </View>

          {/* Description, button Delete note*/}
          {/* Description */}
          <View style={{ flex: 60, backgroundColor: "white" }}>
            <Text style={styles.smallTitle}>Description</Text>
            <View style={styles.noteBox}>
              {/* load nội dung note lên text */}
              <Text style={styles.textInInsertBox}>{note.Description}</Text>
            </View>
          </View>

          {/* Delete note button */}
          <TouchableOpacity
            style={styles.button}
            onPress={deleteNote}>
            <Text style={styles.textInButton}>Delete this note</Text>
          </TouchableOpacity>
        </View>
      </Animated.ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
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

  headerBehave: {
    padding: 20,
    marginTop: 25,
  },

  row: {
    justifyContent: "space-between",
    flexDirection: "row",
  },

  image: {
    height: 225,
    width: 225,
    alignItems: "center",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 20,
  },

  title: {
    marginLeft: 20,
    marginRight: "auto",
    color: "#363942",
    fontSize: 27,
    fontWeight: "bold",
    marginTop: 45,
    shadowOpacity: 0.2,
    // fontStyle
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

  editButton: {
    marginLeft: "auto",
    marginRight: 30,
    color: "#4B7BE5",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 55,
    // fontStyle
  },

  textInButton: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    // fontFamily: "Poppins",
    marginBottom: "auto",
    marginTop: "auto",
    marginLeft: "auto",
    marginRight: "auto",
  },

  button: {
    // bordercolor: "white",
    backgroundColor: "#E7272D",
    marginTop: 15,
    height: 50,
    borderRadius: 10,
    shadowColor: "gray",
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    marginHorizontal: 15,
    marginBottom: 80,
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
    marginRight: 15,
  },

  textInNoteBox: {
    fontSize: 16,
    // fontFamily: "Poppins",
    marginBottom: "auto",
    marginTop: 5,
    marginLeft: 15,
    marginRight: 15,
    height: 340,
  },

  separator: {
    marginTop: 40,
    marginRight: 25,
    marginLeft: "auto",
  },

  container: {
    // alignItems: "center",
    // justifyContent: "center",
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "white",
    // padding: 8,
  },
});

export default NoteInforScreen;

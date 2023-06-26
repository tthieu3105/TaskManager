import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Animated,
} from "react-native";

import React, { Children, Component, useRef } from "react";
import { useState, useEffect } from "react";
import { Colors } from "react-native/Libraries/NewAppScreen";
import AntDesign from "../node_modules/@expo/vector-icons/AntDesign";
import UserAvatar from "@muhzi/react-native-user-avatar";
import { db } from "../components/FirestoreConfig";
import { collection, addDoc, doc, getDoc, runTransaction, setDoc, Timestamp } from "firebase/firestore";

const CONTAINER_HEIGHT = 80;

const AddNoteScreen = ({ navigation }) => {
  const [currentDate, setCurrentDate] = useState("");
  // Hiển thị ngày tháng năm hiện tại lên textView:
  useEffect(() => {
    // Lấy ngày tháng năm hiện tại và định dạng thành chuỗi
    const date = new Date();
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const formattedDate = date.toLocaleString("en-US", options);
    // Cập nhật state currentDate
    setCurrentDate(formattedDate);
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${hours}:${minutes} ${day}/${month}`;
  };

    const [noteTitle, setNoteTitle] = useState("");
    const [noteDescription, setNoteDescription] = useState("");
    const createNote = async () => {
      try {
        const docRef = doc(db, "Count", "Note");
        const docSnap = await getDoc(docRef);
        const data = docSnap.data();
        const sum = data.sum;
        const newNoteId = (sum + 1).toString();
        const noteData = {
          Title: noteTitle,
          Description: noteDescription,
          CreateAt: Timestamp.now(),
          NodeId: sum + 1,
          CreatorID: 1,
        };
        const count = {
          sum: sum + 1,
        }
        const notesCollection = collection(db, "Note");
        const noteRef = doc(notesCollection, newNoteId);
        await setDoc(noteRef, noteData);
        const countNode = doc(db,"Count", "Note");
        await setDoc(countNode, count);
      } catch (error) {
        console.error("Lỗi khi tạo note: ", error);
      }
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
          <TouchableOpacity>
            <AntDesign
              name="left"
              size={30}
              style={styles.headerBehave}
            ></AntDesign>
          </TouchableOpacity>

          {/* small avatar */}
          <View style={styles.headerBehave}>
            <UserAvatar
              size={40}
              active
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2900&q=80"
            />
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
            <TouchableOpacity style={styles.insertBox}>
              <TextInput
                style={styles.textInInsertBox}
                placeholder="Your title here"
                onChangeText={(title) => setNoteTitle(title)}
                placeholderTextColor={Colors.placeholder}
              />
            </TouchableOpacity>

            {/* Date */}
            <Text style={styles.smallTitle}>Date</Text>
            <TouchableOpacity style={styles.insertBox}>
              <Text style={styles.textInInsertBox}>{formatDate(currentDate)}</Text>
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
                placeholder="Your description here"
                onChangeText={(text) => setNoteDescription(text)}
                placeholderTextColor={Colors.placeholder}
              />
            </TouchableOpacity>
          </View>

          {/* Create note button */}
          <TouchableOpacity style={styles.button} onPress={createNote}>
            <Text style={styles.textInButton}>Create a new note</Text>
          </TouchableOpacity>
        </View>
      </Animated.ScrollView>
    </KeyboardAvoidingView>
  );
};

// const AddNoteScreen = () => {

// };

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

  smallTitle: {
    marginLeft: 15,
    marginRight: "auto",
    color: "#363942",
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    shadowOpacity: 0.3,
    shadowOffset: {
      width: 2,
      height: 2,
    },
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
    backgroundColor: "#4B7BE5",
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
});

export default AddNoteScreen;

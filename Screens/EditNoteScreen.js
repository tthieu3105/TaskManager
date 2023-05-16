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
const CONTAINER_HEIGHT = 80;

export default function EditNoteScreen({ navigation }) {
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
    const formattedDate = date.toLocaleDateString("en-US", options);

    // Cập nhật state currentDate
    setCurrentDate(formattedDate);
  }, []);

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
              <SimpleLineIcons name="arrow-left" size="20" color="black" />
            </TouchableOpacity>

            {/* Done  */}
            <TouchableOpacity
              style={styles.headerBehave}
              onPress={() => navigation.goBack()}
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
                  placeholder="Your title here"
                  placeholderTextColor={Colors.placeholder}
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
                  placeholder="Your description here"
                  placeholderTextColor={Colors.placeholder}
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
    height: 340,
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
    fontSize: 18,
  },
  container: {
    // alignItems: "center",
    // justifyContent: "center",
    flex: 1,
    backgroundColor: "white",
    // padding: 8,
  },
});

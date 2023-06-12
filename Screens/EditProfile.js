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

import React, { Component, useEffect, useRef } from "react";
import { Feather } from "@expo/vector-icons";
import AntDesign from "../node_modules/@expo/vector-icons/AntDesign";
import UserAvatar from "@muhzi/react-native-user-avatar";

const CONTAINER_HEIGHT = 80;

const EditProfile = ({ navigation }) => {
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
      style={{ backgroundColor: "white", flex: 100 }}
      enabled
      keyboardVerticalOffset={Platform.select({ ios: 0, android: 500 })}
    >
      <Animated.View
        style={[
          styles.header,
          { transform: [{ translateY: headerTranslate }] },
        ]}
      >
        {/* Layout button back và title */}
        <View style={styles.row}>
          {/* Button: back to previous screen */}
          <TouchableOpacity>
            <AntDesign
              name="left"
              size={30}
              style={styles.arrowIcon}
              onPress={() => navigation.goBack()}
            ></AntDesign>
          </TouchableOpacity>
          {/* Title */}
          <Text style={styles.title}>Edit your profile</Text>
        </View>
      </Animated.View>

      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
      >
        <View>
          {/* Layout avatar, button Change avatar */}
          <View
            style={{
              flex: 25,
              backgroundColor: "white",
            }}
          >
            <View>
              {/* Avatar */}
              <View style={styles.image}>
                <UserAvatar
                  size={80}
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2900&q=80"
                />

                {/* Button: Change avatar */}
                <TouchableOpacity style={styles.buttonChangeAvatar}>
                  <View style={styles.row}>
                    <Text style={styles.textInButton2}>Change</Text>
                    <Feather name="camera" size={22} style={styles.whiteIcon} />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* user information */}
        <View
          style={{
            flex: 75,
            backgroundColor: "white",
          }}
        >
          {/* Basic information */}
          <View>
            <Text style={styles.smallTitle}>Basic information</Text>
            {/* Name */}
            <View>
              <Text style={styles.infoTitle}> Name</Text>
              <View style={styles.insertBox}>
                <TouchableOpacity style={styles.frameToInsert}>
                  {/* Lấy dữ liệu tên user cho vào <text/> */}
                  <Text style={styles.textInInsertBox}></Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Gender */}
            <View>
              <Text style={styles.infoTitle}>Gender</Text>
              <View style={styles.insertBox}>
                <TouchableOpacity style={styles.frameToInsert}>
                  {/* Lấy dữ liệu giới tính user cho vào <text/> */}
                  <Text style={styles.textInInsertBox}></Text>
                  {/* Button: back to previous screen */}
                  <TouchableOpacity>
                    <AntDesign
                      name="down"
                      size={30}
                      style={styles.downIcon}
                    ></AntDesign>
                  </TouchableOpacity>
                </TouchableOpacity>
              </View>
            </View>

            {/* Job */}
            <View>
              <Text style={styles.infoTitle}>Job</Text>
              <View style={styles.insertBox}>
                <TouchableOpacity style={styles.frameToInsert}>
                  {/* Lấy dữ liệu tên user cho vào <text/> */}
                  <Text style={styles.textInInsertBox}></Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Contact information */}
          <View>
            <Text style={styles.smallTitle}>Contact information</Text>
            {/* Email */}
            <View>
              <Text style={styles.infoTitle}>Email</Text>
              <View style={styles.insertBox}>
                <TouchableOpacity style={styles.frameToInsert}>
                  {/* Lấy dữ liệu email user cho vào <text/> */}
                  <Text style={styles.textInInsertBox}></Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Phone */}
            <View>
              <Text style={styles.infoTitle}>Phone number</Text>
              <View style={styles.insertBox}>
                <TouchableOpacity style={styles.frameToInsert}>
                  {/* Lấy dữ liệu sđt user cho vào <text/> */}
                  <Text style={styles.textInInsertBox}></Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Location & Language */}
          <View>
            <Text style={styles.smallTitle}>Location & Language</Text>
            {/* Location */}
            <View>
              <Text style={styles.infoTitle}>Location</Text>
              <View style={styles.insertBox}>
                <TouchableOpacity style={styles.frameToInsert}>
                  {/* Lấy dữ liệu Location user cho vào <text/> */}
                  <Text style={styles.textInInsertBox}></Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Language */}
            <View>
              <Text style={styles.infoTitle}>Language</Text>
              <View style={styles.insertBox}>
                <TouchableOpacity style={styles.frameToInsert}>
                  {/* Lấy dữ liệu giới tính user cho vào <text/> */}
                  <Text style={styles.textInInsertBox}></Text>
                  {/* Button: back to previous screen */}
                  <TouchableOpacity>
                    <AntDesign
                      name="down"
                      size={30}
                      style={styles.downIcon}
                    ></AntDesign>
                  </TouchableOpacity>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Button save / discard */}
          <View style={styles.row}>
            {/* Discard */}
            <TouchableOpacity style={styles.buttonDiscard}>
              <Text style={styles.textInButton1}>Discard</Text>
            </TouchableOpacity>

            {/* Save */}
            <TouchableOpacity style={styles.buttonSave}>
              <Text style={styles.textInButton}>Save</Text>
            </TouchableOpacity>
          </View>
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

  blackIcon: {
    marginHorizontal: 10,
    marginVertical: 8,
    color: "black",
  },

  whiteIcon: {
    alignItems: "center",
    marginTop: 8,
    marginLeft: "auto",
    marginRight: 15,
    color: "white",
  },

  arrowIcon: {
    marginTop: 45,
    marginLeft: 10,
  },

  downIcon: {
    marginTop: 4,
    marginBottom: 6,
    marginRight: 15,
    marginLeft: "auto",
  },

  row: {
    flexDirection: "row",
  },

  image: {
    alignItems: "center",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 95,
  },

  title: {
    marginLeft: 50,
    marginRight: "auto",
    color: "#363942",
    fontSize: 27,
    fontWeight: "bold",
    marginTop: 45,
    // fontStyle
  },

  smallTitle: {
    marginTop: 25,
    marginLeft: 15,
    marginRight: "auto",
    marginBottom: 5,
    color: "#363942",
    fontSize: 18,
    fontWeight: "bold",
    shadowColor: "gray",
    shadowOpacity: 0.3,
    shadowOffset: {
      width: 2,
      height: 2,
    },
  },

  infoTitle: {
    marginLeft: 15,
    marginRight: "auto",
    marginTop: 5,
    marginBottom: 0,
    color: "#363942",
    fontSize: 14,
    shadowOpacity: 0.3,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    // shadowOpacity: 0.2,
    // fontStyle
  },

  normalTextOnBackGround: {
    marginLeft: "auto",
    marginRight: 30,
    color: "black",
    fontSize: 13,
    textDecorationLine: "underline",
  },

  textInButton: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    // fontFamily: "Poppins",
    marginBottom: "auto",
    marginTop: "auto",
    marginLeft: 55,
    marginRight: 55,
  },

  textInButton1: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
    // fontFamily: "Poppins",
    marginBottom: "auto",
    marginTop: "auto",
    marginLeft: 45,
    marginRight: 45,
  },

  textInButton2: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
    // fontFamily: "Poppins",
    marginBottom: "auto",
    marginTop: 10,
    marginLeft: 15,
    marginRight: 10,
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
    marginBottom: 30,
  },

  buttonSave: {
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
    marginLeft: 15,
    marginRight: "auto",
    marginBottom: 50,
  },

  buttonDiscard: {
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
    marginLeft: "auto",
    marginRight: 15,
    marginBottom: 50,
  },

  buttonChangeAvatar: {
    backgroundColor: "#4B7BE5",
    marginTop: 10,
    height: 40,
    borderRadius: 10,
    shadowColor: "gray",
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    marginHorizontal: 0,
    marginBottom: 10,
  },

  insertBox: {
    backgroundColor: "#F5F5F5",
    // marginVertical: 10,
    marginTop: 5,
    marginBottom: 5,
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

  frameToInsert: {
    marginTop: 0,
    marginBottom: 0,
    height: 45,
    borderRadius: 10,
    marginHorizontal: 0,
  },

  textInInsertBox: {
    fontSize: 16,
    // fontFamily: "Poppins",
    marginBottom: "auto",
    marginTop: "auto",
    marginLeft: 15,
    marginRight: "auto",
  },
});

export default EditProfile;

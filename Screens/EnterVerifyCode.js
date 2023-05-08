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

import React, { Component, useEffect, useRef, useState } from "react";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { ScrollView } from "react-native-gesture-handler";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import EvilIcon from "@expo/vector-icons/EvilIcons";
import AntDesign from "@expo/vector-icons/AntDesign";

const CONTAINER_HEIGHT = 80;

const EnterVerifyCode = ({ navigation }) => {
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

  //DIGIT CODE
  const pin1Ref = useRef(null);
  const pin2Ref = useRef(null);
  const pin3Ref = useRef(null);
  const pin4Ref = useRef(null);

  const [pin1, setPin1] = useState("");
  const [pin2, setPin2] = useState("");
  const [pin3, setPin3] = useState("");
  const [pin4, setPin4] = useState("");

  return (
    <Animated.View
      style={{
        backgroundColor: "white",
        flex: 1,
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        enabled
        keyboardVerticalOffset={Platform.select({ ios: 0, android: 500 })}
      >
        <Animated.ScrollView>
          <View
            style={{
              backgroundColor: "white",
              flex: 1,
            }}
          >
            {/* Layout title, back button, picture */}
            <View style={{ flex: 50, backgroundColor: "white" }}>
              <View style={styles.row}>
                {/* Button: back to previous screen */}
                <TouchableOpacity>
                  <AntDesign
                    name="left"
                    size={30}
                    style={styles.arrowIcon}
                  ></AntDesign>
                </TouchableOpacity>
                {/* Title */}
                <Text style={styles.title}>Verify your email</Text>
              </View>
              {/* Picture */}
              <Image
                style={styles.image}
                source={require("../Pic/EnterCode.png")}
              ></Image>
            </View>

            {/* Layout enter code, direction, button: next */}
            <View style={{ flex: 50, backgroundColor: "white" }}>
              {/* 4 box to enter code */}
              <View style={styles.row}>
                <View style={styles.codeBox1}>
                  <TextInput
                    ref={pin1Ref}
                    keyboardType={"number-pad"}
                    maxLength={1}
                    style={styles.textInCodeBox}
                    placeholder="0"
                    onChange={(pin1) => {
                      setPin1(pin1);
                      if (pin1 != "") {
                        pin2Ref.current.focus();
                      }
                    }}
                  ></TextInput>
                </View>
                <View style={styles.codeBox}>
                  <TextInput
                    ref={pin2Ref}
                    keyboardType={"number-pad"}
                    maxLength={1}
                    style={styles.textInCodeBox}
                    placeholder="0"
                    onChange={(pin2) => {
                      setPin2(pin2);
                      if (pin2 != "") {
                        pin3Ref.current.focus();
                      }
                    }}
                  ></TextInput>
                </View>
                <View style={styles.codeBox}>
                  <TextInput
                    ref={pin3Ref}
                    keyboardType={"number-pad"}
                    maxLength={1}
                    style={styles.textInCodeBox}
                    placeholder="0"
                    onChange={(pin3) => {
                      setPin3(pin3);
                      if (pin3 != "") {
                        pin4Ref.current.focus();
                      }
                    }}
                  ></TextInput>
                </View>
                <View style={styles.codeBox2}>
                  <TextInput
                    ref={pin4Ref}
                    keyboardType={"number-pad"}
                    maxLength={1}
                    style={styles.textInCodeBox}
                    placeholder="0"
                    onChange={(pin4) => {
                      setPin4(pin4);
                    }}
                  ></TextInput>
                </View>
              </View>
              {/* Direction */}
              <View>
                <Text style={styles.direction}>
                  Please enter the 4 digit code
                </Text>
                <Text style={styles.ContinueDirection}>sent to your email</Text>
              </View>
              {/* button */}
              <TouchableOpacity style={styles.button}>
                <Text style={styles.textInButton}>Verify</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.ScrollView>
      </KeyboardAvoidingView>
    </Animated.View>
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

  arrowIcon: {
    marginTop: 45,
    marginLeft: 10,
  },

  row: {
    flexDirection: "row",
  },

  image: {
    height: 340,
    width: 200,
    alignItems: "center",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 35,
  },

  title: {
    marginLeft: 40,
    marginRight: "auto",
    color: "#363942",
    fontSize: 27,
    fontWeight: "bold",
    marginTop: 45,
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
    marginBottom: 30,
  },

  textInInsertBox: {
    fontSize: 16,
    // fontFamily: "Poppins",
    marginBottom: "auto",
    marginTop: "auto",
    marginLeft: 15,
    marginRight: "auto",
  },

  codeBox1: {
    backgroundColor: "#F5F5F5",
    // marginVertical: 10,
    marginTop: 40,
    marginBottom: 5,
    marginLeft: 50,
    height: 45,
    width: 40,
    borderRadius: 10,
    shadowColor: "gray",
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 2,
      height: 2,
    },
  },

  codeBox2: {
    backgroundColor: "#F5F5F5",
    // marginVertical: 10,
    marginTop: 40,
    marginBottom: 5,
    marginLeft: 40,
    marginRight: 50,
    height: 45,
    width: 40,
    borderRadius: 10,
    shadowColor: "gray",
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 2,
      height: 2,
    },
  },

  codeBox: {
    backgroundColor: "#F5F5F5",
    // marginVertical: 10,
    marginTop: 40,
    marginBottom: 5,
    height: 45,
    width: 40,
    borderRadius: 10,
    shadowColor: "gray",
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    marginLeft: 40,
  },

  textInCodeBox: {
    fontSize: 16,
    width: 40,
    height: 45,
    // fontFamily: "Poppins",
    marginBottom: "auto",
    marginTop: "auto",
    marginLeft: 15,
    marginRight: 15,
    paddingTop: 0,
  },

  direction: {
    fontSize: 16,
    marginLeft: "auto",
    marginRight: "auto",
    fontWeight: "bold",
    marginTop: 25,
    shadowOpacity: 0.3,
    shadowOffset: {
      width: 2,
      height: 2,
    },
  },
  ContinueDirection: {
    fontSize: 16,
    marginLeft: "auto",
    marginRight: "auto",
    fontWeight: "bold",
    marginTop: 0,
    marginBottom: 20,
    shadowOpacity: 0.3,
    shadowOffset: {
      width: 2,
      height: 2,
    },
  },
});

export default EnterVerifyCode;

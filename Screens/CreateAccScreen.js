import {
  View,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Animated,
  Platform,
} from "react-native";

import React, { Component, useEffect, useRef } from "react";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { ScrollView } from "react-native-gesture-handler";
import AntDesign from "../node_modules/@expo/vector-icons/AntDesign";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

import { db } from "../components/FirestoreConfig";
import {
  collection,
  getDocs,
  query,
  where,
  or,
  and,
  getDoc,
  setDoc,
  doc
} from "firebase/firestore";
import { UserContext, UserProvider } from "../contextObject";
import PopupModal from "./../components/PopUpNotify";


const CONTAINER_HEIGHT = 80;

const CreateAccScreen = ({ navigation }) => {
  //Popup
  const [modalVisible, setModalVisible] = useState(false);
  const [popupType, setPopupType] = useState("");
  const [popupTitle, setPopupTitle] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const openModal = (type, title, message) => {
    setPopupType(type);
    setPopupTitle(title);
    setPopupMessage(message);
    setModalVisible(true);
  };
  const closeModal = () => {
    setModalVisible(false);
    // navigation.navigate("HomeScreen");
  };

  // Lấy Password & email
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [hidePassword, setHidePassword] = useState(true);
  const [hidePassword2, setHidePassword2] = useState(true);
  const [showPasswordIcon, setShowPasswordIcon] = useState("eye-outline");
  const [showPasswordIcon2, setShowPasswordIcon2] = useState("eye-outline");

  const [email, setEmail] = useState("");
  const [userNameLogin, setUserNameLogin] = useState("");
  // Thông tin người dùng
  const [fullName, setFullName] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [career, setCareer] = useState("");
  // Button hiển thị password
  const toggleHidePassword = () => {
    setHidePassword(!hidePassword);
    setShowPasswordIcon(hidePassword ? "eye-off-outline" : "eye-outline");
  };
  const toggleHidePassword2 = () => {
    setHidePassword2(!hidePassword2);
    setShowPasswordIcon2(hidePassword2 ? "eye-off-outline" : "eye-outline");
  };

  //Check blank
  const checkEnterInfo = () => {
    if (
      fullName === "" ||
      phoneNum === "" ||
      career === "" ||
      email === "" ||
      userNameLogin === "" ||
      password === "" ||
      password2 === ""
    ) {
      openModal("error", "Please enter all information!!!")
      return false;
    }else{
      checkConfirm(password, password2);
      return true;
    }
  };

  //confirm password
  const checkConfirm = (a1,a2) => {
    if (a1 != a2) {
      openModal("error", "Your passwords don't matched!", "Try again!!!");
      return false;
    } else {
      openModal("success", "Your passwords are matched!", "You're ready to login");
      return true;
    }
  };

  // Create new account
  const createNewAcc = async (fullName, email, userNameLogin, password, phoneNum, career) => {
    if (checkEnterInfo() === true) {
      try {
        // Find the biggest UserID
        const userIDSnapShot = await getDocs(collection(db, "User"));
        const existingUsers = userIDSnapShot.docs.map((doc) => doc.data());
        const maxUserID = Math.max(
          ...existingUsers.map((user) => parseInt(user.UserID))
        );
        console.log("maxUserID", maxUserID);

        // New document in Firestore with new userID
        const newUserID = maxUserID + 1;
        const docRef = doc(collection(db, "User"), newUserID.toString());

        console.log("User created, userID: ", docRef.id);

        // Create new user information on Firebase
        await setDoc(docRef, {
          UserID: newUserID,
          Avatar:"",
          Location: "",
          Name: fullName,
          Email: email,
          UserName: userNameLogin,
          Password: password,
          Phone: phoneNum,
          Job: career,
        });
      } catch (error) {
        console.log("Error: ", error);
      }
      navigation.navigate("Login")
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
        {/* Layout button back và title */}
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
          <Text style={styles.title}>Create your account</Text>
        </View>
      </Animated.View>

      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
      >
        <View
          style={{
            backgroundColor: "white",
            flex: 1,
          }}
        >
          {/* hình ảnh */}
          <View style={{ flex: 40, backgroundColor: "white" }}>
            {/* Picture */}
            <Image
              style={styles.image}
              source={require("../Pic/WelcomeCreate.png")}
            ></Image>
          </View>

          {/* Layout điền tên */}
          <View style={{ flex: 60, backgroundColor: "white" }}>
            <Text style={styles.smallTitle}>Your information</Text>

            {/* Nhập full name */}
            <View style={styles.insertBox}>
              <TextInput
                style={styles.textInInsertBox}
                placeholder="Full name"
                multiline
                placeholderTextColor={Colors.placeholder}
                value={fullName}
                onChangeText={(text) => setFullName(text)}
              ></TextInput>
            </View>

            {/* Nhập số điện thoại */}
            <View style={styles.insertBox}>
              <TextInput
                style={styles.textInInsertBox}
                placeholder="Phone number"
                multiline
                placeholderTextColor={Colors.placeholder}
                value={phoneNum}
                onChangeText={(text) => setPhoneNum(text)}
              ></TextInput>
            </View>

            {/* Nhập nghề nghiệp */}
            <View style={styles.insertBox}>
              <TextInput
                style={styles.textInInsertBox}
                placeholder="Career"
                multiline
                placeholderTextColor={Colors.placeholder}
                value={career}
                onChangeText={(text) => setCareer(text)}
              ></TextInput>
            </View>

            {/* Layout thông tin account và button Next */}
            <View>
              <Text style={styles.smallTitle}>Account</Text>

              {/* Nhập email */}
              <View style={styles.insertBox}>
                <TextInput
                  style={styles.textInInsertBox}
                  placeholder="Email"
                  multiline
                  value={email}
                  onChangeText={(text) => setEmail(text)}
                  placeholderTextColor={Colors.placeholder}
                ></TextInput>
              </View>

              {/* Nhập username */}
              <View style={styles.insertBox}>
                <TextInput
                  style={styles.textInInsertBox}
                  placeholder="Username"
                  multiline
                  value={userNameLogin}
                  onChangeText={(text) => setUserNameLogin(text)}
                  placeholderTextColor={Colors.placeholder}
                ></TextInput>
              </View>

              {/* Nhập Password */}
              <View style={styles.insertBox}>
                <View style={styles.rowSection}>
                  <TextInput
                    style={styles.textInInsertBox}
                    placeholder="Password"
                    // multiline
                    placeholderTextColor={Colors.placeholder}
                    autoCapitalize="none"
                    secureTextEntry={hidePassword}
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                  />

                  {/* Button hiển thị password */}
                  <TouchableOpacity onPress={toggleHidePassword}>
                    <Ionicons
                      name={showPasswordIcon}
                      size={24}
                      style={{ marginLeft: "auto", marginRight: 15 }}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Nhập lại password (check xem có giống với phía trên) */}
              <View style={styles.insertBox}>
                <View style={styles.rowSection}>
                  <TextInput
                    style={styles.textInInsertBox}
                    placeholder="Confirm your password"
                    // multiline
                    placeholderTextColor={Colors.placeholder}
                    autoCapitalize="none"
                    secureTextEntry={hidePassword2}
                    value={password2}
                    onChangeText={(text) => setPassword2(text)}
                  ></TextInput>

                  {/* Button hiển thị password */}
                  <TouchableOpacity onPress={toggleHidePassword2}>
                    <Ionicons name={showPasswordIcon2} size={24} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Button: next */}
              <TouchableOpacity
                style={styles.button}
                onPress={() => createNewAcc(fullName,email,userNameLogin,password2,phoneNum,career)}
              >
                <Text style={styles.textInButton}>Create account</Text>
              </TouchableOpacity>
            </View>
          </View>
          <PopupModal
            visible={modalVisible}
            type={popupType}
            title={popupTitle}
            message={popupMessage}
            onClose={closeModal}
          />
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

  arrowIcon: {
    marginTop: 45,
    marginLeft: 10,
  },

  row: {
    flexDirection: "row",
  },

  image: {
    height: 225,
    width: 225,
    alignItems: "center",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 95,
  },

  title: {
    marginLeft: 20,
    marginRight: "auto",
    color: "#363942",
    fontSize: 27,
    fontWeight: "bold",
    marginTop: 45,
    // fontStyle
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
    marginBottom: 30,
  },

  buttonCreateAccount: {
    backgroundColor: "#81A3ED",
    marginVertical: 15,
    height: 50,
    borderRadius: 10,
    shadowColor: "gray",
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    marginHorizontal: 30,
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

  insertBox1: {
    backgroundColor: "#F5F5F5",
    marginVertical: 3,
    height: 50,
    borderRadius: 10,
    shadowColor: "gray",
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    marginHorizontal: 30,
    marginTop: 15,
  },

  textInInsertBox: {
    fontSize: 16,
    paddingTop: 0,
    width: "90%",
    // fontFamily: "Poppins",
    marginBottom: "auto",
    marginTop: "auto",
    marginLeft: 15,
    marginRight: 15,
  },

  rowSection: {
    flexDirection: "row",

    marginBottom: "auto",
    marginTop: "auto",
    marginRight: 40,
  },
});

export default CreateAccScreen;

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
import { Colors } from "react-native/Libraries/NewAppScreen";
import { Ionicons } from "@expo/vector-icons";
import {useContext, useState } from "react";
import { StatusBar } from "expo-status-bar";
import CreateAccScreen from "./CreateAccScreen";
import { useNavigation } from "react-router-native";
import { ToastAndroid } from "react-native";

import { db } from "../components/FirestoreConfig";
import {
  collection,
  getDocs,
  query,
  where,
  or,
  and,
} from "firebase/firestore";
import { UserContext, UserProvider } from "../contextObject";

const CONTAINER_HEIGHT = 80;

const LoginScreen = ({ navigation }) => {
  const [userName, setUserName] = useState("");

  // Lấy Password
  const [password, setPassword] = useState("");
  const [hidePassword, setHidePassword] = useState(true);
  const [showPasswordIcon, setShowPasswordIcon] = useState("eye-outline");

  // Button hiển thị password
  const toggleHidePassword = () => {
    setHidePassword(!hidePassword);
    setShowPasswordIcon(hidePassword ? "eye-off-outline" : "eye-outline");
  };

  const { setUserId } = useContext(UserContext);
  const LoginFunction = async (userName, password) => {
    if (userName === "") {
      ToastAndroid.show(
        "UserName or Email cannot be empty",
        ToastAndroid.SHORT
      );
      return false;
    }
    if (password === "") {
      ToastAndroid.show("Password cannot be empty", ToastAndroid.SHORT);
      return false;
    }

    let userID = 0;
    const q = query(
      collection(db, "User"), and(or(where("UserName", "==", userName), where("Email", "==", userName)), where("Password", "==", password))
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.size>0) {
      for(const user of querySnapshot.docs) {
        userID = user.data().UserID;
      }
      console.log("user id: ", userID);

      setUserId(userID);

      ToastAndroid.show("Login Successfully!", ToastAndroid.SHORT);
      navigation.navigate("HomeNavigator", { userID: userID });
    } else {
      ToastAndroid.show("Invalid UserName or Password!", ToastAndroid.SHORT);
    }

    // Lấy reference đến node 'User' trong Firebase Realtime Database
    // const usersRef = ref(db, "User");

    // const userList = [];

    // Lấy toàn bộ dữ liệu User và lưu vào list user
    // get(usersRef).then((snapshot) => {
    //   if (snapshot.exists()) {
    //     const data = snapshot.val();
    //     Object.keys(data).forEach((key) => {
    //       const user = data[key];
    //       userList.push({ username: user.UserName, email: user.Email, password: user.Password });
    //     });
    //     console.log("Users found:", userList);
    //     const foundUser = userList.find(
    //       (user) => (user.username === userName || user.email === userName)  && user.password === password
    //     );
    //     if (foundUser) {
    //       ToastAndroid.show("Login Successfully!", ToastAndroid.SHORT);

    //       navigation.navigate("HomeNavigator");

    //     } else {
    //       ToastAndroid.show("Invalid UserName or Password!", ToastAndroid.SHORT);
    //     }
    //   } else {
    //     console.log("No users found");
    //   }
    // });



    // const usersRef = db.collection("User");
    // const snapshot = await usersRef.get();
    // snapshot.forEach((doc) => {
    //   console.log(doc.id, "=>", doc.data());
    // });

    // if (userName === "") {
    //   ToastAndroid.show(
    //     "UserName or Email cannot be empty",
    //     ToastAndroid.SHORT
    //   );
    //   return false;
    // }
    // if (password === "") {
    //   ToastAndroid.show("Password cannot be empty", ToastAndroid.SHORT);
    //   return false;
    // }

    // const foundUser = doc.find(
    //   (user) =>
    //     (user.username === userName || user.email === userName) &&
    //     user.password === password
    // );
    // if (foundUser) {
    //   ToastAndroid.show("Login Successfully!", ToastAndroid.SHORT);

    //   navigation.navigate("HomeNavigator");
    // } else {
    //   ToastAndroid.show("Invalid UserName or Password!", ToastAndroid.SHORT);
    // }
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
      <StatusBar barStyle="dark-content" />
      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
      >
        <View
          style={{
            flex: 100,
            backgroundColor: "white",
          }}
        >
          <View style={{ flex: 50, backgroundColor: "white" }}>
            <Image
              style={styles.image}
              source={require("../Pic/welcomePic.png")}
            ></Image>
            <Text style={styles.title}> MANAGE YOUR TIME </Text>
          </View>

          <View style={{ flex: 20, backgroundColor: "white" }}>
            <View style={styles.insertBox1}>
              <TextInput
                style={styles.textInInsertBox}
                placeholder="Username or Email"
                multiline
                placeholderTextColor={Colors.placeholder}
                value={userName}
                onChangeText={(text) => setUserName(text)}
              ></TextInput>
            </View>

            {/* Ô nhập password */}
            <View style={styles.insertBox1}>
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
                  <Ionicons name={showPasswordIcon} size={24} />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity>
              <Text style={styles.underlineTextOnBackGround}>
                Forgot your password?
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ backgroundColor: "white" }}>
            {/* <TouchableOpacity style={styles.buttonLogin} onPress={() => navigation.navigate("Home")}> */}
            <TouchableOpacity
              style={styles.buttonLogin}
              onPress={() => LoginFunction(userName, password) }
            >
              <Text style={styles.textInButton}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buttonCreateAccount}
              onPress={() => navigation.navigate("CreateAccount")}
            >
              <Text style={styles.textInButton}>Create account</Text>
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

  image: {
    height: 225,
    width: 225,
    alignItems: "center",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 110,
  },

  title: {
    marginLeft: "auto",
    marginRight: "auto",
    color: "#363942",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 20,
    // fontStyle
  },

  underlineTextOnBackGround: {
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
    marginLeft: "auto",
    marginRight: "auto",
  },

  buttonLogin: {
    // bordercolor: "white",
    backgroundColor: "#4B7BE5",
    marginTop: 20,
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
    marginBottom: 150,
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

export default LoginScreen;

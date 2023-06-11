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
import { useContext, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AntDesign from "../node_modules/@expo/vector-icons/AntDesign";
import UserAvatar from "@muhzi/react-native-user-avatar";

import { db } from "../components/FirestoreConfig";
import { collection, getDocs, query, where, or, and } from "firebase/firestore";
import { UserContext, UserProvider } from "../contextObject";

const CONTAINER_HEIGHT = 80;

const AccountFeature = ({ navigation }) => {
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

  const { userId } = useContext(UserContext);
  
  const [Uname, setUname] = useState('');
  const [Career, setCareer] = useState('');
  const [ULocation, setULocation] = useState('');
  const [UPhone, setUPhone] = useState('');
  

  const UserInfo = async (userID) => {
    const q = query(collection(db, "User"), where("UserID", "==", userId));

    const querySnapshot = await getDocs(q);

    if (querySnapshot.size > 0) {
      for (const user of querySnapshot.docs) {
        setUname(user.data().Name);
        setCareer(user.data().Job);
        setULocation(user.data().Location);
        setUPhone(user.data().Phone);
      }
      console.log("User id: ", userId);
      console.log(
        "User data: ",
        Uname,
        " ",
        Career,
        " ",
        ULocation,
        " ",
        UPhone
      );
      navigation.navigate("AccountFeature");
    } else {
      console.log("Can't read user's data");
    }
  };

  // const {userID} = useContext(UserContext);
  // const UserInfo = async (userID) => {

  //   const q = query(
  //     collection(db, "User"), where("UserID","==",userID)
  //   );

  //   const querySnapshot = await getDocs(q);

  //   if(querySnapshot.size>0){
  //     for(const user of querySnapshot.docs){
  //       Uname = user.data().Name;
  //       Career = user.data().Job;
  //       ULocation = user.data().Location;
  //       UPhone = user.data().Phone;
  //     }
  //     console.log("User data: ", Uname, " ", Career, " ", ULocation, " ", UPhone);

  //   }else{
  //     console.log("Can't read user's data");
  //   }
  // };

  return (
    UserInfo(userId),
    (
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
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <AntDesign
                name="left"
                size={30}
                style={styles.arrowIcon}
              ></AntDesign>
            </TouchableOpacity>
            {/* Title */}
            <Text style={styles.title}>Profile</Text>
          </View>
        </Animated.View>

        <Animated.ScrollView
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
        >
          <View>
            {/* Layout avatar, name, number of project done/pending */}
            <View
              style={{
                flex: 35,
                backgroundColor: "white",
              }}
            >
              {/* Avatar */}
              <View style={styles.row}>
                <View style={styles.image}>
                  <UserAvatar
                    size={80}
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2900&q=80"
                  />
                </View>
                {/* Project done */}
                <Text></Text>
                {/* Project pending */}
                <Text></Text>
              </View>

              <View>
                {/* Name */}
                <Text style={styles.userName}>{Uname}</Text>

                {/* Career */}
                <Text style={styles.userCareer}>{Career}</Text>

                {/* Button: Edit profile */}
                <TouchableOpacity
                  style={styles.buttonEditProfile}
                  onPress={() => navigation.navigate("EditProfile")}
                >
                  <Text style={styles.textInButton1}>Edit profile</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* User infomation, Logout button */}
            <View
              style={{
                flex: 65,
                backgroundColor: "white",
              }}
            >
              {/* Location Box */}
              <View style={styles.infoBox}>
                <View style={styles.row}>
                  <View style={styles.smallBoxForIcon}>
                    <Ionicons
                      style={styles.locationIcon}
                      name="location-outline"
                      size={22}
                    />
                  </View>
                  <View style={styles.textFrame}>
                    <Text style={styles.informationTitle}>Location</Text>
                    {/* Location here */}
                    <Text style={styles.information}>
                      {ULocation}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Email Box */}
              <View style={styles.infoBox}>
                <View style={styles.row}>
                  <View style={styles.smallBoxForIcon}>
                    <MaterialCommunityIcons
                      name="email-outline"
                      size={22}
                      style={styles.emailIcon}
                    />
                  </View>
                  <View style={styles.textFrame}>
                    <Text style={styles.informationTitle}>Email</Text>
                    {/* Email here */}
                    <Text style={styles.information}>
                      anonymous321@gmail.com
                    </Text>
                  </View>
                </View>
              </View>

              {/* Phone Box */}
              <View style={styles.infoBox}>
                <View style={styles.row}>
                  <View style={styles.smallBoxForIcon}>
                    <AntDesign
                      name="phone"
                      size={22}
                      style={styles.phoneIcon}
                    />
                  </View>
                  <View style={styles.textFrame}>
                    <Text style={styles.informationTitle}>Phone</Text>
                    {/* Phone here */}
                    <Text style={styles.information}>+84 946102837</Text>
                  </View>
                </View>
              </View>

              {/* Setting Button */}
              <TouchableOpacity style={styles.infoBox}>
                <View style={styles.row}>
                  <View style={styles.smallBoxForIcon}>
                    <AntDesign
                      name="setting"
                      size={22}
                      style={styles.blackIcon}
                    />
                  </View>
                  <View style={styles.textFrame}>
                    <Text style={styles.informationTitle}>Setting</Text>
                    <Text style={styles.information}>
                      Dark mode, notification, privacy,...
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

              {/* Account setting button */}
              <TouchableOpacity style={styles.infoBox}>
                <View style={styles.row}>
                  <View style={styles.smallBoxForIcon}>
                    <MaterialCommunityIcons
                      name="account-outline"
                      size={22}
                      style={styles.blackIcon}
                    />
                  </View>
                  <View style={styles.textFrame}>
                    <Text style={styles.informationTitle}>Account</Text>
                    <Text style={styles.information}>
                      Verify, change password
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

              {/* Logout button */}
              <TouchableOpacity
                style={styles.buttonWarn}
                onPress={() => navigation.navigate("Login")}
              >
                <View style={styles.row}>
                  <SimpleLineIcons
                    name="logout"
                    size={24}
                    style={styles.whiteIcon}
                  ></SimpleLineIcons>
                  <Text style={styles.text}>Log out</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.ScrollView>
      </KeyboardAvoidingView>
    )
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
    marginTop: 18,
    marginLeft: "auto",
    marginRight: 5,
    color: "white",
  },

  locationIcon: {
    marginHorizontal: 10,
    marginVertical: 8,
    color: "#FBCB0A",
  },

  emailIcon: {
    marginHorizontal: 10,
    marginVertical: 8,
    color: "#F73D93",
  },

  phoneIcon: {
    marginHorizontal: 10,
    marginVertical: 8,
    color: "#EE5007",
  },

  arrowIcon: {
    marginTop: 45,
    marginLeft: 10,
  },

  row: {
    flexDirection: "row",
  },

  image: {
    height: 80,
    width: 80,
    alignItems: "center",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 100,
  },

  title: {
    marginLeft: 105,
    marginRight: "auto",
    color: "#363942",
    fontSize: 27,
    fontWeight: "bold",
    marginTop: 45,
    shadowColor: "gray",
    // fontStyle
  },

  userName: {
    marginLeft: "auto",
    marginRight: "auto",
    color: "#363942",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 15,
    shadowOpacity: 0.3,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    // fontStyle
  },

  userCareer: {
    marginLeft: "auto",
    marginRight: "auto",
    color: "#363942",
    fontSize: 14,
    // fontWeight: "bold",
    marginTop: 3,
    shadowOpacity: 0.3,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    // fontStyle
  },

  informationTitle: {
    marginLeft: 1,
    marginRight: "auto",
    color: "#363942",
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 1,
  },

  information: {
    marginLeft: 1,
    marginRight: "auto",
    color: "#363942",
    fontSize: 12,
    marginTop: 5,
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

  text: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    // fontFamily: "Poppins",
    marginBottom: "auto",
    marginTop: 20,
    marginLeft: 5,
    marginRight: "auto",
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

  textInButton1: {
    fontSize: 14,
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

  buttonWarn: {
    // bordercolor: "white",
    backgroundColor: "#E7272D",
    marginTop: 10,
    height: 60,
    borderRadius: 10,
    shadowColor: "gray",
    shadowColor: "gray",
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    marginHorizontal: 15,
    marginBottom: 30,
  },

  buttonEditProfile: {
    backgroundColor: "#4B7BE5",
    marginTop: 20,
    height: 40,
    borderRadius: 10,
    shadowColor: "gray",
    shadowColor: "gray",
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    marginHorizontal: 130,
    marginBottom: 30,
  },

  smallBoxForIcon: {
    backgroundColor: "white",
    marginVertical: 12,
    marginLeft: 15,
    marginRight: 15,
    borderRadius: 10,
    height: 40,
    weight: 40,
    shadowColor: "gray",
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 2,
      height: 2,
    },
  },

  infoBox: {
    backgroundColor: "#F5F5F5",
    // marginVertical: 10,
    marginTop: 5,
    marginBottom: 10,
    height: 65,
    borderRadius: 10,
    shadowColor: "gray",
    shadowColor: "gray",
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    marginHorizontal: 15,
  },

  textFrame: {
    backgroundColor: "#F5F5F5",
    marginVertical: 12,
    height: 40,
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
    marginHorizontal: 15,
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

export default AccountFeature;

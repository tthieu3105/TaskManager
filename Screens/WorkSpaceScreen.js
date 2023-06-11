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
import { Entypo } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import AntDesign from "../node_modules/@expo/vector-icons/AntDesign";
import UserAvatar from "@muhzi/react-native-user-avatar";
import TabContainer from "../components/TabContainer";
import { db } from "../components/FirestoreConfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

const CONTAINER_HEIGHT = 80;

const WorkSpaceScreen = ({ navigation }) => {
  const [currentDate, setCurrentDate] = useState("");
  // Hiển thị ngày tháng năm hiện tại lên textView:
  useEffect(() => {
    // Lấy ngày tháng năm hiện tại và định dạng thành chuỗi
    const date = new Date();
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    const formattedDate = date.toLocaleDateString("en-US", options);
    // Cập nhật state currentDate
    setCurrentDate(formattedDate);
  }, []);

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

  //Hello
  const [userName, setUserName] = useState("");
  const userID = 1;
  const getName = async () => {
    const docRef = doc(db, "User", userID.toString());
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const fullName = docSnap.data().Name;
      const nameArray = fullName.split(" ");
      const lastName = nameArray[nameArray.length - 1];
      setUserName(lastName);
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
      setUserName("John");
    }
  };

  //project
  const [count, setCount] = useState("");
  const [projectList, setProjectList] = useState([]);

  const getProject = async () => {
    const q = query(collection(db, "Project"), where("CreatorID", "==", userID));
    const querySnapshot = await getDocs(q);

    const sl = querySnapshot.size;
    setCount(sl);

    const proList = [];
    for (const pro of querySnapshot.docs) {
      const proID = pro.data().ProjectID;

      const q1 = query(
        collection(db, "Project_Task"),
        where("ProjectID", "==", proID)
      );

      const querySnapshot1 = await getDocs(q1);
      const numberOfTask = querySnapshot1.size;

      const userList = [];
      const docRef = doc(db, "User", pro.data().CreatorID.toString());
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        userList.push({
          UserID: docSnap.data().UserID,
          Name: docSnap.data().Name,
          Avatar: docSnap.data().Avatar,
        });
      }
      const q3 = query(
        collection(db, "Project_User"),
        where("ProjectID", "==", proID)
      );

      const querySnapshot3 = await getDocs(q3);

      if (querySnapshot3.size > 0) {
        for (const pro_user of querySnapshot3.docs) {
          const docRef = doc(db, "User", pro_user.data().AssigneeID.toString());
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            userList.push({
              UserID: docSnap.data().UserID,
              Name: docSnap.data().Name,
              Avatar: docSnap.data().Avatar,
            });
          }
        }
      }

      // Not Started / In Progress / Completed / Overdue
      const status = { NotStarted: 0, InProgress: 0, Completed: 0, Overdue: 0 };
      // querySnapshot1
      for (const task of querySnapshot1.docs) {
        const docRef = doc(db, "Task", task.data().TaskID.toString());
        const docSnap = await getDoc(docRef);
        console.log("status: ", docSnap.data().Status);
        switch (docSnap.data().Status) {
          case "Not Started":
            status.NotStarted++;
            break;
          case "In Progress":
            status.InProgress++;
            break;
          case "Completed":
            status.Completed++;
            break;
          case "Overdue":
            status.Overdue++;
            break;
        }
      }
      const sum =
        status.NotStarted +
        status.InProgress +
        status.Completed +
        status.Overdue;
      let progress = 0;
      if (sum != 0) {
        progress = status.Completed / sum;
        progress = progress.toFixed(4);
      }
      console.log("progress: ", status);

      proList.push({
        ProjectID: proID,
        ProjectName: pro.data().ProjectName,
        numberOfTask: numberOfTask,
        userList: userList,
        progress: progress,
      });
    }
    setProjectList(proList);
  };

  useEffect(() => {
    getName();
    getProject();
  }, []);

  // find box
  const [keyword, setKeyword] = useState("");


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
    <TabContainer>
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
          <View style={styles.row}>
            {/* Button: back to previous screen */}
            <TouchableOpacity onPress={() => navigation.navigate("Notify")}>
              <Ionicons
                name="notifications-outline"
                size={30}
                style={styles.headerBehave}
              ></Ionicons>
            </TouchableOpacity>

            {/* small avatar */}
            <TouchableOpacity
              style={styles.headerBehave}
              onPress={() => navigation.navigate("AccountFeature")}
            >
              <UserAvatar
                size={40}
                active
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2900&q=80"
              />
            </TouchableOpacity>
          </View>
        </Animated.View>

        <Animated.ScrollView
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
        >
          <View style={{ flex: 1 }}>
            {/* Layout welcome, ngày tháng, findbox */}
            <View style={{ backgroundColor: "white", flex: 20 }}>
              {/* Xử lý load tên người dùng + Hello */}
              <Text style={styles.title}>Hello {userName}</Text>

              {/* Ngày tháng hiện tại */}
              <Text style={styles.normalTextOnBackGround}>{currentDate}</Text>

              {/* Find box */}
              <View style={styles.searchBox}>
                <View style={styles.row1} marginTop={9}>
                  <TextInput
                    width={"85%"}
                    style={styles.textInSearchBox}
                    placeholder="Find your project"
                    placeholderTextColor={Colors.placeholder}
                    onChangeText={(text)=>setKeyword(text)}
                  ></TextInput>

                  {/* Xử lý button tìm kiếm */}
                  <TouchableOpacity>
                    <AntDesign
                      name="search1"
                      size={25}
                      style={styles.iconInSearchBox}
                    ></AntDesign>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={{ backgroundColor: "white", flex: 80 }}>
              {/* Workspace */}

              {/* Workspace title */}
              <View style={styles.row1}>
                <Text style={styles.smallTitle}>Workspace</Text>
                {/* Đếm số lượng workspace người dùng đang có và load lên text tại đây */}
                <Text style={styles.numberOfProject}>{count}</Text>

                {/* Xử lý button sắp xếp project tại đây */}
                <TouchableOpacity>
                  <Entypo name="select-arrows" size={22} color="black" />
                </TouchableOpacity>
              </View>

              {/* Projects */}
              {projectList.map((p) => {
                let proName = p.ProjectName;
                if (proName.length > 40) {
                  proName = proName.slice(0, 39) + "...";
                }
                return (
                  <View style={styles.projectFrame} key={p.ProjectID} navigation={navigation} screenName="Projects">
                    {/* Tên & số lượng công việc */}
                    <View style={styles.smallFrame1}>
                      <Text style={styles.smallTitle2}>{proName}</Text>
                      <Text style={styles.numberOfProject2}>
                        {p.numberOfTask} tasks
                      </Text>
                    </View>

                    {/* Tiến độ hoàn thành & avatar thành viên */} 
                    <View style={styles.smallFrame2}>
                      {/* Xử lý lấy tiến độ hoàn thành và load lên text & view */}
                      <View style={styles.smallFrame3}>
                        <Text style={styles.progressText}>{`${
                          p.progress * 100
                        }%`}</Text>
                        <View style={styles.progressBar}>
                          <View style={[styles.progress, { width: `${p.progress * 100}%` }]} />
                        </View>
                      </View>

                      <View style={styles.smallFrame4}>
                        {p.userList.map((user) => {
                          if (user.Avatar == "") {
                            const name = user.Name;
                            const initials = name
                              .split(" ")
                              .map((name) => name.charAt(0))
                              .join("");
                            const avatarUrl = `https://ui-avatars.com/api/?name=${name}&background=random&size=25`;
                            return (
                              <UserAvatar
                                style={styles.avatar}
                                key={user.UserID}
                                size={25}
                                src={avatarUrl}
                                alt={user.Name}
                              />
                            );
                          } else {
                            return (
                              <UserAvatar
                                style={styles.avatar}
                                key={user.UserID}
                                size={25}
                                src={user.Avatar}
                                alt={user.Name}
                              />
                            );
                          }
                        })}
                      </View>
                    </View>
                  </View>
                );
              })}

              {/* Đếm số lượng task của project và hiển thị các workspace của người dùng lên màn hình
              <View style={styles.projectFrame}>
                Tên & số lượng công việc
                <View style={styles.smallFrame1}>
                  xử lý lấy tên và số lượng project từ BE, load lên text tại đây
                  <Text style={styles.smallTitle2}>Web design</Text>
                  <Text style={styles.numberOfProject2}>12 Projects</Text>
                </View>

                Tiến độ hoàn thành & avatar thành viên
                <View style={styles.smallFrame2}>
                  Xử lý lấy tiến độ hoàn thành và load lên text & view
                  Xử lý lấy avatar các thành viên trong workspace và load lên một vài avatar nhỏ
                </View>
              </View> */}
            </View>
          </View>
        </Animated.ScrollView>
      </KeyboardAvoidingView>
    </TabContainer>
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

  row1: {
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
    marginLeft: 15,
    marginRight: "auto",
    color: "#363942",
    fontSize: 25,
    fontWeight: "bold",
    marginTop: 100,
    // fontStyle
  },

  iconInSearchBox: {
    marginRight: 15,
    marginLeft: "auto",
    color: "gray",
  },

  smallTitle: {
    marginLeft: 15,
    marginRight: 5,
    color: "#363942",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  smallTitle2: {
    marginLeft: 15,
    marginRight: 5,
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 30,
    marginBottom: 5,
  },

  numberOfProject: {
    fontSize: 18,
    color: "gray",
    marginLeft: 5,
    marginRight: 5,
    fontWeight: "bold",
  },

  numberOfProject2: {
    fontSize: 14,
    color: "#F8F6FF",
    marginLeft: 15,
  },

  normalTextOnBackGround: {
    marginLeft: 15,
    color: "gray",
    fontSize: 13,
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

  projectFrame: {
    backgroundColor: "white",
    marginTop: 15,
    height: 145,
    shadowColor: "gray",
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    borderRadius: 15,
    elevation: 15,
    marginHorizontal: 15,
    marginBottom: 15,
  },

  smallFrame1: {
    backgroundColor: "#0093E9",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    flex: 6,
  },

  smallFrame2: {
    backgroundColor: "white",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    flex: 4,
    display: "flex",
    flexDirection: "row",
  },

  smallFrame3: {
    marginTop: 15,
    marginLeft: 10,
    flex: 1,
    borderRadius: 5,
  },

  progressBar: {
    marginTop: 3,
    marginLeft: 10,
    height: 3,
    backgroundColor: "lightgrey",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },

  progress: {
    height: "100%",
    backgroundColor: "#0093E9",
    position: "absolute",
    left: 0,
  },

  progressText: {
    fontSize: 14,
    color: "#000000",
    marginLeft: 15,
  },

  smallFrame4: {
    marginTop: 15,
    marginRight: 10,
    flex: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
  },

  avatar: {
    marginLeft: 5,
  },

  searchBox: {
    backgroundColor: "#F5F5F5",
    marginTop: 15,
    marginBottom: 25,
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
    marginBottom: "auto",
    marginTop: "auto",
    marginLeft: 15,
    marginRight: 15,
    marginTop: 8,
  },

  textInSearchBox: {
    fontSize: 16,
    marginLeft: 15,
    marginRight: 0,
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

export default WorkSpaceScreen;

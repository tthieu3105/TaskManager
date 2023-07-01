import { Text, StyleSheet, View, KeyboardAvoidingView } from "react-native";
import React, { Component, useEffect, useState } from "react";
import { StatusBar, Animated } from "react-native";
import Header from "../components/HeaderWithTextAndAvatar";
import { ScrollView } from "react-native";
import { TouchableOpacity } from "react-native";
import { TextInput } from "react-native";
import { Feather, FontAwesome, SimpleLineIcons } from "@expo/vector-icons";
import AntDesign from "../node_modules/@expo/vector-icons/AntDesign";
import { Colors } from "react-native/Libraries/NewAppScreen";
import HomeSection from "../components/HomeSection";
import TaskCard from "../components/TaskCardProgress";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRef } from "react";
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

import UserAvatar from "@muhzi/react-native-user-avatar";
const Progress = ({ step, steps, height }) => {
  const [width, setWidth] = React.useState(0);
  const animatedValue = React.useRef(new Animated.Value(-1000)).current;
  const reactive = React.useRef(new Animated.Value(-1000)).current;
  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: reactive,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);
  React.useEffect(() => {
    //-width + width * step/steps
    reactive.setValue(-width + (width * step) / steps);
  }, [step, width]);
  return (
    <>
      <Text
        style={{
          // fontFamily: "Menlo",
          marginHorizontal: 20,
          fontSize: 12,
          fontWeight: "500",
          marginVertical: 8,
        }}
      >
        {step}/{steps}
      </Text>
      <View
        onLayout={(e) => {
          const newWidth = e.nativeEvent.layout.width;
          setWidth(newWidth);
        }}
        style={{
          height,
          backgroundColor: "rgba(0,0,0,0.1)",
          borderRadius: height,
          overflow: "hidden",
          marginHorizontal: 20,
        }}
      >
        <Animated.View
          style={{
            height,
            width: "100%",
            borderRadius: height,
            backgroundColor: "#4B7BE5",
            position: "absolute",
            left: 0,
            top: 0,
            transform: [
              {
                translateX: animatedValue,
              },
            ],
          }}
        />
      </View>
    </>
  );
};
const CONTAINER_HEIGHT = 80;
const projectCard = {
  title1: "Landing Page Agency",
  subtitle1: "Webb Design",
  time1: "10:00 - 12:30 am",
  status1: "On Progress",
  icon: "user-circle",
};
export default function NotStartedWSSreen({ navigation, route }) {
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
  const [index, setIndex] = React.useState(0);
  React.useEffect(() => {
    const interval = setInterval(() => {
      setIndex((index + 1) % (10 + 1));
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [index]);

  const { ProjectID } = route.params ? route.params : {};
  const [project, setProject] = useState({});
  const [taskList, setTaskList] = useState([]);
  const [numberOfTask, setNumberOfTask] = useState(0);

  const getProjectInfo = async () => {
    const q1 = query(
      collection(db, "Project_Task"),
      where("ProjectID", "==", ProjectID)
    );

    const querySnapshot1 = await getDocs(q1);
    const tasks = [];
    if (querySnapshot1.size > 0) {
      for (const pro_task of querySnapshot1.docs) {
        const taskRef = doc(db, "Task", pro_task.data().TaskID.toString());
        const taskSnap = await getDoc(taskRef);

        if (taskSnap.exists()) {
          if (taskSnap.data().Status == "Not Started") {
            let userID = 0;
            let userAvatar = "";
            let name = "";
            if (taskSnap.data().AssignTo) {
              const q2 = query(
                collection(db, "Task_User"),
                where("TaskID", "==", taskSnap.data().TaskID)
              );
              const querySnapshot2 = await getDocs(q2);
              if (querySnapshot2.size > 0) {
                const userRef = doc(
                  db,
                  "User",
                  querySnapshot2.docs[0].data().AssigneeID.toString()
                );
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                  userID = userSnap.data().UserID;
                  userAvatar = userSnap.data().Avatar;
                  name = userSnap.data().Name;
                }
              }
            } else {
              const userRef = doc(
                db,
                "User",
                taskSnap.data().CreatorID.toString()
              );
              const userSnap = await getDoc(userRef);
              userID = userSnap.data().UserID;
              userAvatar = userSnap.data().Avatar;
              name = userSnap.data().Name;
            }

            tasks.push({
              TaskID: taskSnap.data().TaskID,
              Title: taskSnap.data().Title,
              Description: taskSnap.data().Description,
              Status: taskSnap.data().Status,
              StartTime: taskSnap
                .data()
                .StartTime.toDate()
                .toLocaleTimeString(),
              DueTime: taskSnap.data().DueTime.toDate().toLocaleTimeString(),
              UserID: userID,
              Name: name,
              UserAvatar: userAvatar,
              hidden: false,
            });
          }
        }
      }
      setNumberOfTask(tasks.length);
      setTaskList(tasks);
    }

    const proRef = doc(db, "Project", ProjectID.toString());
    const proSnap = await getDoc(proRef);

    if (proSnap.exists()) {
      const pro = {
        ProjectID: ProjectID,
        ProjectName: proSnap.data().ProjectName,
        CreatorID: proSnap.data().CreatorID,
        StartTime: proSnap.data().StartTime.toDate().toLocaleDateString(),
        EndTime: proSnap.data().EndTime.toDate().toLocaleDateString(),
      };
      setProject(pro);
    }
  };

  useEffect(() => {
    getProjectInfo();
  }, []);

  // Find keyword
  const [keyword, setKeyword] = useState("");

  const handleClearSearchBox = () => {
    taskList.map((t) => {
      t.hidden = false;
    });
    setKeyword("");
  };

  const FindKeyword = () => {
    const key = keyword.toLowerCase();
    const updatedList = taskList.map((t) => {
      const title = t.Title.toLowerCase();
      const description = t.Description.toLowerCase();
      if (!(title.includes(key) || description.includes(key))) {
        return { ...t, hidden: true };
      }
      return { ...t, hidden: false };
    });
    setTaskList(updatedList);
  };

  // Sort
  const [sort, setSort] = useState(0);
  const Sort = () => {
    let initTask = "";
    taskList
      .filter((t) => t.hidden == false)
      .map((t) => {
        initTask = initTask + t.TaskID.toString();
      });
    let sortTaskList = "";
    switch (sort) {
      case 0:
        sortTaskList = "";
        taskList.sort((a, b) => a.Title.localeCompare(b.Title));
        taskList
          .filter((t) => t.hidden == false)
          .map((t) => {
            sortTaskList = sortTaskList + t.TaskID.toString();
          });
        if (initTask !== sortTaskList) {
          setSort(1);
          break;
        }
      case 1:
        sortTaskList = "";
        taskList.sort((a, b) => a.StartTime.localeCompare(b.StartTime));
        taskList
          .filter((t) => t.hidden == false)
          .map((t) => {
            sortTaskList = sortTaskList + t.TaskID.toString();
          });
        if (initTask !== sortTaskList) {
          setSort(2);
          break;
        }
      case 2:
        sortTaskList = "";
        taskList.sort((a, b) => a.TaskID - b.TaskID);
        taskList
          .filter((t) => t.hidden == false)
          .map((t) => {
            sortTaskList = sortTaskList + t.TaskID.toString();
          });
        if (initTask !== sortTaskList) {
          setSort(0);
          break;
        }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      enabled
      keyboardVerticalOffset={Platform.select({ ios: 0, android: 500 })}
    >
      {/* Hiển thị trạng thái điện thoại */}
      <StatusBar barStyle={"dark-content"} />
      {/* Header */}
      <Animated.View
        style={[
          styles.header,
          { transform: [{ translateY: headerTranslate }] },
        ]}
      >
        <View style={styles.rowSection}>
          <TouchableOpacity
            style={styles.headerBehave}
            onPress={() => navigation.goBack()}
          >
            <SimpleLineIcons name="arrow-left" size={24} color="black" />
          </TouchableOpacity>
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
      {/* End of Header */}
      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
      >
        <View style={{ marginTop: 80 }}>
          {/* Hello user */}
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={styles.title}>{project.ProjectName}</Text>
            <TouchableOpacity>
              <MaterialCommunityIcons
                name="dots-horizontal"
                size={30}
                color="black"
                style={{ marginHorizontal: 20, marginTop: 20 }}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.detailText}>Started in {project.StartTime}</Text>
          {/* Progress Bar */}
          {/* <Progress step={5} steps={10} height={20} /> */}
          {/* SearchBox */}
          <View style={styles.SearchBox}>
            <TextInput
              style={styles.textInSearchBox}
              placeholder="Find your task"
              placeholderTextColor={Colors.placeholder}
              onChangeText={(text) => setKeyword(text)}
              value={keyword}
            ></TextInput>
            <TouchableOpacity onPress={handleClearSearchBox}>
              <AntDesign
                name="closecircle"
                size={20}
                style={styles.iconClearSearchBox}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={FindKeyword}>
              <Feather name="search" size={24} color="#363942" />
            </TouchableOpacity>
          </View>
        </View>

        {/* My Task */}
        <View style={styles.contentName}>
          <Text style={{ fontSize: 20, fontWeight: 600 }}>Not Started</Text>
          <Text
            style={{
              fontSize: 20,
              fontWeight: 600,
              color: "gray",
              marginHorizontal: 6,
            }}
          >
            {numberOfTask}
          </Text>
          <TouchableOpacity onPress={Sort}>
            <FontAwesome name="sort" size={20} color="black" />
          </TouchableOpacity>
        </View>
        {taskList
          .filter((task) => task.hidden == false)
          .map((task) => {
            let avatar = task.UserAvatar;
            if (avatar == "") {
              const name = task.Name;
              const initials = name
                .split(" ")
                .map((name) => name.charAt(0))
                .join("");
              avatar = `https://ui-avatars.com/api/?name=${name}&background=random&size=24`;
            }
            return (
              <TaskCard
                key={task.TaskID}
                title={task.Title}
                subtitle={task.Description}
                time={task.StartTime}
                taskStatus={task.Status}
                avatar={avatar}
                taskID={task.TaskID.toString()}
              ></TaskCard>
            );
          })}
        {/* TaskCard */}
        {/* <TaskCard
          title={projectCard.title1}
          subtitle={projectCard.subtitle1}
          time={projectCard.time1}
          status={projectCard.status1}
          iconName={projectCard.icon}
        ></TaskCard> */}
        {/* End of TaskCard */}
      </Animated.ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  title: {
    color: "#363942",
    fontSize: 24,
    fontWeight: "bold",
    marginHorizontal: 20,
    marginTop: 20,
  },
  detailText: {
    color: "#363942",
    fontSize: 12,
    margin: 5,
    marginHorizontal: 20,
  },
  SearchBox: {
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    margin: 20,
    alignItems: "center",
    padding: 10,
    flexDirection: "row",
  },
  textInSearchBox: {
    fontSize: 16,
    width: "83%",
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
  headerBehave: {
    padding: 20,
  },
  contentName: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
  },
  iconClearSearchBox: {
    marginLeft: 10,
    marginRight: 5,
    color: "#c0c0c0",
  },
});

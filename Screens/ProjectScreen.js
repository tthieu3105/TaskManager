import { Text, StyleSheet, View, KeyboardAvoidingView } from "react-native";
import React, { Component, useEffect, useState, useContext } from "react";
import { StatusBar, Animated } from "react-native";
import Header from "../components/HeaderWithTextAndAvatar";
import { ScrollView } from "react-native";
import { TouchableOpacity } from "react-native";
import { TextInput } from "react-native";
import { Feather, SimpleLineIcons } from "@expo/vector-icons";
import { Colors } from "react-native/Libraries/NewAppScreen";
import ProjectSection from "../components/ProjectSection";
import TaskCard from "../components/TaskCardProgress";
import TaskCardOP from "../components/TaskCardProgress";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRef } from "react";
import AntDesign from "../node_modules/@expo/vector-icons/AntDesign";
import { BottomPopup } from "../components/BotttomPopup";
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
import { UserContext, UserProvider } from "../contextObject";


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
    if (steps != 0) {
      reactive.setValue(-width + (width * step) / steps);
    } else {
      reactive.setValue(width);
    }
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
const sectionInHome = {
  sectionName: "Recently assigned",
  sectionName2: "All tasks",
};
const projectCard = {
  title1: "Landing Page Agency",
  subtitle1: "Webb Design",
  time1: "10:00 - 12:30 am",
  status1: "On Progress",
  icon: "user-circle",
};

export default function ProjectScreen({ navigation, route }) {
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
    getProjectInfo();
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
  // Popup
  let popupRef = React.createRef();
  const onShowPopup = () => {
    popupRef.show();
  };
  const onClosePopup = () => {
    popupRef.close();
  };
  // const popupList = [
  //   {
  //     id: 1,
  //     name: "Edit Project",
  //   },
  //   {
  //     id: 2,
  //     name: "Delete Project",
  //   },
  // ];

  const { userId } = useContext(UserContext);
  const [userName, setUserName] = useState("");
  const [userAvatar, setUserAvatar] = useState("");

  const getNameAvatar = async () => {
    const docRef = doc(db, "User", userId.toString());
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const fullName = docSnap.data().Name;
      const nameArray = fullName.split(" ");
      const lastName = nameArray[nameArray.length - 1];
      setUserName(lastName);

      let avatarUrl = docSnap.data().Avatar;
      if (avatarUrl == "") {
        const initials = fullName
          .split(" ")
          .map((name) => name.charAt(0))
          .join("");
        avatarUrl = `https://ui-avatars.com/api/?name=${fullName}&background=random&size=25`;
      }

      setUserAvatar(avatarUrl);
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
      setUserName("John");
    }
  };

  useEffect(() => {
    getNameAvatar();
  }, []);

  const { ProjectID } = route.params ? route.params : {};
  const [taskList, setTaskList] = useState([]);
  const [numberOfTask, setNumberOfTask] = useState(0);
  const [numberOfCompleted, setNumberOfCompleted] = useState(0);
  const [project, setProject] = useState({});
  const [isOnProgress, setIsOnProgress] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isOverdue, setIsOverdue] = useState(false);
  const [isNotStarted, setIsNotStarted] = useState(false);

  const getProjectInfo = async () => {
    const q1 = query(
      collection(db, "Project_Task"),
      where("ProjectID", "==", ProjectID)
    );

    const querySnapshot1 = await getDocs(q1);
    const tasks = [];
    let numOfCompleted = 0;
    if (querySnapshot1.size > 0) {
      for (const pro_task of querySnapshot1.docs) {
        const taskRef = doc(db, "Task", pro_task.data().TaskID.toString());
        const taskSnap = await getDoc(taskRef);

        if (taskSnap.exists()) {
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
          if (taskSnap.data().Status == "Completed") {
            numOfCompleted++;
          }

          tasks.push({
            TaskID: taskSnap.data().TaskID,
            Title: taskSnap.data().Title,
            Description: taskSnap.data().Description,
            Status: taskSnap.data().Status,
            StartTime: taskSnap.data().StartTime.toDate().toLocaleTimeString(),
            DueTime: taskSnap.data().DueTime.toDate().toLocaleTimeString(),
            UserID: userID,
            Name: name,
            UserAvatar: userAvatar,
            hidden: false,
          });
        }
      }
      setTaskList(tasks);
      setNumberOfTask(querySnapshot1.size);
      setNumberOfCompleted(numOfCompleted);
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
    if (taskList.length > 0) {
      if (taskList.filter((task) => task.Status == "Not Started").length > 0) {
        setIsNotStarted(true);
      }
      if (taskList.filter((task) => task.Status == "On Progress").length > 0) {
        setIsOnProgress(true);
      }
      if (taskList.filter((task) => task.Status == "Completed").length > 0) {
        setIsCompleted(true);
      }
      if (taskList.filter((task) => task.Status == "Overdue").length > 0) {
        setIsOverdue(true);
      }
    }
  }, [taskList]);

  // Find box
  const [keyword, setKeyword] = useState("");
  const handleClearSearchBox = () => {
    setKeyword("");
    taskList.map((t) => {
      t.hidden = false;
    });
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

  // delete project
  const DeleteProject = async () => {
    await deleteDoc(doc(db, "Project", ProjectID.toString()));
    
    const q1 = query(
      collection(db, "Project_User"),
      where("ProjectID", "==", ProjectID)
    );

    const querySnapshot1 = await getDocs(q1);
    
    for(const pro_user of querySnapshot1.docs) {
      await deleteDoc(doc(db, "Project_User", pro_user.data().itemID.toString()));
    }
    
    const q2 = query(
      collection(db, "Project_Task"),
      where("ProjectID", "==", ProjectID)
    );
    const querySnapshot2 = await getDocs(q2);

    for(const pro_task of querySnapshot2.docs) {
      await deleteDoc(doc(db, "Project_Task", pro_task.data().itemID.toString()));
      await deleteDoc(doc(db, "Task", pro_task.data().TaskID.toString()));
    }
    navigation.replace("WorkspaceScreen");
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
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign
              name="left"
              size={30}
              style={styles.headerBehave}
            ></AntDesign>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerBehave}
            onPress={() => navigation.navigate("AccountFeature")}
          >
            <UserAvatar
              size={40}
              active
              src={userAvatar}
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
            {/* <TouchableOpacity onPress={onShowPopup}>
              <MaterialCommunityIcons
                name="dots-horizontal"
                size={30}
                color="black"
                style={{ marginHorizontal: 20, marginTop: 20 }}
              />
            </TouchableOpacity> */}
            <BottomPopup
              titleEdit="Edit Project"
              titleDelete="Delete this Project"
              navigation={navigation}
              screenName="EditProject"
              projectID={ProjectID}
              funcDeleteProject={DeleteProject}
              ref={(target) => (popupRef = target)}
              onTouchOutside={onClosePopup}
            />
          </View>

          <View style={styles.startIn}>
            <Text style={styles.detailText}>
              Started in {project.StartTime}
            </Text>
            <TouchableOpacity onPress={onShowPopup}>
              <MaterialCommunityIcons
                name="dots-horizontal"
                size={30}
                color="black"
                // style={{ marginHorizontal: 20, marginTop: 20 }}
              />
            </TouchableOpacity>
          </View>

          {/* Progress Bar */}
          <Progress step={numberOfCompleted} steps={numberOfTask} height={20} />

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

        {/* {taskList.map((task) => {
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
              title={task.Title}
              subtitle={task.Description}
              time={task.StartTime + " " + task.DueTime}
              taskStatus={task.Status}
              avatar={avatar}
              taskID={task.TaskID.toString()}
            ></TaskCard>
          );
        })} */}

        {/* On progress */}
        {isOnProgress == true ? (
          <ProjectSection
            title="On Progress Task"
            screenName="OnProgressWS"
            navigation={navigation}
            ProjectID={ProjectID}
          ></ProjectSection>
        ) : (
          <View></View>
        )}

        {taskList
          .filter((task) => task.Status == "On Progress" && task.hidden == false)
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
                title={task.Title}
                subtitle={task.Description}
                time={task.StartTime}
                taskStatus={task.Status}
                avatar={avatar}
                taskID={task.TaskID.toString()}
              ></TaskCard>
            );
          })}

        {/* Not started */}
        {isNotStarted === true ? (
          <ProjectSection
            title="Not Started"
            screenName="NotStartedWS"
            navigation={navigation}
            ProjectID={ProjectID}
          ></ProjectSection>
        ) : (
          <View></View>
        )}

        {taskList
          .filter((task) => task.Status == "Not Started" && task.hidden == false)
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
                title={task.Title}
                subtitle={task.Description}
                time={task.StartTime}
                taskStatus={task.Status}
                avatar={avatar}
                taskID={task.TaskID.toString()}
              ></TaskCard>
            );
          })}

        {/* Completed */}
        {isCompleted === true ? (
          <ProjectSection
            title="Completed Task"
            screenName="CompletedWS"
            navigation={navigation}
            ProjectID={ProjectID}
          ></ProjectSection>
        ) : (
          <View></View>
        )}

        {taskList
          .filter((task) => task.Status == "Completed" && task.hidden == false)
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
                title={task.Title}
                subtitle={task.Description}
                time={task.StartTime}
                taskStatus={task.Status}
                avatar={avatar}
                taskID={task.TaskID.toString()}
              ></TaskCard>
            );
          })}

        {/* Overdue */}
        {isOverdue === true ? (
          <ProjectSection
            title="Overdue Task"
            screenName="OverdueWS"
            navigation={navigation}
            ProjectID={ProjectID}
          ></ProjectSection>
        ) : (
          <View></View>
        )}

        {taskList
          .filter((task) => task.Status == "Overdue" && task.hidden == false)
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
        {/* End of My Task */}
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
  startIn: {
    flexDirection: "row",
  },

  detailText: {
    color: "#363942",
    fontSize: 12,
    margin: 5,
    marginHorizontal: 20,
    width: "78%",
  },

  row1: {
    flexDirection: "row",
    display: "flex",
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

  iconClearSearchBox: {
    marginLeft: 10,
    marginRight: 5,
    color: "#c0c0c0",
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
});

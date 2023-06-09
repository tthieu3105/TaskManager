import { setStatusBarBackgroundColor } from "expo-status-bar";
import {
  View,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Animated,
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator,
  Switch,
} from "react-native";
import React, { Component, useEffect, useState, useRef } from "react";
import {
  Feather,
  SimpleLineIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import Header from "../components/HeaderWithTextAndIcon";
import { MaterialIcons } from "@expo/vector-icons";
import InputArea from "../components/InputAreaForTask";
import { Colors } from "react-native/Libraries/NewAppScreen";
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
import { useFocusEffect } from "@react-navigation/native";
import PopupModal from "./../components/PopUpNotify";

const CONTAINER_HEIGHT = 80;
const inputText = {
  name1: "Project",
  name2: "Title",
  name3: "Start date",
  name5: "Due date",
  name4: "Description",
  icon1: "arrow-drop-down-circle",
  icon3: "calendar-today",
  hintText: "Enter Username or Email",
  disable: false,
};

export default function TaskInfoScreen({ navigation, route }) {
  const {
    taskID,
    refreshScreen,
    refreshMyTaskScreen,
    refreshOverdueScreen,
    refreshCompletedScreen,
  } = route.params;
  const [task, setTask] = useState(null);
  const [project, setProject] = useState(null);

  const [projectName, setProjectName] = useState(""); // Add state for project name
  const [startDate, setStartDate] = useState(null); // Add a state for start date
  const [startTime, setStartTime] = useState(null); // Add a state for start date

  const [endDate, setEndDate] = useState(null); // Add a state for start date
  const [endTime, setEndTime] = useState(null); // Add a state for start date

  const [dueDateVisible, setDueDateVisible] = useState(false); // Due date
  const [timeVisible, setTimeVisible] = useState(false); //Include time
  const [remindVisible, setRemindVisible] = useState(false); //Remind enable

  const [remindTime, setRemindTime] = useState("");
  const [assignVisible, setAssignVisible] = useState(false);
  const [assignee, setAssignee] = useState("");
  const remindOptions = [
    // "On day of event",
    "1 days before",
    "2 days before",
    "7 days before",
    // ...Thêm các giá trị khác vào đây
  ];
  const refreshTaskInfoScreen = async () => {
    try {
      const taskDoc = await getDoc(doc(db, "Task", taskID));

      if (taskDoc.exists) {
        const taskData = taskDoc.data();
        setTask(taskData);
        //  Thực hiện tách ngày và giờ riêng của thuộc tính StartTime
        const options = {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        };
        const startDay = taskData.StartTime.toDate();
        const startDate = startDay.toLocaleDateString("en-US", options);
        const startTime = startDay.toLocaleTimeString();

        setStartDate(startDate); // Set the startDate state here
        setStartTime(startTime);
        // Set giá trị includeEndDate, includeTime, Remind, Assign to
        const includeEndDate = taskData.IncludeEndDate;
        const includeTime = taskData.IncludeTime;
        const remind = taskData.Remind;
        const assignTo = taskData.AssignTo;
        setDueDateVisible(includeEndDate);
        setTimeVisible(includeTime);
        setRemindVisible(remind);
        setAssignVisible(assignTo);
        //In ra kiểu dữ liệu của thuộc tính taskID mà truyền vào
        console.log("Type of taskID:", typeof taskID); //string
        //Chuyển kiểu dữ liệu sang int do thuộc tính TaskID trong Firestore là int
        const task_ID = parseInt(taskID);
        //Tách thuộc tính DueDate và DueTime
        if (includeEndDate) {
          const endDay = taskData.DueTime.toDate();
          const endDate = endDay.toLocaleDateString("en-US", options);
          const endTime = endDay.toLocaleTimeString();

          setEndDate(endDate); // Set the endDate state here
          setEndTime(endTime);
        }
        if (remind) {
          //Lấy đối tượng Timestamp trong Firestore và chuyển sang Date
          const dueTime = taskData.DueTime.toDate();
          const remindTime = taskData.RemindTime.toDate();
          // Lấy giá trị ngày từ RemindTime
          const remindDay = remindTime.getDate();

          // Lấy giá trị ngày từ DueTime
          const dueDay = dueTime.getDate();
          // Chuyển đổi giá trị ngày sang kiểu số nguyên
          const remindDayInt = parseInt(remindDay);
          const dueDayInt = parseInt(dueDay);
          // Kết quả là một số nguyên tương ứng với ngày
          console.log("Remind day:", remindDayInt);
          console.log("Due day:", dueDayInt);
          // Tính toán khoảng thời gian giữa DueTime và RemindTime
          const daysDiff = dueDayInt - remindDayInt;
          // Tìm giá trị tương ứng dựa trên daysDiff
          console.log("Days Difference:", daysDiff);
          let selectedOption;
          if (daysDiff === 0) {
            selectedOption = "On day of event";
          } else {
            selectedOption = remindOptions.find(
              (option) => parseInt(option) === daysDiff
            );
          }

          setRemindTime(selectedOption);
        }
        if (assignTo) {
          const taskUserRef = collection(db, "Task_User");
          const queryTaskUser = query(
            taskUserRef,
            where("TaskID", "==", task_ID)
          );
          const taskUserSnapshot = await getDocs(queryTaskUser);
          if (!taskUserSnapshot.empty) {
            const assigneeID = taskUserSnapshot.docs[0].data().AssigneeID;
            console.log("Type of assigneeID:", typeof assigneeID); //number
            // Fetch project name from Project table

            const userSnapshot = await getDoc(
              doc(db, "User", assigneeID.toString())
            );

            if (userSnapshot.exists()) {
              const userData = userSnapshot.data();
              const userName = userData.Name;
              setAssignee(userName);
            }
          }
        }

        // Fetch project ID from Project_Task table
        const projectTaskRef = collection(db, "Project_Task");
        const queryProjectTask = query(
          projectTaskRef,
          where("TaskID", "==", task_ID)
        );

        const projectTaskSnapshot = await getDocs(queryProjectTask);
        if (!projectTaskSnapshot.empty) {
          const projectID = projectTaskSnapshot.docs[0].data().ProjectID;
          console.log("Type of projectID:", typeof projectID); //number
          // Fetch project name from Project table

          const projectSnapshot = await getDoc(
            doc(db, "Project", projectID.toString())
          );

          if (projectSnapshot.exists()) {
            const projectData = projectSnapshot.data();
            const nameProject = projectData.ProjectName;
            setProjectName(nameProject);
          }
        }
      } else {
        // Handle case when task doesn't exist
        console.log("Task not found");
      }
    } catch (error) {
      console.error("Error refreshing Screen B:", error);
    }
  };
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const taskDoc = await getDoc(doc(db, "Task", taskID));
        if (taskDoc.exists) {
          const taskData = taskDoc.data();
          setTask(taskData);
          //  Thực hiện tách ngày và giờ riêng của thuộc tính StartTime
          const options = {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          };
          const startDay = taskData.StartTime.toDate();
          const startDate = startDay.toLocaleDateString("en-US", options);
          const startTime = startDay.toLocaleTimeString();

          setStartDate(startDate); // Set the startDate state here
          setStartTime(startTime);
          // Set giá trị includeEndDate, includeTime, Remind, Assign to
          const includeEndDate = taskData.IncludeEndDate;
          const includeTime = taskData.IncludeTime;
          const remind = taskData.Remind;
          const assignTo = taskData.AssignTo;
          setDueDateVisible(includeEndDate);
          setTimeVisible(includeTime);
          setRemindVisible(remind);
          setAssignVisible(assignTo);
          //In ra kiểu dữ liệu của thuộc tính taskID mà truyền vào
          console.log("Type of taskID:", typeof taskID); //string
          //Chuyển kiểu dữ liệu sang int do thuộc tính TaskID trong Firestore là int
          const task_ID = parseInt(taskID);
          //Tách thuộc tính DueDate và DueTime
          if (includeEndDate) {
            const endDay = taskData.DueTime.toDate();
            const endDate = endDay.toLocaleDateString("en-US", options);
            const endTime = endDay.toLocaleTimeString();

            setEndDate(endDate); // Set the endDate state here
            setEndTime(endTime);
          }
          if (remind) {
            //Lấy đối tượng Timestamp trong Firestore và chuyển sang Date
            const dueTime = taskData.DueTime.toDate();
            const remindTime = taskData.RemindTime.toDate();
            // Lấy giá trị ngày từ RemindTime
            const remindDay = remindTime.getDate();

            // Lấy giá trị ngày từ DueTime
            const dueDay = dueTime.getDate();
            // Chuyển đổi giá trị ngày sang kiểu số nguyên
            const remindDayInt = parseInt(remindDay);
            const dueDayInt = parseInt(dueDay);
            // Kết quả là một số nguyên tương ứng với ngày
            console.log("Remind day:", remindDayInt);
            console.log("Due day:", dueDayInt);
            // Tính toán khoảng thời gian giữa DueTime và RemindTime
            const daysDiff = dueDayInt - remindDayInt;
            // Tìm giá trị tương ứng dựa trên daysDiff
            console.log("Days Difference:", daysDiff);
            let selectedOption;
            if (daysDiff === 0) {
              selectedOption = "On day of event";
            } else {
              selectedOption = remindOptions.find(
                (option) => parseInt(option) === daysDiff
              );
            }

            setRemindTime(selectedOption);
          }
          if (assignTo) {
            const taskUserRef = collection(db, "Task_User");
            const queryTaskUser = query(
              taskUserRef,
              where("TaskID", "==", task_ID)
            );
            const taskUserSnapshot = await getDocs(queryTaskUser);
            if (!taskUserSnapshot.empty) {
              const assigneeID = taskUserSnapshot.docs[0].data().AssigneeID;
              console.log("Type of assigneeID:", typeof assigneeID); //number
              // Fetch project name from Project table

              const userSnapshot = await getDoc(
                doc(db, "User", assigneeID.toString())
              );

              if (userSnapshot.exists()) {
                const userData = userSnapshot.data();
                const userName = userData.Name;
                setAssignee(userName);
              }
            }
          }

          // Fetch project ID from Project_Task table
          const projectTaskRef = collection(db, "Project_Task");
          const queryProjectTask = query(
            projectTaskRef,
            where("TaskID", "==", task_ID)
          );

          const projectTaskSnapshot = await getDocs(queryProjectTask);
          if (!projectTaskSnapshot.empty) {
            const projectID = projectTaskSnapshot.docs[0].data().ProjectID;
            console.log("Type of projectID:", typeof projectID); //number
            // Fetch project name from Project table

            const projectSnapshot = await getDoc(
              doc(db, "Project", projectID.toString())
            );

            if (projectSnapshot.exists()) {
              const projectData = projectSnapshot.data();
              const nameProject = projectData.ProjectName;
              setProjectName(nameProject);
            }
          }
        } else {
          // Handle case when task doesn't exist
          console.log("Task not found");
        }
      } catch (error) {
        console.log("Error fetching task:", error);
      }
    };

    fetchTask();
  }, [taskID]);
  //XÓA DỮ LIỆU
  const handleDeleteTask = async () => {
    try {
      // Create a DocumentReference for the task document using the taskId
      const taskDocRef = doc(db, "Task", taskID);
      const task_ID = parseInt(taskID);

      //Xóa bảng Project_Task
      //Tiến hành tìm itemID của bảng Project_Task
      let projectTaskRef = collection(db, "Project_Task");
      const q_projectTask = query(
        projectTaskRef,
        where("TaskID", "==", task_ID)
      );

      const projectTaskSnapshot = await getDocs(q_projectTask);
      if (!projectTaskSnapshot.empty) {
        const projectTaskId = projectTaskSnapshot.docs[0].data().itemID;
        projectTaskRef = doc(db, "Project_Task", projectTaskId.toString());
        // Xóa bảng Task_User
        //Tiến hành tìm itemID của bảng Task_User
        let taskUserRef = collection(db, "Task_User");
        const q_taskUser = query(taskUserRef, where("TaskID", "==", task_ID));

        const taskUserSnapshot = await getDocs(q_taskUser);

        const taskUserId = taskUserSnapshot.docs[0].data().itemID;
        taskUserRef = doc(db, "Task_User", taskUserId.toString());
        // Delete the document from Firestore

        await deleteDoc(taskUserRef);
        await deleteDoc(projectTaskRef);

        // Task deleted successfully
      }
      await deleteDoc(taskDocRef);
      openModal("success", "Task deleted");
      console.log("Task deleted");
    } catch (error) {
      // Error deleting task
      openModal("error", "Error deleting task");
      console.error("Error deleting task: ", error);
    }
  };
  // Popup thông báo
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
    refreshScreen();
    refreshMyTaskScreen();
    refreshOverdueScreen(), refreshCompletedScreen(), navigation.goBack();
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
  if (!task) {
    // Add a loading indicator or other placeholder component while the task is being fetched
    return <ActivityIndicator />;
  }
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      enabled
      keyboardVerticalOffset={Platform.select({ ios: 0, android: 500 })}
    >
      <StatusBar barStyle={"dark-content"} />

      {/* Header */}
      <Animated.View
        style={[
          styles.header,
          { transform: [{ translateY: headerTranslate }] },
        ]}
      >
        {/* Header */}
        <View style={styles.rowSection}>
          <TouchableOpacity
            style={styles.headerBehave}
            onPress={() => {
              navigation.goBack();
              if (refreshScreen) {
                refreshScreen();
              }
            }}
          >
            <SimpleLineIcons name="arrow-left" size={20} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerBehave}
            onPress={() =>
              navigation.navigate("EditTask", { taskID, refreshTaskInfoScreen })
            }
          >
            <Text style={styles.textHeader}>Edit</Text>
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
        <View>
          <View
            style={{
              marginTop: 80,
            }}
          >
            {/* Project Name */}
            {/* TextInput */}
            <InputArea
              name={inputText.name1}
              icon={inputText.icon1}
              content={projectName}
              editableState={inputText.disable}
            ></InputArea>

            {/* <InputText nameInputText={this.inputText.name1}></InputText> */}
            {/* End of TextInput */}

            {/* Title name */}
            {/* TextInput */}
            <InputArea
              name={inputText.name2}
              content={task.Title}
              editableState={inputText.disable}
            ></InputArea>
            {/* End of TextInput */}

            {/* Start date  */}
            {/* TextInput */}
            <InputArea
              name={inputText.name3}
              content={startDate}
              icon={inputText.icon3}
              editableState={inputText.disable}
            ></InputArea>

            {/* End of TextInput */}
            {/* End Date  */}
            {/* TextInput */}
            {dueDateVisible ? (
              <InputArea
                name={inputText.name5}
                icon={inputText.icon3}
                content={endDate}
                editableState={inputText.disable}
              ></InputArea>
            ) : null}

            {/* End of TextInput */}
            {/* Time */}
            {/* TextInput */}
            {timeVisible ? (
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  marginHorizontal: 20,
                  marginTop: 20,
                }}
              >
                {/* Start time */}
                <View
                  style={dueDateVisible ? { width: "55%" } : { width: "100%" }}
                >
                  <Text style={styles.timeTitle}>Start Time</Text>
                  <TouchableOpacity
                    style={[
                      styles.smallInputText,
                      dueDateVisible ? styles.width80 : null,
                    ]}
                  >
                    <Text style={styles.textInInputText}>{startTime}</Text>
                  </TouchableOpacity>
                </View>
                {dueDateVisible ? (
                  <View style={{ width: "45%" }}>
                    <Text style={styles.timeTitle}>End Time</Text>
                    <View>
                      <TouchableOpacity style={styles.smallInputText}>
                        <Text style={styles.textInInputText}>{endTime}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : null}
              </View>
            ) : null}

            <View>
              {/* Remind, End date and Assign to*/}
              <View style={styles.itemsEnable}>
                {/* Remind */}
                <View style={styles.rowEnable}>
                  <View style={styles.childRowEnable}>
                    <TouchableOpacity>
                      <MaterialIcons
                        name="access-alarm"
                        size={24}
                        color="black"
                        style={{ marginRight: 3 }}
                      />
                    </TouchableOpacity>
                    <Text style={styles.titleInEnableRow}>Remind</Text>
                  </View>
                  {remindVisible ? (
                    <View style={styles.childRowEnableMiddle}>
                      <Text style={styles.textInEnableRow}>{remindTime}</Text>
                      <TouchableOpacity>
                        <MaterialIcons
                          name="arrow-drop-down-circle"
                          size={24}
                          color="#363942"
                          style={{ padding: 3 }}
                        />
                      </TouchableOpacity>
                    </View>
                  ) : null}
                  <View style={styles.childRowEnable}>
                    <Switch
                      trackColor={{ false: "#767577", true: "#81b0ff" }}
                      value={remindVisible}
                      disabled={true}
                    />
                  </View>
                </View>
                {/* End of Remind */}
                {/* Due date */}
                <View style={styles.rowEnable}>
                  <View style={styles.childRowEnable}>
                    <Feather
                      name="calendar"
                      size={24}
                      color="#363942"
                      style={{ marginRight: 3 }}
                    />
                    <Text style={styles.titleInEnableRow}>End date</Text>
                  </View>
                  <View style={styles.childRowEnable}>
                    <Switch
                      trackColor={{ false: "#767577", true: "#81b0ff" }}
                      value={dueDateVisible}
                      disabled={true}
                    />
                  </View>
                </View>
                {/* End of due date */}
                {/* Inlcude time */}
                <View style={styles.rowEnable}>
                  <View style={styles.childRowEnable}>
                    <MaterialCommunityIcons
                      name="timer-sand-empty"
                      size={24}
                      color="black"
                    />
                    <Text style={styles.titleInEnableRow}>Include time</Text>
                  </View>
                  <View style={styles.childRowEnable}>
                    <Switch
                      trackColor={{ false: "#767577", true: "#81b0ff" }}
                      value={timeVisible}
                      disabled={true}
                    />
                  </View>
                </View>
                {/* End of Include time */}
                {/* Assign to */}
                <View style={styles.rowEnable}>
                  <View style={styles.childRowEnable}>
                    <MaterialIcons
                      name="people-outline"
                      size={24}
                      color="black"
                      style={{ marginRight: 3 }}
                    />
                    <Text style={styles.titleInEnableRow}>Assign to</Text>
                  </View>
                  <View style={styles.childRowEnable}>
                    <Switch
                      trackColor={{ false: "#767577", true: "#81b0ff" }}
                      value={assignVisible}
                      disabled={true}
                    />
                  </View>
                </View>
                {assignVisible ? (
                  <View>
                    {/* inputText */}
                    <View style={styles.inputText}>
                      <TextInput
                        style={styles.textInInputText}
                        placeholderTextColor={Colors.placeholder}
                        editable={false}
                      >
                        {assignee}
                      </TextInput>
                    </View>
                  </View>
                ) : null}
              </View>
              {/* End of Remind, End date and Assign to */}
              {/* Description */}
              <View style={{ flex: 60, backgroundColor: "white" }}>
                <Text style={styles.smallTitle}>Description</Text>
                <View style={styles.noteBox}>
                  {/* Load dữ liệu lên */}
                  <TextInput
                    style={styles.textInNoteBox}
                    multiline={true}
                    placeholderTextColor={Colors.placeholder}
                    editable={false}
                  >
                    {task.Description}
                  </TextInput>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Animated.ScrollView>
      <View style={styles.createTask}>
        {/*Btn Create Task */}
        <TouchableOpacity onPress={handleDeleteTask}>
          <View style={styles.btnDeleteTask}>
            <Text style={styles.textInBtnDeleteTask}>Delete this task</Text>
          </View>
        </TouchableOpacity>
      </View>
      <PopupModal
        visible={modalVisible}
        type={popupType}
        title={popupTitle}
        message={popupMessage}
        onClose={closeModal}
      />
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
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
  textHeader: {
    color: "#3379E4",
    fontWeight: "500",
    fontSize: 18,
  },
  inputText: {
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    marginHorizontal: 20,
    marginVertical: 10,
    alignItems: "center",
    padding: 10,
    flexDirection: "row",
    shadowColor: "gray",
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 2,
      height: 2,
    },
  },
  smallInputText: {
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
    padding: 10,
    flexDirection: "row",
    shadowColor: "gray",
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    height: 38,
  },
  width80: {
    width: "80%",
  },

  textInInputText: {
    fontSize: 16,
    width: "90%",
  },
  inputTextWithTime: {
    display: "flex",
    flexDirection: "row",
  },
  timeTitle: {
    color: "#363942",
    fontSize: 12,
    fontWeight: "bold",
    shadowColor: "gray",
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 2,
      height: 2,
    },
  },
  itemsEnable: {
    display: "flex",
    flexDirection: "column",
    marginTop: 5,
  },
  childRowEnable: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  rowEnable: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginTop: 15,
  },
  childRowEnableMiddle: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  textInEnableRow: {
    color: "#363942",
    fontSize: 12,
    fontWeight: "500",
  },
  titleInEnableRow: {
    color: "#363942",
    fontSize: 12,
    fontWeight: "bold",
    shadowColor: "gray",
    shadowOpacity: 0.3,
    shadowOffset: {
      width: 2,
      height: 2,
    },
  },
  createTask: {
    position: "relative",
    width: "100%",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "white",
    zIndex: 1000,
    elevation: 1000,
  },
  btnDeleteTask: {
    backgroundColor: "#E7272D",
    borderRadius: 10,
    marginHorizontal: 20,
    marginVertical: 20,
    alignItems: "center",
    padding: 15,
    shadowColor: "gray",
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 2,
      height: 2,
    },
  },
  textInBtnDeleteTask: {
    color: "#F8F6FF",
    fontWeight: "bold",
    fontSize: 16,
  },
  smallTitle: {
    color: "#363942",
    fontSize: 12,
    fontWeight: "bold",
    marginHorizontal: 20,
    marginTop: 20,
    marginVertical: 10,
    shadowColor: "gray",
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 2,
      height: 2,
    },
  },
  noteBox: {
    backgroundColor: "#F5F5F5",
    marginTop: 5,
    marginBottom: 10,
    height: 340,
    borderRadius: 10,
    marginHorizontal: 15,
    shadowColor: "gray",
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 2,
      height: 2,
    },
  },
  textInNoteBox: {
    fontSize: 16,
    marginBottom: "auto",
    marginTop: 5,
    marginLeft: 15,
    marginRight: "auto",
    height: 340,
    width: "90%",
  },
});

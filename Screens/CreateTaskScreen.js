import { setStatusBarBackgroundColor } from "expo-status-bar";
import {
  View,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  TextInputProps,
  StatusBar,
  Animated,
  ScrollView,
  KeyboardAvoidingView,
  Switch,
} from "react-native";
import React, {
  Component,
  useEffect,
  useRef,
  useState,
  useContext,
} from "react";
import {
  Feather,
  MaterialCommunityIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import Header from "../components/HeaderWithTextAndAvatar";

import { MaterialIcons } from "@expo/vector-icons";
import InputArea from "../components/InputAreaForTask";
import { Colors } from "react-native/Libraries/NewAppScreen";
import UserAvatar from "@muhzi/react-native-user-avatar";
import { SelectList } from "react-native-dropdown-select-list";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { db } from "../components/FirestoreConfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  serverTimestamp,
  addDoc,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { UserContext, UserProvider } from "../contextObject";
import PopupModal from "./../components/PopUpNotify";

const CONTAINER_HEIGHT = 80;
const inputText = {
  name2: "Title",
};
export default function CreateTaskScreen({ navigation }) {
  const { userId } = useContext(UserContext);
  const [task, setTask] = useState(null);
  const [projectName, setProjectName] = useState(""); // Add state for project name
  const [IDProject, setIDProject] = useState("");
  const [projectNameData, setProjectNameData] = useState([]);
  const [selectedProject, setSelectedProject] = React.useState(""); // Add state for project name
  const [startTime, setStartTime] = useState(null); // Add a state for start date
  const [endTime, setEndTime] = useState(null);
  const [dueDateVisible, setDueDateVisible] = useState(false); // Due date
  const [timeVisible, setTimeVisible] = useState(false); //Include time
  //Remind
  const [remindVisible, setRemindVisible] = useState(false); //Remind enable
  const [remindTime, setRemindTime] = useState(null);
  const [idRemind, setIDRemind] = useState("");
  const [selectedRemind, setSelectedRemind] = React.useState("");

  //Assign
  const [assignee, setAssignee] = useState("");
  const [IDAssignee, setIDAssignee] = useState("");
  const [assigneeNameData, setAssigneeNameData] = useState([]); // Add state for assignee name
  const [assignVisible, setAssignVisible] = useState(false);
  const [assignDisable, setAssignDisable] = useState(true);

  const [selectedAssignee, setSelectedAssignee] = React.useState("");

  const [selectedStartDate, setSelectedStartDate] = useState("");
  const [selectedEndDate, setSelectedEndDate] = useState("");
  const remindOptions = [
    { key: "0", value: "On day of event" },
    { key: "1", value: "1 days before" },
    { key: "2", value: "2 days before" },
    { key: "3", value: "7 days before" },
    // ...Thêm các giá trị khác vào đây
  ];
  const handleTitleChange = (value) => {
    setNewTitle(value); // Cập nhật giá trị mới khi người dùng thay đổi trong InputArea
  };
  const handleDescriptionChange = (value) => {
    setNewDescription(value);
  };
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
    setSelectedStartDate(formattedDate);
  }, []);

  useEffect(() => {
    const fetchProjectNames = async () => {
      try {
        const projectSnapshot = await getDocs(collection(db, "Project"));
        const projectData = projectSnapshot.docs.map((doc) => {
          const project = doc.data();
          return { key: doc.id, value: project.ProjectName };
        });
        setProjectNameData(projectData);
      } catch (error) {
        console.error("Error fetching project names: ", error);
      }
    };

    fetchProjectNames();
  }, []);
  const handleProjectChange = async (selectedProject) => {
    const SelectedProject = parseInt(selectedProject);
    setSelectedProject(SelectedProject);
    try {
      const q_projectUser = query(
        collection(db, "Project_User"),
        where("ProjectID", "==", SelectedProject)
      );
      const projectUserSnapshot = await getDocs(q_projectUser);
      const assigneeIDs = projectUserSnapshot.docs.map(
        (doc) => doc.data().AssigneeID
      );
      if (assigneeIDs.length > 0) {
        const q_user = query(
          collection(db, "User"),
          where("UserID", "in", assigneeIDs)
        );
        const userSnapshot = await getDocs(q_user);

        const assigneeNames = userSnapshot.docs.map((doc) => {
          const assignee = doc.data();
          return { key: doc.id, value: assignee.Name };
        });

        setAssigneeNameData(assigneeNames);
        setAssignDisable(false);
      } else {
        setAssignDisable(true);
        setAssigneeNameData([]);
      }
    } catch (error) {
      console.error("Error fetching assignee name: ", error);
    }
  };

  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const handleCreateTask = async () => {
    console.log("selectedStartDate", selectedStartDate);
    console.log("selectedEndDate", selectedEndDate);
    console.log("startTime", startTime);
    console.log("endTime", endTime);
    console.log("selectedRemind", selectedRemind);
    try {
      const startDateTime = new Date(
        `${selectedStartDate} ${startTime || "09:00 AM"}`
      );

      let endDateTime = null;
      let Remind = null;

      // Set the default value of endDateTime as startDateTime plus 7 days
      const defaultEndDateTime = new Date(startDateTime);
      defaultEndDateTime.setDate(defaultEndDateTime.getDate() + 7);

      // Update endDateTime if it is null or undefined
      if (dueDateVisible) {
        if (timeVisible) {
          endDateTime = new Date(`${selectedEndDate} ${endTime || "09:00 AM"}`);
        } else {
          endDateTime = new Date(`${selectedEndDate} 09:00 AM`);
        }
        if (remindVisible) {
          if (selectedRemind === "0") {
            Remind = new Date(endDateTime);
            setRemindTime(Remind);
          } else if (selectedRemind === "1") {
            Remind = new Date(endDateTime);
            Remind.setDate(Remind.getDate() - 1);
            setRemindTime(Remind);
          } else if (selectedRemind === "2") {
            Remind = new Date(endDateTime);
            Remind.setDate(Remind.getDate() - 2);
            setRemindTime(Remind);
          } else if (selectedRemind === "3") {
            Remind = new Date(endDateTime);
            Remind.setDate(Remind.getDate() - 7);
            setRemindTime(Remind);
          }
        }
      } else {
        endDateTime = defaultEndDateTime;
      }
      console.log("startDateTime", startDateTime);
      console.log("endDateTime", endDateTime);
      console.log("Remind", Remind);
      const tasksSnapshot = await getDocs(collection(db, "Task"));
      const existingTasks = tasksSnapshot.docs.map((doc) => doc.data());
      // Tìm taskID lớn nhất trong danh sách
      const maxTaskID = Math.max(
        ...existingTasks.map((task) => parseInt(task.TaskID))
      );
      console.log("maxTaskID", maxTaskID);
      const newTaskID = maxTaskID + 1;
      //THÊM TASK MỚI
      const taskRef = doc(collection(db, "Task"), newTaskID.toString());
      console.log("Task created with ID: ", taskRef.id);
      //Create at
      const timestamp = new Date();
      //Status
      const status = "On Progress";
      //ImportantTask
      const isDefault = false;
      // Thực hiện các hành động khác sau khi thêm task thành công
      await setDoc(taskRef, {
        // Document data
        AssignTo: assignVisible,
        CreatedAt: timestamp,
        CreatorID: userId,
        Description: newDescription,
        DueTime: endDateTime,
        ImportantTask: isDefault,
        IncludeEndDate: dueDateVisible,
        IncludeTime: timeVisible,
        Remind: remindVisible,
        RemindTime: Remind,
        StartTime: startDateTime,
        Status: status,
        TaskID: newTaskID,
        Title: newTitle,
        // ...
      });
      if (selectedProject) {
        //THÊM PROJECT_TASK MỚI
        const projectTaskSnapshot = await getDocs(
          collection(db, "Project_Task")
        );
        const existingProjectTask = projectTaskSnapshot.docs.map((doc) =>
          doc.data()
        );
        // Tìm projectTaskID lớn nhất trong danh sách
        const maxProjectTaskID = Math.max(
          ...existingProjectTask.map((projectTask) =>
            parseInt(projectTask.itemID)
          )
        );
        console.log("maxProjectTaskID", maxProjectTaskID);
        const newProjectTaskID = maxProjectTaskID + 1;

        const projectTaskRef = doc(
          collection(db, "Project_Task"),
          newProjectTaskID.toString()
        );
        console.log("ProjectTask created with ID: ", projectTaskRef.id);

        await setDoc(projectTaskRef, {
          // Document data
          ProjectID: selectedProject,
          TaskID: newTaskID,
          itemID: newProjectTaskID,
          // ...
        });
        if (assignVisible) {
          //THÊM TASK_USER MỚI
          const taskUserSnapshot = await getDocs(collection(db, "Task_User"));
          const existingTaskUser = taskUserSnapshot.docs.map((doc) =>
            doc.data()
          );
          // Tìm projectTaskID lớn nhất trong danh sách
          const maxTaskUserID = Math.max(
            ...existingTaskUser.map((taskUser) => parseInt(taskUser.itemID))
          );
          console.log("maxTaskUserID", maxTaskUserID);
          const newTaskUserkID = maxTaskUserID + 1;

          const taskUserRef = doc(
            collection(db, "Task_User"),
            newTaskUserkID.toString()
          );
          console.log("TaskUser created with ID: ", taskUserRef.id);
          const assigneeID = parseInt(selectedAssignee);
          await setDoc(taskUserRef, {
            // Document data
            AssigneeID: assigneeID,
            TaskID: newTaskID,
            itemID: newTaskUserkID,
            // ...
          });
        } else {
          const taskUserSnapshot = await getDocs(collection(db, "Task_User"));
          const existingTaskUser = taskUserSnapshot.docs.map((doc) =>
            doc.data()
          );
          // Tìm projectTaskID lớn nhất trong danh sách
          const maxTaskUserID = Math.max(
            ...existingTaskUser.map((taskUser) => parseInt(taskUser.itemID))
          );
          console.log("maxTaskUserID", maxTaskUserID);
          const newTaskUserkID = maxTaskUserID + 1;

          const taskUserRef = doc(
            collection(db, "Task_User"),
            newTaskUserkID.toString()
          );
          console.log("TaskUser created with ID: ", taskUserRef.id);
          const assigneeID = parseInt(selectedAssignee);
          await setDoc(taskUserRef, {
            // Document data
            AssigneeID: userId,
            TaskID: newTaskID,
            itemID: newTaskUserkID,
            // ...
          });
        }
      }
      openModal("success", "Task created");
    } catch (error) {
      console.error("Error creating task: ", error);
      openModal("error", "Error creating task");
      // Xử lý lỗi nếu có
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

    navigation.goBack();
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

  // Calendar
  // Date
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
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
    setSelectedDate(formattedDate);
  }, []);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleStartDateConfirm = (date) => {
    // console.warn("A date has been picked: ", date);

    // Có 2 cách để hiển thị date dd/mm/yyyy
    // const dt = new Date(date);
    // const x = dt.toISOString().split("T");
    // const x1 = x[0].split("-");
    // console.log(x1[2] + "/" + x1[1] + "/" + x1[0]);
    // setSelectedDate(x1[2] + "/" + x1[1] + "/" + x1[0]);

    // Hoặc hiển thị theo giờ Mỹ
    const dt = new Date(date);
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const x = dt.toLocaleDateString("en-US", options);
    setSelectedStartDate(x);
    hideDatePicker();
  };
  // End date
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);
  const showEndDatePicker = () => {
    setEndDatePickerVisibility(true);
  };

  const hideEndDatePicker = () => {
    setEndDatePickerVisibility(false);
  };

  const handleEndDateConfirm = (date) => {
    // console.warn("A date has been picked: ", date);
    // Có 2 cách hiển thị date

    // Cách 1
    // const dt = new Date(date);
    // const x = dt.toISOString().split("T");
    // const x1 = x[0].split("-");
    // console.log(x1[2] + "/" + x1[1] + "/" + x1[0]);
    // setSelectedEndDate(x1[2] + "/" + x1[1] + "/" + x1[0]);
    // Cách 2
    const dt = new Date(date);
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const x = dt.toLocaleDateString("en-US", options);

    setSelectedEndDate(x);
    hideEndDatePicker();
  };
  // Start time
  const [isStartTimePickerVisible, setStartTimePickerVisibility] =
    useState(false);
  const [currentDate, setCurrentDate] = useState("");

  const showStartTimePicker = () => {
    setStartTimePickerVisibility(true);
  };

  const hideStartTimePicker = () => {
    setStartTimePickerVisibility(false);
  };
  const handleStartTimeConfirm = (date) => {
    const dt = new Date(date);
    const x = dt.getHours() + ":" + dt.getMinutes();
    console.log(x);
    setStartTime(x);
    hideStartTimePicker();
  };
  // End Time
  const [isEndTimePickerVisible, setEndTimePickerVisibility] = useState(false);
  const showEndTimePicker = () => {
    setEndTimePickerVisibility(true);
  };

  const hideEndTimePicker = () => {
    setEndTimePickerVisibility(false);
  };
  const handleEndTimeConfirm = (date) => {
    const dt = new Date(date);
    const x = dt.getHours() + ":" + dt.getMinutes();
    console.log(x);
    setEndTime(x);
    hideEndTimePicker();
  };
  // End of calendar
  // Toggle Button
  // Remind
  const [isEnableRemind, setIsEnableRemind] = useState(false);
  // Hide an Element
  const toggleSwitchRemind = () => {
    if (isEnableRemind) {
      setRemindVisible(false);
    } else {
      setRemindVisible(true);
    }
    setIsEnableRemind((previousState) => !previousState);
  };
  // Due date
  const [isEnableDueDate, setIsEnableDueDate] = useState(false);
  const appearDuedate = useRef(new Animated.Value(0)).current;

  const toggleSwitchDueDate = () => {
    if (isEnableDueDate) {
      setDueDateVisible(false);
    } else {
      setDueDateVisible(true);
      Animated.timing(appearDuedate, {
        toValue: dueDateVisible ? 1 : 0,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }

    setIsEnableDueDate((previousState) => !previousState);
  };

  // Include time
  const [isEnableTime, setIsEnableTime] = useState(false);

  const toggleSwitchTime = () => {
    if (isEnableTime) {
      setTimeVisible(false);
    } else {
      setTimeVisible(true);
    }
    setIsEnableTime((previousState) => !previousState);
  };
  // Assign to
  const [isEnableAssign, setIsEnableAssign] = useState(false);

  const toggleSwitchAssign = () => {
    if (isEnableAssign) {
      setAssignVisible(false);
    } else {
      setAssignVisible(true);
    }
    setIsEnableAssign((previousState) => !previousState);
  };
  // End of Toggle Button

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      enabled
      keyboardVerticalOffset={Platform.select({ ios: 0, android: 500 })}
    >
      <View style={styles.container}>
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
              <SimpleLineIcons name="arrow-left" size={30} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerBehave}
              onPress={() => navigation.navigate("AccountFeature")}
            >
              <UserAvatar
                initialName="SK"
                fontSize={15}
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
          <View>
            <View
              style={{
                marginTop: 80,
              }}
            >
              {/* Project Name */}
              {/* TextInput */}
              <View>
                <Text style={styles.title}>Project</Text>
                <View style={{ marginHorizontal: 20, marginTop: 10 }}>
                  <SelectList
                    setSelected={handleProjectChange}
                    data={projectNameData}
                    save="key"
                    boxStyles={{
                      backgroundColor: "#F5F5F5",
                      borderRadius: 10,
                      shadowColor: "gray",
                      shadowOpacity: 0.5,
                      shadowOffset: {
                        width: 2,
                        height: 2,
                      },
                      borderWidth: "0",
                    }}
                    maxHeight={200}
                  />
                </View>

                {/* inputText */}
              </View>

              {/* End of TextInput */}

              {/* Title name */}
              {/* TextInput */}
              <InputArea
                onInputChange={(value) => setNewTitle(value)}
                value={newTitle}
                name={inputText.name2}
                content={newTitle}
                onChange={handleTitleChange}
              ></InputArea>

              {/* End of TextInput */}

              {/* Date  */}
              {/* TextInput */}
              <View>
                <Text style={styles.title}>Start date</Text>
                {/* inputText */}
                <View style={styles.inputText}>
                  <TextInput
                    value={
                      selectedStartDate
                        ? selectedStartDate.toLocaleString()
                        : ""
                    }
                    style={styles.textInInputText}
                    onChangeText={(text) => setSelectedStartDate(text)}
                  />
                  <TouchableOpacity onPress={showDatePicker}>
                    {/* Icon */}
                    <MaterialIcons
                      name="calendar-today"
                      size={24}
                      color="#363942"
                      title="DatePicker"
                    />
                  </TouchableOpacity>
                </View>
                <DateTimePickerModal
                  display="spinner"
                  isVisible={isDatePickerVisible}
                  mode="date"
                  onConfirm={handleStartDateConfirm}
                  onCancel={hideDatePicker}
                />
              </View>
              {/* End of TextInput */}
              {/* End Date  */}
              {/* TextInput */}
              {dueDateVisible ? (
                <View>
                  <Text style={styles.title}>Due date</Text>
                  {/* inputText */}
                  <View style={styles.inputText}>
                    <TextInput
                      value={
                        selectedEndDate ? selectedEndDate.toLocaleString() : ""
                      }
                      editable={false}
                      style={styles.textInInputText}
                      onChangeText={(text) => setSelectedEndDate(text)}
                    />
                    <TouchableOpacity onPress={showEndDatePicker}>
                      {/* Icon */}
                      <MaterialIcons
                        name="calendar-today"
                        size={24}
                        color="#363942"
                        title="EndDatePicker"
                      />
                    </TouchableOpacity>
                  </View>
                  <DateTimePickerModal
                    isVisible={isEndDatePickerVisible}
                    mode="date"
                    onConfirm={handleEndDateConfirm}
                    onCancel={hideEndDatePicker}
                  />
                </View>
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
                    style={
                      dueDateVisible ? { width: "55%" } : { width: "100%" }
                    }
                  >
                    <Text style={styles.timeTitle}>Start Time</Text>
                    <TouchableOpacity
                      style={[
                        styles.smallInputText,
                        dueDateVisible ? styles.width80 : null,
                      ]}
                      onPress={showStartTimePicker}
                    >
                      <TextInput
                        value={startTime ? startTime.toLocaleString() : ""}
                        style={styles.textInInputText}
                        editable={false}
                        onChangeText={(text) => setStartTime(text)}
                      />
                    </TouchableOpacity>
                    <DateTimePickerModal
                      isVisible={isStartTimePickerVisible}
                      mode="time"
                      onConfirm={handleStartTimeConfirm}
                      onCancel={hideStartTimePicker}
                    />
                  </View>
                  {dueDateVisible ? (
                    <View style={{ width: "45%" }}>
                      <Text style={styles.timeTitle}>End Time</Text>
                      <View>
                        <TouchableOpacity
                          style={styles.smallInputText}
                          onPress={showEndTimePicker}
                        >
                          <TextInput
                            value={endTime ? endTime.toLocaleString() : ""}
                            style={styles.textInInputText}
                            editable={false}
                            onChangeText={(text) => setEndTime(text)}
                          />
                        </TouchableOpacity>
                        <DateTimePickerModal
                          isVisible={isEndTimePickerVisible}
                          mode="time"
                          onConfirm={handleEndTimeConfirm}
                          onCancel={hideEndTimePicker}
                        />
                      </View>
                    </View>
                  ) : null}
                </View>
              ) : null}

              {/* End time */}

              {/* End of TextInput */}

              {/* Remind, End date and Assign to*/}
              <View style={styles.itemsEnable}>
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
                      onValueChange={toggleSwitchDueDate}
                      value={isEnableDueDate}
                    />
                  </View>
                </View>
                {/* End of due date */}
                {/* Include time */}
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
                      onValueChange={toggleSwitchTime}
                      value={isEnableTime}
                    />
                  </View>
                </View>
                {/* End of Include time */}
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

                  <View style={styles.childRowEnable}>
                    <Switch
                      trackColor={{ false: "#767577", true: "#81b0ff" }}
                      onValueChange={toggleSwitchRemind}
                      value={remindVisible}
                      disabled={dueDateVisible ? false : true}
                    />
                  </View>
                </View>
                {remindVisible ? (
                  <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
                    <SelectList
                      setSelected={setSelectedRemind}
                      data={remindOptions}
                      save="key"
                      boxStyles={{
                        backgroundColor: "#F5F5F5",
                        borderRadius: 10,
                        shadowColor: "gray",
                        shadowOpacity: 0.5,
                        shadowOffset: {
                          width: 2,
                          height: 2,
                        },
                        borderWidth: "0",
                      }}
                      maxHeight={200}
                    />
                  </View>
                ) : null}
                {/* End of Remind */}
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
                      onValueChange={toggleSwitchAssign}
                      value={assignVisible}
                      disabled={assignDisable}
                    />
                  </View>
                </View>
                <View>
                  {/* inputText */}
                  {assignVisible ? (
                    <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
                      <SelectList
                        setSelected={setSelectedAssignee}
                        data={assigneeNameData}
                        save="key"
                        boxStyles={{
                          backgroundColor: "#F5F5F5",
                          borderRadius: 10,
                          shadowColor: "gray",
                          shadowOpacity: 0.5,
                          shadowOffset: {
                            width: 2,
                            height: 2,
                          },
                          borderWidth: "0",
                        }}
                        maxHeight={200}
                      />
                    </View>
                  ) : null}
                </View>
              </View>
              {/* End of Remind, End date and Assign to */}
              {/* Description */}
              <View style={{ flex: 60, backgroundColor: "white" }}>
                <Text style={styles.smallTitle}>Description</Text>
                <TouchableOpacity style={styles.noteBox}>
                  <TextInput
                    style={styles.textInNoteBox}
                    multiline={true}
                    placeholder="Your description here"
                    placeholderTextColor={Colors.placeholder}
                    onChangeText={(value) => handleDescriptionChange(value)}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Animated.ScrollView>
        <View style={styles.createTask}>
          {/*Btn Create Task */}
          <TouchableOpacity style={styles.button} onPress={handleCreateTask}>
            <Text style={styles.textInButton}>Create a new task</Text>
          </TouchableOpacity>
        </View>
        <PopupModal
          visible={modalVisible}
          type={popupType}
          title={popupTitle}
          message={popupMessage}
          onClose={closeModal}
        />
      </View>
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
    fontSize: 12,
    fontWeight: "bold",
    marginHorizontal: 20,
    marginTop: 20,
    shadowColor: "gray",
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 2,
      height: 2,
    },
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
    paddingTop: 0,
    fontSize: 16,
    flex: 1,
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
  btnCreateTask: {
    backgroundColor: "#4B7BE5",
    borderRadius: 10,
    marginHorizontal: 30,
    marginVertical: 20,
    alignItems: "center",
    padding: 15,
  },
  textInBtnCreateTask: {
    color: "#F8F6FF",
    fontWeight: "bold",
    fontSize: 16,
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
  smallTitle: {
    color: "#363942",
    fontSize: 12,
    fontWeight: "bold",
    marginHorizontal: 20,
    marginTop: 20,
    shadowColor: "gray",
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 2,
      height: 2,
    },
  },
  noteBox: {
    backgroundColor: "#F5F5F5",
    marginTop: 10,
    marginBottom: 10,
    height: 340,
    borderRadius: 10,
    shadowColor: "gray",
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

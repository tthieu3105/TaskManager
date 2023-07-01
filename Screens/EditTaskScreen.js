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
  Switch,
  ActivityIndicator,
} from "react-native";
import React, {
  Component,
  useEffect,
  useRef,
  useState,
  useContext,
} from "react";
import { Feather, SimpleLineIcons } from "@expo/vector-icons";
import Header from "../components/HeaderWithTextAndIcon";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import InputArea from "../components/InputAreaForTask";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { SelectList } from "react-native-dropdown-select-list";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { firebase } from "../components/FirebaseConfig";
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
  deleteDoc,
} from "firebase/firestore";
import { UserContext, UserProvider } from "../contextObject";

const CONTAINER_HEIGHT = 80;
const inputText = {
  name1: "Project",
  name2: "Title",
  name3: "Date",
  name4: "Description",
  icon1: "arrow-drop-down-circle",
  icon3: "calendar-today",
  hintText: "Enter Username or Email",
};
export default function EditTaskScreen({ navigation, route }) {
  const { userId } = useContext(UserContext);
  //Lấy taskID từ màn hình TaskInfo
  const { taskID, refreshTaskInfoScreen } = route.params;
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
  const [remindTime, setRemindTime] = useState("");
  const [idRemind, setIDRemind] = useState("");
  const [selectedRemind, setSelectedRemind] = React.useState("");

  //Assign
  const [assignee, setAssignee] = useState("");
  const [IDAssignee, setIDAssignee] = useState("");
  const [assigneeNameData, setAssigneeNameData] = useState([]); // Add state for assignee name
  const [assignVisible, setAssignVisible] = useState(false);
  const [selectedAssignee, setSelectedAssignee] = React.useState("");
  const [assignDisable, setAssignDisable] = useState(true);

  const [selectedStartDate, setSelectedStartDate] = useState("");
  const [selectedEndDate, setSelectedEndDate] = useState("");

  //Các trường cần cập nhật dữ liệu
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const remindOptions = [
    { key: "0", value: "On day of event" },
    { key: "1", value: "1 days before" },
    { key: "2", value: "2 days before" },
    { key: "3", value: "7 days before" },
    // ...Thêm các giá trị khác vào đây
  ];
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
          setSelectedStartDate(startDate); // Set the startDate state here
          setStartTime(startTime);
          // Set giá trị includeEndDate, includeTime, Remind
          const includeEndDate = taskData.IncludeEndDate;
          const includeTime = taskData.IncludeTime;
          const remind = taskData.Remind;
          const assignTo = taskData.AssignTo;
          //In ra kiểu dữ liệu của thuộc tính taskID mà truyền vào
          console.log("Type of taskID:", typeof taskID); //string
          //Chuyển kiểu dữ liệu sang int do thuộc tính TaskID trong Firestore là int
          const task_ID = parseInt(taskID);
          setDueDateVisible(includeEndDate);
          setTimeVisible(includeTime);
          setRemindVisible(remind);
          setAssignVisible(assignTo);
          setAssignDisable(!assignVisible);
          //Tách thuộc tính DueDate và DueTime
          if (includeEndDate) {
            const endDay = taskData.DueTime.toDate();
            const endDate = endDay.toLocaleDateString("en-US", options);
            const endTime = endDay.toLocaleTimeString();
            setSelectedEndDate(endDate); // Set the endDate state here
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
            let selectedId;

            if (daysDiff === 0) {
              selectedOption = "On day of event";
              selectedId = 0;
            } else {
              const selectedOptionObject = remindOptions.find(
                (option) => parseInt(option.value) === daysDiff
              );
              if (selectedOptionObject) {
                selectedOption = selectedOptionObject.value;
                selectedId = selectedOptionObject.key;
              }
              console.log("selectedId", selectedId);
              console.log("selectedOption", selectedOption);
              console.log("selectedOptionObject", selectedOptionObject);
            }

            setRemindTime(selectedOption);
            setIDRemind(selectedId);
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
              setIDProject(projectID);
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
                console.log(" assigneeID:", assigneeID); //number
                // Fetch assignee name from Project table

                const userSnapshot = await getDoc(
                  doc(db, "User", assigneeID.toString())
                );

                if (userSnapshot.exists()) {
                  const userData = userSnapshot.data();
                  const userName = userData.Name;
                  setAssignee(userName);
                  setIDAssignee(assigneeID);
                }
              }
              //Fetch all Assignee's name
              const q_projectUser = query(
                collection(db, "Project_User"),
                where("ProjectID", "==", projectID)
              );
              const projectUserSnapshot = await getDocs(q_projectUser);

              const assigneeIDs = projectUserSnapshot.docs.map(
                (doc) => doc.data().AssigneeID
              );

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
            }
          }
          //Fetch all Project's name
          const q_project = query(
            collection(db, "Project"),
            where("CreatorID", "==", userId)
          );
          const projectNameSnapshot = await getDocs(q_project);

          const projectData = projectNameSnapshot.docs.map((doc) => {
            const project = doc.data();
            return { key: doc.id, value: project.ProjectName };
          });

          setProjectNameData(projectData);

          //Set giá trị ban đầu và thực hiện cập nhật khi có thay đổi
          const NewTitle = taskData.Title;
          setNewTitle(NewTitle);
          const NewDescription = taskData.Description;
          setNewDescription(NewDescription);
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
  //Lấy danh sách assignee dựa vào tên project
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
        setAssigneeNameData([]);
        setAssignDisable(true);
        setAssignVisible(false);
      }
    } catch (error) {
      console.error("Error fetching assignee name: ", error);
    }
  };
  //Cập nhật dữ liệu
  //Title
  const handleTitleChange = (value) => {
    setNewTitle(value); // Cập nhật giá trị mới khi người dùng thay đổi trong InputArea
  };
  // Description
  const handleDescriptionChange = (value) => {
    setNewDescription(value);
  };
  const handleDonePress = async () => {
    try {
      //Cập nhật bảng Task
      // Chuyển đổi startDate và startTime thành đối tượng Date
      const startDateTime = new Date(
        `${selectedStartDate} ${timeVisible ? startTime : "09:00 AM"}`
      );
      let endDateTime = null;
      // Set the default value of endDateTime as startDateTime plus 7 days
      const defaultEndDateTime = new Date(startDateTime);
      defaultEndDateTime.setDate(defaultEndDateTime.getDate() + 7);

      // Update endDateTime if it is null or undefined
      if (dueDateVisible) {
        endDateTime = new Date(
          `${selectedEndDate} ${timeVisible ? endTime : "09:00 AM"}`
        );
      } else {
        endDateTime = defaultEndDateTime;
      }

      // Cập nhật giá trị trong Firestore
      await updateDoc(doc(db, "Task", taskID), {
        // Các trường cần cập nhật và giá trị mới
        Title: newTitle,
        Remind: remindVisible,
        IncludeEndDate: dueDateVisible,
        IncludeTime: timeVisible,
        AssignTo: assignVisible,
        Description: newDescription,
        StartTime: startDateTime,
        DueTime: endDateTime,
        // Các trường khác...
      });
      //Cập nhật bảng Project_Task
      const idProject = parseInt(selectedProject);
      console.log("taskID", taskID);
      console.log("taskID", typeof taskID); //string
      const task_ID = parseInt(taskID);
      // Cập nhật bảng Project_Task
      const projectTaskRef = collection(db, "Project_Task");
      const q_projectTask = query(
        projectTaskRef,
        where("TaskID", "==", task_ID)
      );

      const projectTaskSnapshot = await getDocs(q_projectTask);

      const projectTaskId = projectTaskSnapshot.docs[0].data().itemID;

      // Perform the update for each record in the Project_Task collection
      await updateDoc(doc(db, "Project_Task", projectTaskId.toString()), {
        ProjectID: idProject,
        // ...
      });

      if (assignVisible) {
        //Cập nhật bảng Task_User
        const idAssignee = parseInt(selectedAssignee);

        // Cập nhật bảng Task_User
        let taskUserRef = collection(db, "Task_User");
        const q_taskUser = query(taskUserRef, where("TaskID", "==", task_ID));

        const taskUserSnapshot = await getDocs(q_taskUser);

        const taskUserId = taskUserSnapshot.docs[0].data().itemID;
        console.log("taskUserId", taskUserId);
        console.log("taskUserId", typeof taskUserId);

        await updateDoc(doc(db, "Task_User", taskUserId.toString()), {
          AssigneeID: idAssignee,
        });
      } else {
        // Cập nhật bảng Task_User
        let taskUserRef = collection(db, "Task_User");
        const q_taskUser = query(taskUserRef, where("TaskID", "==", task_ID));

        const taskUserSnapshot = await getDocs(q_taskUser);

        const taskUserId = taskUserSnapshot.docs[0].data().itemID;
        console.log("taskUserId", taskUserId);
        console.log("taskUserId", typeof taskUserId);

        await updateDoc(doc(db, "Task_User", taskUserId.toString()), {
          AssigneeID: userId,
        });
      }

      console.log("Cập nhật thành công");
      // Thực hiện các hành động khác sau khi cập nhật thành công
    } catch (error) {
      console.log("Lỗi khi cập nhật:", error);
      // Xử lý lỗi nếu có
    }
    refreshTaskInfoScreen();
    navigation.goBack();
    // navigation.replace("T")
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
  const [isEnableRemind, setIsEnableRemind] = useState(remindVisible);
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
  const [isEnableDueDate, setIsEnableDueDate] = useState(dueDateVisible);

  const toggleSwitchDueDate = () => {
    if (isEnableDueDate) {
      setDueDateVisible(false);
    } else {
      setDueDateVisible(true);
    }
    setIsEnableDueDate((previousState) => !previousState);
  };
  // End date
  // Time
  const [isEnableTime, setIsEnableTime] = useState(timeVisible);

  const toggleSwitchTime = () => {
    if (isEnableTime) {
      setTimeVisible(false);
    } else {
      setTimeVisible(true);
    }
    setIsEnableTime((previousState) => !previousState);
  };
  // End of Time
  // Assign to
  const [isEnableAssign, setIsEnableAssign] = useState(assignVisible);

  const toggleSwitchAssign = () => {
    if (isEnableAssign) {
      setAssignVisible(false);
    } else {
      setAssignVisible(true);
    }
    setIsEnableAssign((previousState) => !previousState);
  };
  // End of Toggle Button
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
        <View style={styles.rowSection}>
          <TouchableOpacity
            style={styles.headerBehave}
            onPress={() => navigation.goBack()}
          >
            <SimpleLineIcons name="arrow-left" size="20" color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerBehave}
            onPress={handleDonePress}
          >
            <Text style={styles.textHeader}>Done</Text>
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
                  defaultOption={{ key: IDProject, value: projectName }}
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
                    selectedStartDate ? selectedStartDate.toLocaleString() : ""
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
                  ></TextInput>
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
                  style={dueDateVisible ? { width: "55%" } : { width: "100%" }}
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

            <View>
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
                      value={dueDateVisible}
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
                      onValueChange={toggleSwitchTime}
                      value={timeVisible}
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
                      save="value"
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
                      defaultOption={{ key: idRemind, value: remindTime }}
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
                      disable={assignDisable}
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
                        defaultOption={{ key: IDAssignee, value: assignee }}
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
                  >
                    {newDescription}
                  </TextInput>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
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
  btnCreateTask: {
    backgroundColor: "#E7272D",
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
    marginBottom: 20,
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
  width80: {
    width: "80%",
  },
});

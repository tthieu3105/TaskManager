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
import React, { Component, useEffect, useRef, useState } from "react";
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

const CONTAINER_HEIGHT = 80;
const inputText = {
  name2: "Title",
};
export default function CreateTaskScreen({ navigation }) {
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

  // Drop down list
  const [selected, setSelected] = React.useState("");

  const data = [
    { key: "1", value: "Web design" },
    { key: "2", value: "Mobile" },
    { key: "3", value: "Cameras" },
    { key: "4", value: "Computers" },
    { key: "5", value: "Vegetables" },
    { key: "6", value: "Diary Products" },
    { key: "7", value: "Drinks" },
  ];
  // End of drop down list

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

  const handleDateConfirm = (date) => {
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
    setSelectedDate(x);
    hideDatePicker();
  };
  // End date
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);
  const [selectedEndDate, setSelectedEndDate] = useState("");
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
  const [startTime, setStartTime] = useState("");
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
  const [endTime, setEndTime] = useState("");
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
  const [remindVisible, setRemindVisible] = useState(false);
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

  const [dueDateVisible, setDueDateVisible] = useState(false);
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

  const [timeVisible, setTimeVisible] = useState(false);
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

  const [assignVisible, setAssignVisible] = useState(false);
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
                rounded={true}
                backgroundColors={["#4B7BE5"]}
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
                    setSelected={(val) => setSelected(val)}
                    data={data}
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
                      borderWidth: 0,
                    }}
                    maxHeight={200}
                  />
                </View>

                {/* inputText */}
              </View>

              {/* End of TextInput */}

              {/* Title name */}
              {/* TextInput */}
              <InputArea name={inputText.name2}></InputArea>

              {/* End of TextInput */}

              {/* Date  */}
              {/* TextInput */}
              <View>
                <Text style={styles.title}>Start date</Text>
                {/* inputText */}
                <View style={styles.inputText}>
                  <Text style={styles.textInInputText}>{selectedDate}</Text>
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
                  onConfirm={handleDateConfirm}
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
                    <Text style={styles.textInInputText}>
                      {selectedEndDate}
                    </Text>
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
                      <Text style={styles.textInInputText}>{startTime}</Text>
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
                          <Text style={styles.textInInputText}>{endTime}</Text>
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
                  <View style={styles.childRowEnableMiddle}>
                    {remindVisible ? (
                      <View style={styles.childRowEnable}>
                        <Text style={styles.textInEnableRow}>
                          1 days before
                        </Text>
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
                  </View>
                  <View style={styles.childRowEnable}>
                    <Switch
                      trackColor={{ false: "#767577", true: "#81b0ff" }}
                      onValueChange={toggleSwitchRemind}
                      value={isEnableRemind}
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
                      value={isEnableAssign}
                    />
                  </View>
                </View>
                <View>
                  {/* inputText */}
                  {assignVisible ? (
                    <View style={styles.inputText}>
                      <TextInput
                        style={styles.textInInputText}
                        multiline={true}
                        placeholder="Enter Username or Email"
                        placeholderTextColor={Colors.placeholder}
                      ></TextInput>
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
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Animated.ScrollView>
        <View style={styles.createTask}>
          {/*Btn Create Task */}
          <TouchableOpacity style={styles.button}>
            <Text style={styles.textInButton}>Create a new task</Text>
          </TouchableOpacity>
        </View>
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

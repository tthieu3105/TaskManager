import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Animated,
  FlatList,
} from "react-native";

import React, { Component, useRef } from "react";
import { useState, useEffect, useContext } from "react";
import { Colors } from "react-native/Libraries/NewAppScreen";
import AntDesign from "../node_modules/@expo/vector-icons/AntDesign";
import UserAvatar from "@muhzi/react-native-user-avatar";
import { MaterialIcons } from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Ionicons } from "@expo/vector-icons";
import Feather from "react-native-vector-icons/Feather";
import { UserContext, UserProvider } from "../contextObject";
import { db } from "../components/FirestoreConfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  setDoc,
  Timestamp,
} from "firebase/firestore";

const CONTAINER_HEIGHT = 80;

const AddProjectScreen = ({ navigation }) => {
  // Date
  const [isStartDatePickerVisible, setStartDatePickerVisibility] =
    useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState("");
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
    setSelectedEndDate(formattedDate);
  }, []);

  const showStartDatePicker = () => {
    setStartDatePickerVisibility(true);
  };

  const hideStartDatePicker = () => {
    setStartDatePickerVisibility(false);
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
    hideStartDatePicker();
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

  // insert project
  const { userId } = useContext(UserContext);
  const [projectName, setProjectName] = useState("");

  const InsertProject = async () => {
    const qPro = query(collection(db, "Project"));
    let maxProjectId = 0;
    const querySnapshot1 = await getDocs(qPro);
    for (const pro of querySnapshot1.docs) {
      if (pro.data().ProjectID > maxProjectId) {
        maxProjectId = pro.data().ProjectID;
      }
    }
    maxProjectId = maxProjectId + 1;

    const docData = {
      ProjectID: maxProjectId,
      CreatorID: userId,
      ProjectName: projectName,
      StartTime: Timestamp.fromDate(new Date(selectedStartDate)),
      EndTime: Timestamp.fromDate(new Date(selectedEndDate)),
    };

    try {
      await setDoc(doc(db, "Project", maxProjectId.toString()), docData);
      console.log("Insert project!");
    } catch (e) {
      console.error("Error:", e);
    }

    if (assigneeList.length > 0) {
      let maxItemId = 0;
      const qProUser = query(collection(db, "Project_User"));
      const querySnapshot2 = await getDocs(qProUser);
      for (const item of querySnapshot2.docs) {
        if (item.data().itemID > maxItemId) {
          maxItemId = item.data().itemID;
        }
      }
      maxItemId = maxItemId + 1;
      for (const user of assigneeList) {
        console.log("item id: ", maxItemId);
        const pro_user = {
          ProjectID: maxProjectId,
          AssigneeID: user.UserID,
          itemID: maxItemId,
        };

        try {
          await setDoc(doc(db, "Project_User", maxItemId.toString()), pro_user);
          console.log("Insert item!");
        } catch (e) {
          console.error("Error:", e);
        }
        maxItemId = maxItemId + 1;
      }
    }
    navigation.replace("WorkspaceScreen");
  };

  // add member
  const [member, setMember] = useState("");
  const [memberList, setMemberList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [assigneeList, setAssigneeList] = useState([]);

  console.log("ass: ", assigneeList);
  
  const getUserList = async () => {
    const q = query(collection(db, "User"), where("UserID", "!=", userId));
    const querySnapshot = await getDocs(q);
    const users = [];
    for (const user of querySnapshot.docs) {
      let avatar = user.data().Avatar;
      if (avatar == "") {
        const name = user.data().Name;
        const initials = name
          .split(" ")
          .map((name) => name.charAt(0))
          .join("");
        avatar = `https://ui-avatars.com/api/?name=${name}&background=random&size=24`;
      }
      users.push({
        UserID: user.data().UserID,
        Name: user.data().Name,
        Email: user.data().Email,
        Avatar: avatar,
        hidden: false,
      });
    }
    setUserList(users);
  };

  useEffect(() => {
    getUserList();
  }, []);

  const onChangeTextAddMember = (text) => {
    setMember(text);
    let members = [];
    if (text.length > 0) {
      userList
        .filter(
          (user) =>
            user.Email.toLowerCase().includes(text.toLowerCase()) &&
            user.hidden == false
        )
        .map((user) => {
          members.push({
            Email: user.Email,
            Avatar: user.Avatar,
          });
        });
    }
    setMemberList(members);
  };

  const AddMember = () => {
    const index = userList.findIndex((user) => user.Email == member);

    if (index != -1) {
      const assignees = assigneeList.slice();
      const updateUserList = userList.slice();
      updateUserList[index].hidden = true;
      const user = {
        UserID: userList[index].UserID,
        Email: userList[index].Email,
        Avatar: userList[index].Avatar,
      };
      assignees.push(user);
      setAssigneeList(assignees);
      setUserList(updateUserList);
      setMember("");
    } else {
      console.log("User not found");
    }
  };

  const RemoveAssign = (key) => {
    const updateAssigneeList = assigneeList.filter(
      (user) => user.UserID != key
    );
    const index = userList.findIndex((user) => user.UserID == key);
    const updateUserList = userList.slice();

    updateUserList[index].hidden = false;

    setAssigneeList(updateAssigneeList);
    setUserList(updateUserList);
    onChangeTextAddMember(member);
  };

  const selectEmailMember = (value) => {
    setMember(value);
    setMemberList([]);
  };

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
        <View style={styles.row}>
          {/* Button: back to previous screen */}
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign
              name="left"
              size={30}
              style={styles.headerBehave}
            ></AntDesign>
          </TouchableOpacity>

          {/* small avatar */}
          <View style={styles.headerBehave}>
            <TouchableOpacity
              onPress={() => navigation.navigate("AccountFeature")}
            >
              <UserAvatar
                size={40}
                active
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2900&q=80"
              />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
      >
        <View style={{ backgroundColor: "white", flex: 1 }}>
          {/* Layout back button, small avatar, title of note, create date*/}
          <View style={{ flex: 50, backgroundColor: "white", marginTop: 85 }}>
            {/* Title */}
            <Text style={styles.smallTitle}>Name</Text>
            <TouchableOpacity style={styles.insertBox}>
              <TextInput
                style={styles.textInInsertBox}
                placeholder="Your title here"
                placeholderTextColor={Colors.placeholder}
                onChangeText={(text) => setProjectName(text)}
                value={projectName}
              />
            </TouchableOpacity>

            {/* Date */}

            {/* Start Date  */}
            {/* TextInput */}
            <View>
              <Text style={styles.smallTitle}>Start date</Text>
              {/* inputText */}
              <View style={styles.inputText}>
                <Text style={styles.textInInputText}>{selectedStartDate}</Text>
                <TouchableOpacity onPress={showStartDatePicker}>
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
                display="calendar"
                isVisible={isStartDatePickerVisible}
                mode="date"
                onConfirm={handleStartDateConfirm}
                onCancel={hideStartDatePicker}
              />
            </View>
            {/* End of TextInput */}
            {/* End Start Date  */}

            {/* End Date  */}
            {/* TextInput */}
            <View>
              <Text style={styles.smallTitle}>End date</Text>
              {/* inputText */}
              <View style={styles.inputText}>
                <Text style={styles.textInInputText}>{selectedEndDate}</Text>
                <TouchableOpacity onPress={showEndDatePicker}>
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
                display="calendar"
                isVisible={isEndDatePickerVisible}
                mode="date"
                minimumDate={new Date(selectedStartDate)}
                onConfirm={handleEndDateConfirm}
                onCancel={hideEndDatePicker}
              />
            </View>
            {/* End of TextInput */}
            {/* End of End Date  */}
          </View>

          {/* Description, button Create note */}
          {/* Description */}
          <View style={{ flex: 60, backgroundColor: "white" }}>
            <Text style={styles.smallTitle}>Members</Text>

            {assigneeList.map((user) => {
              return (
                <View key={user.UserID} style={styles.members}>
                  <UserAvatar size={25} src={user.Avatar} />
                  <Text style={styles.textAssignee}>{user.Email}</Text>
                  <TouchableOpacity
                    key={user.UserID}
                    onPress={() => RemoveAssign(user.UserID)}
                  >
                    <AntDesign name="minuscircleo" size={23} color="#363942" />
                  </TouchableOpacity>
                </View>
              );
            })}

            <View style={styles.inputTextMember}>
              {/* Text input member */}
              <View style={styles.addMember}>
                <TextInput
                  style={styles.textInInputText}
                  onChangeText={onChangeTextAddMember}
                  value={member}
                  placeholder="Your email member"
                ></TextInput>
                <TouchableOpacity onPress={() => AddMember()}>
                  {/* Icon */}
                  <Ionicons
                    name="ios-person-add-outline"
                    size={24}
                    color="#363942"
                  />
                </TouchableOpacity>
              </View>
            </View>
            {memberList.map((item, index) => {
              const email = item.Email;
              const i = email.indexOf(member);
              const startEmail = email.substring(0, i);
              const endEmail = email.substring(i + member.length);
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => selectEmailMember(item.Email)}
                >
                  <View style={styles.emailButton}>
                    <Feather
                      name="corner-down-right"
                      size={22}
                      color="#363942"
                    />
                    <UserAvatar size={24} src={item.Avatar} />
                    <Text style={styles.textStartEmail}>{startEmail}</Text>
                    <Text style={styles.textEmailBold}>{member}</Text>
                    <Text style={styles.textEndEmail}>{endEmail}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
          {/* Create note button */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => InsertProject()}
          >
            <Text style={styles.textInButton}>Create a new project</Text>
          </TouchableOpacity>
        </View>
      </Animated.ScrollView>
    </KeyboardAvoidingView>
  );
};

// const AddNoteScreen = () => {

// };

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
    marginBottom: 80,
  },

  noteBox: {
    backgroundColor: "#F5F5F5",
    // marginVertical: 10,
    marginTop: 5,
    marginBottom: 10,
    height: 340,
    borderRadius: 10,
    shadowColor: "gray",
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    marginHorizontal: 15,
  },

  insertBox: {
    backgroundColor: "#F5F5F5",
    // marginVertical: 10,
    marginVertical: 10,
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
    // fontFamily: "Poppins",
    marginBottom: "auto",
    marginTop: "auto",
    marginLeft: 15,
    marginRight: 15,
  },

  textInNoteBox: {
    fontSize: 16,
    // fontFamily: "Poppins",
    marginBottom: "auto",
    marginTop: 5,
    marginHorizontal: 15,
    height: 340,
  },
  inputText: {
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    marginHorizontal: 15,
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
  textInInputText: {
    paddingTop: 0,
    fontSize: 16,
    flex: 1,
  },
  textAssignee: {
    paddingTop: 0,
    fontSize: 16,
    marginLeft: 10,
    flex: 1,
  },
  inputTextMember: {
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    marginHorizontal: 15,
    marginTop: 10,
    marginBottom: 2,
    padding: 10,
    shadowColor: "gray",
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 2,
      height: 2,
    },
  },
  addMember: {
    flexDirection: "row",
  },
  members: {
    borderLeftWidth: 3,
    borderLeftColor: "#4B7BE5",
    marginHorizontal: 15,
    marginVertical: 5,
    padding: 7,
    flexDirection: "row",
  },
  textMember: {
    fontSize: 15,
    marginLeft: 10,
    color: "#363942",
  },
  emailButton: {
    backgroundColor: "#BDD8F1",
    borderRadius: 10,
    marginHorizontal: 15,
    marginVertical: 2,
    padding: 10,
    shadowColor: "gray",
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    flexDirection: "row",
  },
  textStartEmail: {
    marginLeft: 5,
    fontSize: 15,
    color: "#363942",
  },
  textEmailBold: {
    fontSize: 15,
    fontWeight: "bold",
    color: "black",
  },
  textEndEmail: {
    fontSize: 15,
    color: "#363942",
  },
});

export default AddProjectScreen;

import {
  Text,
  StyleSheet,
  View,
  Animated,
  KeyboardAvoidingView,
} from "react-native";
import React, {
  Component,
  useState,
  useEffect,
  useRef,
  useContext,
} from "react";
import { TouchableOpacity } from "react-native";
import NotifyCard from "../components/NotifyCard";
import { ScrollView } from "react-native";
import { StatusBar } from "react-native";
import { UserContext, UserProvider } from "../contextObject";
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

const CONTAINER_HEIGHT = 80;
const notifyInfo = {
  name: "name of task",
  date: "Mar 10",
  project: "name of project",
  due: "March 12, 2023",
};
export default function NotifyScreen({ navigation }) {
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

  // get notify
  const { userId } = useContext(UserContext);
  const [notifyList, setNotifyList] = useState([]);
  const getNotifyInfo = async () => {
    const q = query(
      collection(db, "Notification"),
      where("UserID", "==", userId)
    );
    const querySnapshot = await getDocs(q);

    const notifies = [];
    for (const notify of querySnapshot.docs) {
      const notifyID = notify.data().NotificationID;
      console.log("notifyID: ", notifyID);
      const proID = notify.data().ProjectID;
      let proName = "";
      const status = notify.data().Status;
      let taskName = "";
      const taskID = notify.data().TaskID;
      const time = notify.data().Time.toDate().toLocaleTimeString();
      const date = notify.data().Time.toDate().toLocaleDateString();
      const type = notify.data().Type;
      let dueTime = "";
      let dueDate = "";
      let creatorName = "";

      if (type == 1 || type == 2) {
        const proRef = doc(db, "Project", proID.toString());
        const proSnap = await getDoc(proRef);
        if (proSnap.exists()) {
          proName = proSnap.data().ProjectName;

          const creatorRef = doc(
            db,
            "User",
            proSnap.data().CreatorID.toString()
          );
          const creatorSnap = await getDoc(creatorRef);
          if (creatorSnap.exists()) {
            creatorName = creatorSnap.data().Name;
          }
        }
      }
      if (type != 1) {
        const taskRef = doc(db, "Task", taskID.toString());
        const taskSnap = await getDoc(taskRef);
        if (taskSnap.exists()) {
          taskName = taskSnap.data().Title;
          dueTime = taskSnap.data().DueTime.toDate().toLocaleTimeString();
          dueDate = taskSnap.data().DueTime.toDate().toLocaleDateString();
        }
      }

      const n = {
        NotificationID: notifyID,
        ProjectID: proID,
        ProjectName: proName,
        Status: status,
        TaskID: taskID,
        TaskName: taskName,
        Date: date,
        Time: time,
        Type: type,
        DueTime: dueTime,
        DueDate: dueDate,
        CreatorName: creatorName,
      };
      notifies.push(n);
    }
    setNotifyList(notifies);
  };

  useEffect(() => {
    getNotifyInfo();
  }, []);
  console.log("no list: ", notifyList);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      enabled
      keyboardVerticalOffset={Platform.select({ ios: 0, android: 500 })}
    >
      <StatusBar barStyle={"dark-content"} />
      <Animated.View
        style={[
          styles.header,
          { transform: [{ translateY: headerTranslate }] },
        ]}
      >
        {/* Header */}
        <View style={styles.rowSection}>
          <TouchableOpacity style={styles.headerBehave}>
            <Text style={styles.textHeader}>Clear all</Text>
          </TouchableOpacity>
          <Text
            style={{
              color: "#363942",
              fontWeight: "bold",
              fontSize: 24,
            }}
          >
            All updates
          </Text>
          <TouchableOpacity
            style={styles.headerBehave}
            onPress={() => navigation.goBack()}
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
        <View style={{ marginTop: CONTAINER_HEIGHT }}>
          {/* Notify Card */}
          {notifyList.map((noti) => {
            return (
              <NotifyCard
                key={noti.NotificationID}
                navigation={navigation}
                notify={noti}
              ></NotifyCard>
            );
          })}

          {/* End of Notify Card */}
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
    alignItems: "center",
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
});

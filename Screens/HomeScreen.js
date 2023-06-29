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
  KeyboardAvoidingView,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, {
  Component,
  useEffect,
  useRef,
  useContext,
  useState,
} from "react";
import { Colors } from "react-native/Libraries/NewAppScreen";
import UserAvatar from "@muhzi/react-native-user-avatar";
import { Feather, SimpleLineIcons, Ionicons } from "@expo/vector-icons";
import HomeSection from "../components/HomeSection";
import TaskCard from "../components/TaskCardProgress";
import TaskCardCP from "../components/TaskCardCompleted";
import TaskCardOD from "../components/TaskCardOverdue";
import TabContainer from "../components/TabContainer";

import { db } from "../components/FirestoreConfig";
import { collection, getDocs, query, where, or, and } from "firebase/firestore";
import { UserContext, UserProvider } from "../contextObject";

const CONTAINER_HEIGHT = 80;
const sectionInHome = {
  sectionName: "My Tasks",
  sectionName2: "Completed",
  sectionName3: "Overdue",
};

const taskCard = {
  title1: "Landing Page Agency",
  subtitle1: "Webb Design",
  time1: "10:00 - 12:30 am",
  status1: "On Progress",
  status2: "Completed",
  status3: "Overdue",
  icon: "star",
};

export default function HomeScreen({ navigation }) {
  const { userId } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true); // Add a state for loading indicator
  const [tasks, setTasks] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(
          collection(db, "Task"),
          where("CreatorID", "==", userId)
        );
        // const querySnapshot = await getDocs(collection(db, "Task"));
        const querySnapshot = await getDocs(q);
        const tasksData = querySnapshot.docs.map((doc) => {
          const { Description, StartTime, DueTime, Status, Title } = doc.data();
          const startDateTime = StartTime.toDate();
          const startTime = startDateTime.toLocaleTimeString();

          const endDateTime = DueTime.toDate();
          const endTime = endDateTime.toLocaleTimeString();
          return {
            id: doc.id,
            Description,
            StartTime,
            DueTime,
            Status,
            Title,
            startTime,
          };
        });

        setTasks(tasksData);
        setIsLoading(false);
      } catch (error) {
        console.log("Error fetching tasks:", error);
      }
    };

    fetchData();
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
  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }
  return (
    <TabContainer>
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
              onPress={() => navigation.navigate("Notify")}
            >
              {/* <SimpleLineIcons name="bell" size={30} color="black" /> */}
              <Ionicons name="notifications-outline" size={30}></Ionicons>
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
        <FlatList
          ListHeaderComponent={
            <Animated.ScrollView
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                { useNativeDriver: true }
              )}
            >
              <View
                style={{
                  marginTop: 80,
                }}
              >
                {/* Hello user */}
                <Text style={styles.title}>Hello Josh</Text>
                <Text style={styles.detailText}>May 27, 2022</Text>

                {/* SearchBox */}
                <View style={styles.SearchBox}>
                  <TextInput
                    style={styles.textInSearchBox}
                    placeholder="Find your task"
                    placeholderTextColor={Colors.placeholder}
                  ></TextInput>
                  <TouchableOpacity>
                    <Feather name="search" size={24} color="#363942" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* My Task */}
              <HomeSection
                title={sectionInHome.sectionName}
                navigation={navigation}
                screenName="MyTask"
              ></HomeSection>
            </Animated.ScrollView>
          }
          ListFooterComponent={
            <View>
              <View>
                <HomeSection
                  title={sectionInHome.sectionName2}
                  navigation={navigation}
                  screenName="Completed"
                ></HomeSection>
                <FlatList
                  nestedScrollEnabled={true}
                  data={tasks
                    .filter((item) => item.Status === "Completed")
                    .slice(0, 3)}
                  renderItem={({ item }) => (
                    <TaskCard
                      title={item.Title}
                      subtitle={item.Description}
                      time={item.startTime}
                      taskStatus={item.Status}
                      iconName={taskCard.icon}
                      navigation={navigation}
                      screenName="TaskInfo"
                      firebase={db}
                      taskID={item.id}
                    />
                  )}
                  listKey="completedList"
                  keyExtractor={(item) => item.id.toString()}
                />
              </View>

              <View>
                <HomeSection
                  title={sectionInHome.sectionName3}
                  navigation={navigation}
                  screenName="Overdue"
                ></HomeSection>
                <FlatList
                  nestedScrollEnabled={true}
                  data={tasks
                    .filter((item) => item.Status === "Overdue")
                    .slice(0, 3)}
                  renderItem={({ item }) => (
                    <TaskCard
                      title={item.Title}
                      subtitle={item.Description}
                      time={item.startTime}
                      taskStatus={item.Status}
                      iconName={taskCard.icon}
                      navigation={navigation}
                      screenName="TaskInfo"
                      firebase={db}
                      taskID={item.id}
                    />
                  )}
                  listKey="overdueList"
                  keyExtractor={(item) => item.id.toString()}
                />
              </View>
            </View>
          }
          data={tasks
            .filter((item) => item.Status === "On Progress")
            .slice(0, 3)} // Giới hạn số lượng mục
          renderItem={({ item }) => (
            <TaskCard
              title={item.Title}
              subtitle={item.Description}
              time={item.startTime}
              taskStatus={item.Status}
              iconName={taskCard.icon}
              navigation={navigation}
              screenName="TaskInfo"
              firebase={db}
              taskID={item.id}
            />
          )}
          listKey="onProgressList"
          keyExtractor={(item) => item.id.toString()}
        />
      </KeyboardAvoidingView>
    </TabContainer>
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
    shadowColor: "gray",
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 2,
      height: 2,
    },
  },
  textInSearchBox: {
    fontSize: 16,
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
  activityIndicatorContainer: {
    position: "absolute",
  },
});

import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import React, { Component } from "react";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Feather } from "@expo/vector-icons";
import { db } from "./FirestoreConfig";
import {
  collection,
  doc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
export default class TaskCardOP extends Component {
  handlePress = () => {
    const { screenName, navigation, taskID } = this.props;
    navigation.navigate(screenName, { taskID });
  };
  constructor(props) {
    super(props);

    const { taskStatus } = this.props;
    const statusColor = this.getStatusColor(taskStatus);

    this.state = {
      status: taskStatus,
      statusColor: statusColor,
    };
  }

  getStatusColor = (status) => {
    switch (status) {
      case "On Progress":
        return "#4B7BE5";
      case "Completed":
        return "#6BBA62";
      case "Overdue":
        return "#E7272D";
      default:
        return "#4B7BE5";
    }
  };

  handleChangeColor = (status) => {
    switch (status) {
      case "On Progress":
        return "#4B7BE5";
      case "Completed":
        return "#6BBA62";
      case "Overdue":
        return "#E7272D";
      default:
        return "#4B7BE5";
    }
  };
  handleTaskStatusChange = async () => {
    const { taskID, firebase } = this.props;
    const { status } = this.state;

    let newStatus = "";
    let newColor = "";

    switch (status) {
      case "On Progress":
        newStatus = "Completed";

        break;
      case "Completed":
        newStatus = "Overdue";

        break;
      case "Overdue":
        newStatus = "On Progress";

        break;
      default:
        newStatus = taskStatus;
    }
    newColor = this.handleChangeColor(newStatus);
    try {
      const taskRef = doc(collection(firebase, "Task"), taskID);
      // Update the status and color in Firestore
      await updateDoc(taskRef, { Status: newStatus });

      // Update the state with the new status and color
      this.setState({ taskStatus: newStatus, statusColor: newColor });
    } catch (error) {
      console.log("Error updating task status:", error);
    }
  };

  render() {
    return (
      <View style={styles.taskCard}>
        {/* TaskCard */}
        <View style={styles.taskCardInfo}>
          <View style={styles.firstRowTaskCard}>
            <TouchableOpacity
              style={{ marginTop: 15, flex: 1 }}
              onPress={() => this.handlePress(this.props.taskID)}
            >
              <Text style={styles.taskCardTitle}>{this.props.title}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.priorityStar}>
              <FontAwesome5
                name={this.props.iconName}
                size={24}
                color="black"
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={{ marginTop: 5 }}
            onPress={() => this.handlePress(this.props.taskID)}
          >
            <Text style={styles.taskCardSubtitle}>{this.props.subtitle}</Text>
          </TouchableOpacity>

          {/* Đường kẻ */}
          <View style={styles.lineInTaskCard} />
          {/* Row Thời gian */}
          <View style={styles.secondRowTaskCard}>
            {/* Thời gian */}
            <View style={styles.timeAndClock}>
              <Feather
                name="clock"
                size={20}
                color="black"
                style={{ margin: 2 }}
              />
              <TouchableOpacity
                onPress={() => this.handlePress(this.props.taskID)}
              >
                <Text style={styles.timeInTaskCard}>{this.props.time}</Text>
              </TouchableOpacity>
            </View>

            {/* Nút OnProgress */}
            <TouchableOpacity
              style={[
                styles.statusButton,
                { backgroundColor: this.state.statusColor },
              ]}
              onPress={this.handleTaskStatusChange}
            >
              <Text style={styles.textInStatus}>{this.state.status}</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* End of TaskCard */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  taskCard: {
    marginTop: 5,
  },
  taskCardInfo: {
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    marginHorizontal: 20,
    marginVertical: 7,
    alignItems: "flex-start",
    padding: 10,
    shadowColor: "gray",
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 2,
      height: 2,
    },
  },
  taskCardTitle: {
    color: "#363942",
    fontSize: 16,
    fontWeight: "500",
  },
  priorityStar: {
    marginTop: 15,
  },
  taskCardSubtitle: {
    color: "gray",
    fontSize: 12,
    fontWeight: "400",
  },
  lineInTaskCard: {
    padding: 4,
    borderBottomColor: "gray",
    borderBottomWidth: StyleSheet.hairlineWidth,
    width: "100%",
  },
  timeInTaskCard: {
    color: "gray",
    fontSize: 14,
    fontWeight: "500",
  },
  taskStatusOP: {
    backgroundColor: "#4B7BE5",
    borderRadius: 10,
  },
  taskStatusFinished: {
    backgroundColor: "#6BBA62",
    borderRadius: 10,
  },
  statusButton: {
    borderRadius: 10,
  },
  textInStatus: {
    fontSize: 10,
    padding: 5,
    color: "#F8F6FF",
    fontWeight: "500",
  },
  secondRowTaskCard: {
    display: "flex",
    marginTop: 5,
    justifyContent: "space-between",
    flexDirection: "row",
  },
  timeAndClock: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  firstRowTaskCard: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

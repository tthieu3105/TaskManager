import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import React, { Component } from "react";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Feather } from "@expo/vector-icons";

export default class TaskCardOP extends Component {
  handlePress = () => {
    const { screenName, navigation } = this.props;
    navigation.navigate(screenName);
  };
  constructor(props) {
    super(props);
    this.state = {
      taskStatus: "onProgress",
    };
  }

  // handleTaskStatusChange = () => {
  //   if (this.state.taskStatus === "onProgress") {
  //     this.setState({ taskStatus: "completed" });
  //     this.props.setTasksOnProgress(
  //       this.props.tasksOnProgress.filter(
  //         (task) => task.id !== this.props.task.id
  //       )
  //     );
  //     this.props.setTasksCompleted([
  //       ...this.props.tasksCompleted,
  //       this.props.task,
  //     ]);
  //   } else if (this.state.taskStatus === "completed") {
  //     this.setState({ taskStatus: "overdue" });
  //     this.props.setTasksCompleted(
  //       this.props.tasksCompleted.filter(
  //         (task) => task.id !== this.props.task.id
  //       )
  //     );
  //     this.props.setTasksOverdue([...this.props.tasksOverdue, this.props.task]);
  //   }
  // };
  handleStatusChange = () => {
    // Kiểm tra nếu trạng thái hiện tại là 'on progress' thì chuyển sang 'completed'
    if (this.state.taskStatus === "on progress") {
      this.setState({ status: "completed" });
    }
    // Kiểm tra nếu trạng thái hiện tại là 'completed' thì chuyển sang 'overdue'
    else if (this.state.taskStatus === "completed") {
      this.setState({ status: "overdue" });
    }
    // Kiểm tra nếu trạng thái hiện tại là 'overdue' thì chuyển sang 'on progress'
    else if (this.state.taskStatus === "overdue") {
      this.setState({ status: "on progress" });
    }
  };
  render() {
    const { taskStatus } = this.state;
    const statusStyle = {
      backgroundColor:
        taskStatus === "onProgress"
          ? "#4B7BE5"
          : taskStatus === "completed"
          ? "#6BBA62"
          : "#E7272D",
      borderRadius: 10,
    };
    return (
      <View style={styles.taskCard}>
        {/* TaskCard */}
        <View style={styles.taskCardInfo}>
          <View style={styles.firstRowTaskCard}>
            <TouchableOpacity
              style={{ marginTop: 15, flex: 1 }}
              onPress={this.handlePress}
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
          <TouchableOpacity style={{ marginTop: 5 }} onPress={this.handlePress}>
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
              <TouchableOpacity onPress={this.handlePress}>
                <Text style={styles.timeInTaskCard}>{this.props.time}</Text>
              </TouchableOpacity>
            </View>

            {/* Nút OnProgress */}
            <TouchableOpacity
              style={statusStyle}
              onPress={this.handleTaskStatusChange}
            >
              {this.state.taskStatus === "onProgress" && (
                <Text style={styles.textInStatus}>On Progress</Text>
              )}
              {this.state.taskStatus === "completed" && (
                <Text style={styles.textInStatus}>Completed</Text>
              )}
              {this.state.taskStatus === "overdue" && (
                <Text style={styles.textInStatus}>Overdue</Text>
              )}
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

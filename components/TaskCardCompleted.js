import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import React, { Component } from "react";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Feather } from "@expo/vector-icons";

export default class TaskCardCP extends Component {
  render() {
    return (
      <View style={styles.taskCard}>
        {/* TaskCard */}
        <View style={styles.taskCardInfo}>
          <View style={styles.firstRowTaskCard}>
            <TouchableOpacity style={{ marginTop: 15, flex: 1 }}>
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
          <TouchableOpacity style={{ marginTop: 5 }}>
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
              <TouchableOpacity>
                <Text style={styles.timeInTaskCard}>{this.props.time}</Text>
              </TouchableOpacity>
            </View>

            {/* Nút OnProgress */}
            <TouchableOpacity style={styles.taskStatusFinished}>
              <Text style={styles.textInStatus}>{this.props.status}</Text>
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

  taskStatusFinished: {
    backgroundColor: "#6BBA62",
    borderRadius: 10,
  },
  completedTask: {
    backgroundColor: "#4B7BE5",
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

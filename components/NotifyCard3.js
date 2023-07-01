import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import React, { Component } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

export default class NotifyCard3 extends Component {
  render() {
    return (
      <View style={{ marginTop: 5 }}>
        <TouchableOpacity style={styles.sectionCard}>
          {/* Icon notify */}
          <View style={styles.iconNotify}>
            <Ionicons name="ios-person-add-outline" size={40} color="#4B7BE5" />
          </View>
          {/* Notify Detail */}
          <View style={styles.detailNotify}>
            {/* Reminder */}
            <View style={styles.flexRow}>
              <Text
                style={{ fontSize: 16, fontWeight: "500", color: "#4B7BE5" }}
              >
                Reminder in
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "black",
                  marginLeft: 5,
                }}
              >
                {this.props.nameTask}
              </Text>
            </View>
            {/* Date */}
            <View style={styles.flexRow}>
              <Text
                style={{ fontSize: 12, color: "#363942", fontWeight: "300" }}
              >
                {this.props.createDate} - {this.props.projectName}
              </Text>
            </View>

            {/* Due date */}
            <View style={styles.flexRow}>
              <FontAwesome5 name="calendar" size={16} color="black" />
              <Text
                style={{
                  fontSize: 12,
                  color: "#363942",
                  fontWeight: "300",
                  marginLeft: 5,
                }}
              >
                due date
              </Text>
            </View>
            {/* Due date  */}
            <View style={styles.flexRow}>
              <Text style={{ color: "#4B7BE5", fontSize: 12 }}>
                {this.props.dueDate}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        {/* Đường kẻ */}
        <View style={styles.lineInNotifyCard} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  sectionCard: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    marginHorizontal: 20,
  },
  detailNotify: {
    display: "flex",
    flexDirection: "column",
    marginLeft: 15,
  },
  iconNotify: {},
  flexRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 3,
  },
  lineInNotifyCard: {
    padding: 4,
    borderBottomColor: "gray",
    borderBottomWidth: StyleSheet.hairlineWidth,
    width: "100%",
  },
});

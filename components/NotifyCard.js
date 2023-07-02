import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import React, { Component, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { db } from "../components/FirestoreConfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  setDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";

export default class NotifyCard extends Component {
  getBackgroundColor = (status, type) => {
    if (status) {
      return "#FFFFFF";
    } else {
      if (type == 1 || type == 2) {
        return "#D1E9EA";
      } else {
        return "#F6E5E4";
      }
    }
  };
  getTextColor = (type) => {
    if (type == 1 || type == 2) {
      return "#4B7BE5";
    } else {
      return "#E7272D";
    }
  };
  getIcon = (type) => {
    if (type == 1 || type == 2) {
      return "#4B7BE5";
    } else {
      return "#E7272D";
    }
  };
  Type1Click = async (navigation, notify) => {
    if(notify.Status == false) {
      const notiRef = doc(db, "Notification", notify.NotificationID.toString());
      await updateDoc(notiRef, {
        Status: true,
      });
    }
    // navigation.navigate("Projects", {
    //   ProjectID: notify.ProjectID,
    // })
  }
  Type2Click = async (navigation, notify) => {
    if(notify.Status == false) {
      const notiRef = doc(db, "Notification", notify.NotificationID.toString());
      await updateDoc(notiRef, {
        Status: true,
      });
    }
    // navigation.navigate("TaskInfo", { TaskID: notify.TaskID });
  }
  render() {
    const { notify } = this.props;
    const { navigation } = this.props;
    let view = "";
    const backgroundColor = this.getBackgroundColor(notify.Status, notify.Type);
    const color = this.getTextColor(notify.Type);
    let proName = notify.ProjectName;

    if (proName.length > 30) {
      proName = proName.slice(0, 29) + "...";
    }

    let day = "";
    let hour = "";
    let stringDay="";
    const datetime1 = notify.Date + " " + notify.Time;
    const datetime2 = notify.DueDate + " " + notify.DueTime;
    if (notify.Type == 3) {
      const d = new Date(new Date(datetime1) - new Date(datetime2));
      day = d.getDate();
      hour = d.getHours();
      if(day>0){
        stringDay += day.toString() + " days ";
      }
      if(hour>0) {
        stringDay += "and " + hour.toString() +" hours ";
      }
      stringDay+="left";
    }
    if (notify.Type == 4) {
      const d = new Date(new Date() - new Date(datetime2));
      day = d.getDate();
      hour = d.getHours();
      if(day>0){
        stringDay += day.toString() + " days ";
      }
      if(hour>0) {
        stringDay += "and " + hour.toString() +" hours ";
      }
      stringDay+="overdue";
    }
    switch (notify.Type) {
      case 1:
        view = (
          <View style={{ backgroundColor: backgroundColor }}>
            <TouchableOpacity style={styles.sectionCard} onPress={()=>this.Type1Click(navigation, notify)}>
              {/* Icon notify */}
              <View style={styles.iconNotify}>
                <Ionicons
                  name="ios-person-add-outline"
                  size={40}
                  color={color}
                />
              </View>
              {/* Notify Detail */}
              <View style={styles.detailNotify}>
                {/* Reminder */}
                <View style={styles.flexRow}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "500",
                      color: color,
                    }}
                  >
                    Assigned to
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: "black",
                      marginLeft: 5,
                    }}
                  >
                    {proName}
                  </Text>
                </View>
                {/* Date */}
                <View style={styles.flexRow}>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#363942",
                      fontWeight: "300",
                    }}
                  >
                    by {notify.CreatorName}
                  </Text>
                </View>

                {/* Due date */}
                {/* <View style={styles.flexRow}>
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
                </View> */}
                {/* Due date  */}
                <View style={styles.flexRow}>
                  <Text style={{ color: color, fontSize: 12 }}>
                    {notify.Time} - {notify.Date}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
            <View style={styles.lineInNotifyCard} />
          </View>
        );
        break;
      case 2:
        view = (
          <View style={{ backgroundColor: backgroundColor }}>
            <TouchableOpacity style={styles.sectionCard} onPress={()=>Type2Click(navigation, notify)}>
              {/* Icon notify */}
              <View style={styles.iconNotify}>
                <Ionicons
                  name="ios-person-add-outline"
                  size={40}
                  color={color}
                />
              </View>
              {/* Notify Detail */}
              <View style={styles.detailNotify}>
                {/* Reminder */}
                <View style={styles.flexRow}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "500",
                      color: color,
                    }}
                  >
                    Assigned to
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: "black",
                      marginLeft: 5,
                    }}
                  >
                    {notify.TaskName}
                  </Text>
                </View>
                {/* Date */}
                <View style={styles.flexRow}>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#363942",
                      fontWeight: "300",
                    }}
                  >
                    in {notify.ProjectName}
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
                    due date: {notify.DueTime} - {notify.DueDate}
                  </Text>
                </View>
                {/* Due date  */}
                <View style={styles.flexRow}>
                  <Text style={{ color: color, fontSize: 12 }}>
                    {notify.Time} - {notify.Date}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
            <View style={styles.lineInNotifyCard} />
          </View>
        );
        break;
      case 3:
        view = (
          <View style={{ backgroundColor: backgroundColor } } onPress={()=>Type2Click(navigation, notify)}>
            <TouchableOpacity style={styles.sectionCard}>
              {/* Icon notify */}
              <View style={styles.iconNotify}>
                <MaterialIcons name="access-alarm" size={40} color={color} />
              </View>
              {/* Notify Detail */}
              <View style={styles.detailNotify}>
                {/* Reminder */}
                <View style={styles.flexRow}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "500",
                      color: color,
                    }}
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
                    {notify.TaskName}
                  </Text>
                </View>
                {/* Date */}
                <View style={styles.flexRow}>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#363942",
                      fontWeight: "300",
                    }}
                  >
                    {stringDay}
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
                    due date: {notify.DueTime} - {notify.DueDate}
                  </Text>
                </View>
                {/* Due date  */}
                <View style={styles.flexRow}>
                  <Text style={{ color: color, fontSize: 12 }}>
                    {notify.Time} - {notify.Date}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
            <View style={styles.lineInNotifyCard} />
          </View>
        );
        break;
      case 4:
        view = (
          <View style={{ backgroundColor: backgroundColor }} onPress={()=>Type2Click(navigation, notify)}>
            <TouchableOpacity style={styles.sectionCard}>
              {/* Icon notify */}
              <View style={styles.iconNotify}>
                <MaterialIcons name="access-alarm" size={40} color={color} />
              </View>
              {/* Notify Detail */}
              <View style={styles.detailNotify}>
                {/* Reminder */}
                <View style={styles.flexRow}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "500",
                      color: color,
                    }}
                  >
                    Overdue in
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: color,
                      marginLeft: 5,
                    }}
                  >
                    {notify.NameTask}
                  </Text>
                </View>
                {/* Date */}
                <View style={styles.flexRow}>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#363942",
                      fontWeight: "300",
                    }}
                  >
                    {stringDay}
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
                    due date: {notify.DueTime} - {notify.DueDate}
                  </Text>
                </View>
                {/* Due date  */}
                <View style={styles.flexRow}>
                  <Text style={{ color: color, fontSize: 12 }}>
                    {notify.Time} - {notify.Date}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
            <View style={styles.lineInNotifyCard} />
          </View>
        );
        break;
    }
    return <View style={{ marginTop: 5 }}>{view}</View>;
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
    borderBottomColor: "gray",
    borderBottomWidth: StyleSheet.hairlineWidth,
    width: "100%",
  },
});

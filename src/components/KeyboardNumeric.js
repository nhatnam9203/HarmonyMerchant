import React, { Component } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import { scaleSize } from "@utils";
import ICONS from "@resources";

const data = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0"];

export default class KeyboardNumeric extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pressed: false,
    };
  }

  render() {
    const { pressed } = this.state;
    const { onPress = () => {} } = this.props;
    return (
      <>
        <View style={styles.container}>
          {/* -------- NUMPAD -------- */}
          {data.map((number, key) => (
            <NumPad
              onPress={() => onPress(number)}
              number={number}
              key={"numpad" + key}
            />
          ))}

          {/* -------- BUTTON DELETE -------- */}
          <TouchableOpacity
            onPress={() => onPress("x")}
            style={styles.numPad(pressed)}
            onPressIn={() => this.setState({ pressed: true })}
            onPressOut={() => this.setState({ pressed: false })}
            activeOpacity={1}
          >
            <Image
              resizeMode="contain"
              style={styles.iconDelete}
              source={pressed ? ICONS.number_delete_white : ICONS.number_delete}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.line} />
      </>
    );
  }
}

class NumPad extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pressed: false,
    };
  }

  render() {
    const { pressed } = this.state;
    const { number = "", onPress = () => {} } = this.props;
    return (
      <TouchableOpacity
        onPress={onPress}
        style={styles.numPad(pressed)}
        onPressIn={() => this.setState({ pressed: true })}
        onPressOut={() => this.setState({ pressed: false })}
        activeOpacity={1}
      >
        <Text style={styles.numpadText(pressed)}>{number}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: scaleSize(18),
    marginTop: scaleSize(15),
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    zIndex: 9999999999999,
  },
  numPad: (pressed) => {
    return {
      width: scaleWidth(100),
      height: scaleHeight(55),
      borderWidth: 1,
      borderStyle: "solid",
      borderColor: "#dddddd",
      borderRadius: 5,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: scaleSize(7),
      backgroundColor: pressed ? "#1B68AC" : "white",
      borderWidth: pressed ? 0 : 1,
    };
  },
  numpadText: (pressed) => {
    return {
      fontWeight: "600",
      color: "#404040",
      fontSize: scaleSize(22),
      color: pressed ? "white" : "#404040",
    };
  },
  iconDelete: {
    width: scaleSize(30),
    height: scaleSize(30),
  },
  line: {
    width: "100%",
    height: 2,
    backgroundColor: "#eeeeee",
    marginTop: scaleSize(10),
  },
});

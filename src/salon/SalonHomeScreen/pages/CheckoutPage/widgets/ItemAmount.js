import { Text } from "@components";
import IMAGE from "@resources";
import { scaleSize } from "@utils";
import React from "react";
import { Image, TouchableOpacity, View } from "react-native";

class ItemAmount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      quanlity: 1,
    };
  }

  resetStateFromParent = () => {
    this.setState({
      quanlity: 1,
    });
  };

  subQuanlity = () => {
    if (this.state.quanlity > 1) {
      this.setState((prevState) => ({
        quanlity: prevState.quanlity - 1,
      }));
    }
  };

  plusQuanlity = () => {
    this.setState((prevState) => ({
      quanlity: prevState.quanlity + 1,
    }));
  };

  render() {
    const { quanlity } = this.state;
    const { price } = this.props;
    return (
      <View
        style={{
          height: scaleSize(68),
          borderBottomWidth: 3,
          borderBottomColor: "#fff",
          backgroundColor: "#0764B0",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
            paddingTop: scaleSize(10),
          }}
        >
          <TouchableOpacity onPress={this.subQuanlity}>
            <Image
              source={IMAGE.subAmount}
              style={{ width: scaleSize(25), height: scaleSize(25) }}
            />
          </TouchableOpacity>
          <View
            style={{
              width: scaleSize(90),
              borderColor: "#fff",
              borderWidth: 3,
              borderRadius: scaleSize(8),
              height: scaleSize(30),
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: scaleSize(16),
                fontWeight: "bold",
              }}
            >
              {quanlity}
            </Text>
          </View>
          <TouchableOpacity onPress={this.plusQuanlity}>
            <Image
              source={IMAGE.plusAmount}
              style={{ width: scaleSize(25), height: scaleSize(25) }}
            />
          </TouchableOpacity>
        </View>

        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: scaleSize(12),
              fontWeight: "bold",
            }}
          >
            {`$ ${price}`}
          </Text>
        </View>
      </View>
    );
  }
}

export default ItemAmount;

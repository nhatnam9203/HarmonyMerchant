import React from "react";
import { View, Image, Text, StyleSheet, TouchableOpacity } from "react-native";

import IMAGE from "@resources";
import { Dropdown, Button } from "@components";
import { scaleSzie, WorkingTime } from "@utils";
import Collapsible from "react-native-collapsible";

const data = [
  {
    id: 1,
    title: "Title 1",
    content: "Content 1",
  },
  {
    id: 2,
    title: "Title 2",
    content: "Content 2",
  },
  {
    id: 3,
    title: "Title 3",
    content: "Content 3",
  },
];

export default class ItemServives extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isCheck: true,
      servives: data,
      isSelectAll: false,
    };
  }

  async componentDidMount() {
    await this.setState({
      isCheck: dataInit.isCheck,
    });
  }

  onPress = () => {
    this.setState((prevState, props) => ({
      isCheck: !prevState.isCheck,
    }));
  };

  selectItem = (id) => {
    let itemSelect = [...this.state.servives];
    for (let Data of itemSelect) {
      if (Data.id == id) {
        Data.selected = Data.selected == null ? true : !Data.selected;
        break;
      }
    }
    const checkSelectAll = itemSelect.filter((item) => item.selected === true);
    console.log(checkSelectAll);
    this.setState({ servives: itemSelect });

    if (checkSelectAll.length === itemSelect.length) {
      this.setState({ isSelectAll: true });
    } else {
      this.setState({ isSelectAll: false });
    }
  };

  selectAllItem = () => {
    const { isSelectAll } = this.state;
    this.setState({ isSelectAll: !this.state.isSelectAll });
    if (isSelectAll) {
      let itemSelect = [...this.state.servives];
      for (let Data of itemSelect) {
        Data.selected = false;
      }
      this.setState({ servives: itemSelect });
    }
  };

  renderItem = () => {
    const { isCheck, isSelectAll } = this.state;
    const temptIconCheck = isCheck ? IMAGE.checkBox : IMAGE.checkBoxEmpty;

    const temptIconCheckArrow = isCheck ? IMAGE.Arrow_up : IMAGE.Arrow_down;
    return this.state.servives.map((item, index) => (
      <View
        style={{ paddingHorizontal: scaleSzie(25), marginBottom: scaleSzie(5) }}
      >
        <TouchableOpacity
          style={styles.item}
          onPress={this.onPress}
          activeOpacity={0.9}
        >
          <Button
            onPress={() => this.selectItem(item.id)}
            style={{ width: scaleSzie(30), justifyContent: "center" }}
          >
            {item.selected || isSelectAll ? (
              <Image
                source={IMAGE.checkBox}
                style={{ width: scaleSzie(15), height: scaleSzie(15) }}
              />
            ) : (
              <Image
                source={IMAGE.checkBoxEmpty}
                style={{ width: scaleSzie(15), height: scaleSzie(15) }}
              />
            )}
          </Button>
          <View style={{ width: "90%", justifyContent: "center" }}>
            <Text
              style={{
                color: "#0764B0",
                fontSize: scaleSzie(14),
                fontWeight: "600",
              }}
            >
              {item.title}
            </Text>
          </View>
          <Image
            source={temptIconCheckArrow}
            style={{ width: scaleSzie(18), height: scaleSzie(18) }}
          />
        </TouchableOpacity>

        <Collapsible collapsed={isCheck}>
          {data.map((item, index) => (
            <View style={styles.item_collap}>
              <Button
                onPress={this.onPress}
                style={{ width: scaleSzie(30), justifyContent: "center" }}
              >
                <Image
                  source={temptIconCheck}
                  style={{ width: scaleSzie(15), height: scaleSzie(15) }}
                />
              </Button>
              <Image
                source={{
                  uri: "https://reactnative.dev/img/tiny_logo.png",
                }}
                style={{
                  width: scaleSzie(30),
                  height: scaleSzie(30),
                  marginRight: scaleSzie(10),
                }}
              />
              <View style={{ width: scaleSzie(120), justifyContent: "center" }}>
                <Text
                  style={[
                    styles.text,
                    {
                      fontWeight: "500",
                    },
                  ]}
                >
                  {item.content}
                </Text>
              </View>
            </View>
          ))}
        </Collapsible>
      </View>
    ));
  };

  render() {
    const { isCheck, isSelectAll } = this.state;
    const temptIconCheck = isSelectAll ? IMAGE.checkBox : IMAGE.checkBoxEmpty;
    return (
      <View>
        <View style={styles.title_services}>
          <Text style={styles.text}>
            Assign servives this staff can perform
          </Text>
        </View>
        <View style={styles.select_all}>
          <Button
            onPress={this.selectAllItem}
            style={{ width: scaleSzie(30), justifyContent: "center" }}
          >
            <Image
              source={temptIconCheck}
              style={{ width: scaleSzie(15), height: scaleSzie(15) }}
            />
          </Button>

          <View
            style={{
              width: scaleSzie(120),
              justifyContent: "center",
            }}
          >
            <Text style={styles.text}>Select All</Text>
          </View>
        </View>
        {this.renderItem()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title_services: {
    width: "100%",
    justifyContent: "center",
    paddingHorizontal: scaleSzie(25),
    marginTop: scaleSzie(14),
  },
  select_all: {
    flexDirection: "row",
    paddingHorizontal: scaleSzie(25),
    marginTop: scaleSzie(14),
    marginBottom: scaleSzie(15),
  },
  text: {
    color: "#404040",
    fontSize: scaleSzie(14),
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: scaleSzie(15),
    paddingVertical: scaleSzie(15),
    backgroundColor: "#f4f3f4",
    marginTop: scaleSzie(3),
  },
  item_collap: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: scaleSzie(15),
    paddingVertical: scaleSzie(10),
    backgroundColor: "#f4f3f4",
    marginVertical: scaleSzie(1),
  },
});

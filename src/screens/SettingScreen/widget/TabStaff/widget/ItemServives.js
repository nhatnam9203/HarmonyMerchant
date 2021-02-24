import React from "react";
import { View, Image, Text, StyleSheet, TouchableOpacity } from "react-native";

import IMAGE from "@resources";
import { Dropdown, Button } from "@components";
import { scaleSzie, WorkingTime } from "@utils";
import Collapsible from "react-native-collapsible";
import connectRedux from "@redux/ConnectRedux";

class ItemServives extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isCheck: true,
      services: [],
      isSelectAll: false,
    };
  }

  onPress = () => {
    this.setState((prevState, props) => ({
      isCheck: !prevState.isCheck,
    }));
  };
  componentDidMount() {
    const isEditStaff = this.props.isEditStaff;
console.log(this.props.isEditStaff)
    // if (isEditStaff) {
    //   // console.log("hihi");
    // } else {
    //   // console.log('new')
    //   this.setState({
    //     services: this.mapCategoryServives(this.props.categoriesByMerchant),
    //   });
    // }
  }

  componentDidUpdate(prevProps) {
    const prevCategories = prevProps?.categories?.categories || [];

    if (
      prevCategories !== this.props.categories &&
      prevProps.isEditStaff !== this.props.isEditStaff
    ) {
      if (this.props.isEditStaff) {
        // console.log("hihi", this.props.categories?.categories);
        // console.log('dsad', this.mapCategoryServives(this.props.categoriesByMerchant))
        this.setState({
          services: this.props.categories?.categories || [],
        });
      } else {
        console.log("new");
        this.setState({
          services: this.mapCategoryServives(this.props.categoriesByMerchant),
        });
      }
    }
  }

  selectItem = (id, index, id_item) => {
    let itemSelect = [...this.state.services];
    for (let Data of itemSelect) {
      if (Data.categoryId == id) {
        Data.selected = Data.selected == null ? true : !Data.selected;

        if (index !== undefined) {
          if (Data.services[index].categoryId == id_item) {
            Data.services[index].selected =
              Data.services[index].selected == null
                ? true
                : !Data.services[index].selected;
            break;
          }
        } else {
          for (let child of Data.services) {
            if (Data.selected) {
              child.selected = true;
            } else {
              child.selected = false;
            }
          }
        }
      }
    }
    const checkSelectAll = itemSelect.filter((item) => item.selected === true);

    this.setState({ services: itemSelect });
    this.props.setServices(itemSelect);

    if (checkSelectAll.length === itemSelect.length) {
      this.setState({ isSelectAll: true });
    } else {
      this.setState({ isSelectAll: false });
    }
  };

  selectItemChild = (id, index, id_item) => {
    let itemSelect = [...this.state.services];
    for (let Data of itemSelect) {
      if (Data.categoryId == id) {
        if (index !== undefined) {
          if (Data.services[index].categoryId == id_item) {
            Data.services[index].selected =
              Data.services[index].selected == null
                ? true
                : !Data.services[index].selected;
            // break;
          }
        }

        const isCheckSelect = Data.services.filter(
          (item) => item.selected === true
        );

        if (isCheckSelect.length === 0) {
          Data.selected = false;
        }
        if (isCheckSelect.length !== 0) {
          Data.selected = true;
        }
      }
    }

    this.setState({ services: itemSelect });
    this.props.setServices(itemSelect);
  };

  selectAllItem = () => {
    const { isSelectAll } = this.state;
    this.setState({ isSelectAll: !this.state.isSelectAll });
    let itemSelect = [...this.state.services];
    if (isSelectAll) {
      for (let Data of itemSelect) {
        Data.selected = false;
        for (let child of Data.services) {
          child.selected = false;
        }
      }
      this.setState({ services: itemSelect });
      this.props.setServices(itemSelect);
    } else {
      for (let Data of itemSelect) {
        Data.selected = true;
        for (let child of Data.services) {
          child.selected = true;
        }
      }
      this.setState({ services: itemSelect });
      this.props.setServices(itemSelect);
    }
  };

  mapCategoryServives = (arr_category) => {
    let categoryArr = [];
    let resultArr = [];
    categoryArr = arr_category.filter(
      (item) => item.categoryType === "Service"
    );

    resultArr = categoryArr.map((item) => ({
      categoryId: item.categoryId,
      name: item.name,
      staffServices: (this.props?.servicesByMerchant || []).filter(
        (i) => i.categoryId === item.categoryId
      ),
    }));

    return resultArr;
  };

  setCollap = (id) => {
    let itemSelect = [...this.state.services];
    for (let Data of itemSelect) {
      if (Data.categoryId == id) {
        Data.isCollap = Data.isCollap == null ? true : !Data.isCollap;
        break;
      }
    }
    this.setState({ services: itemSelect });
  };

  renderItem = () => {
    const { isSelectAll } = this.state;
    return this.state.services.map((item, index) => (
      <View
        style={{ paddingHorizontal: scaleSzie(25), marginBottom: scaleSzie(5) }}
        key={index}
      >
        <TouchableOpacity
          style={styles.item}
          onPress={() => this.setCollap(item.categoryId)}
          activeOpacity={0.9}
        >
          <Button
            onPress={() => this.selectItem(item.categoryId)}
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
              {item.name}
            </Text>
          </View>

          {item.isCollap ? (
            <Image
              source={IMAGE.Arrow_up}
              style={{ width: scaleSzie(18), height: scaleSzie(18) }}
            />
          ) : (
            <Image
              source={IMAGE.Arrow_down}
              style={{ width: scaleSzie(18), height: scaleSzie(18) }}
            />
          )}
        </TouchableOpacity>

        <Collapsible collapsed={!item.isCollap}>
          {item.staffServices.map((items, index) => (
            <View key={index} style={styles.item_collap}>
              <Button
                onPress={() =>
                  this.selectItemChild(item.categoryId, index, items.categoryId)
                }
                style={{ width: scaleSzie(30), justifyContent: "center" }}
              >
                {items.selected || isSelectAll ? (
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
              {items?.imageUrl ? (
                <Image
                  source={{
                    uri: items?.imageUrl,
                  }}
                  style={{
                    width: scaleSzie(30),
                    height: scaleSzie(30),
                    marginRight: scaleSzie(10),
                  }}
                />
              ) : (
                <Image
                  source={IMAGE.Gallery_ic}
                  style={{
                    width: scaleSzie(30),
                    height: scaleSzie(30),
                    marginRight: scaleSzie(10),
                  }}
                />
              )}

              <View style={{ width: "80%", justifyContent: "center" }}>
                <Text
                  style={[
                    styles.text,
                    {
                      fontWeight: "500",
                    },
                  ]}
                >
                  {items.name}
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
            Assign services this staff can perform
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

const mapStateToProps = (state) => ({
  language: state.dataLocal.language,
  profile: state.dataLocal.profile,
  categoriesByMerchant: state.category.categoriesByMerchant,
  servicesByMerchant: state.service.servicesByMerchant,
  categories: state.staff.staffDetail,
});

export default connectRedux(mapStateToProps, ItemServives);

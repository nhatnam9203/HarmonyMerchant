import React from "react";
import {
  View,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  Text,
} from "react-native";

import { scaleSzie, localize } from "@utils";
import styles from "./style";
import { DatePicker, Dropdown } from "@components";
import {
  PromotionFirst,
  PromotionSecond,
  PromotionThird,
  PromotionFour,
  PromotionFive,
  PromotionRewardPoints,
  ItemHeader,
} from "./widget";

const { width } = Dimensions.get("window");

const dataReview = [
  {
    value: "All reviews",
  },
  {
    value: "Good reviews",
  },
  {
    value: "Bad reviews",
  },
];

const dataStatus = [
  {
    value: "All Status",
  },
  {
    value: "Show",
  },
  {
    value: "Hidden",
  },
];

class Layout extends React.Component {
  renderLoadingPromotion() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          transform: [{ scale: 4 }],
        }}
      >
        <ActivityIndicator size={"large"} color="rgb(83,157,209)" />
      </View>
    );
  }

  render() {
    const { language, promotions, refreshingPromotion } = this.props;
    const { show, dateCalendar } = this.state;

    return (
      <View style={styles.container}>
        <View
          style={[
            styles.row,
            {
              justifyContent: "space-between",
              paddingHorizontal: scaleSzie(15),
            },
          ]}
        >
          <ItemHeader
            title={"Aggregate rating"}
            content={"All time statictics"}
            rating={"4.7"}
          />
          <ItemHeader
            title={"Total reivews"}
            content={"All time statictics"}
            rating={"122"}
          />
          <ItemHeader
            title={"Good reviews"}
            content={"All time statictics"}
            rating={"100"}
          />
          <ItemHeader
            title={"Bad reviews"}
            content={"All time statictics"}
            rating={"22"}
          />
        </View>
        <View
          style={[
            styles.row,
            {
              paddingHorizontal: scaleSzie(15),
              paddingTop: scaleSzie(15),
              alignItems: "center",
            },
          ]}
        >
          <Text style={{ color: "#6A6A6A", fontSize: scaleSzie(17) }}>
            Filters
          </Text>
          <View style={[styles.itemDropdown, { width: scaleSzie(135) }]}>
            <Dropdown
              label={"All reviews"}
              data={dataReview}
              // value={timeStart}
              // onChangeText={(value) => this.setState({ timeStart: value })}
              containerStyle={{
                backgroundColor: "#F1F1F1",
                borderWidth: 1,
                borderColor: "#C5C5C5",
                flex: 1,
                borderRadius: 10,
              }}
            />
          </View>
          <View style={styles.itemDropdown}>
            <Dropdown
              label={"All Status"}
              data={dataStatus}
              // value={timeStart}
              // onChangeText={(value) => this.setState({ timeStart: value })}
              containerStyle={{
                backgroundColor: "#F1F1F1",
                borderWidth: 1,
                borderColor: "#C5C5C5",
                flex: 1,
                borderRadius: 10,
              }}
            />
          </View>
        </View>
        <View  style={[
            styles.row,
            {
              justifyContent: "space-between",
              paddingHorizontal: scaleSzie(15),
              paddingVertical: 5,
              backgroundColor: '#BBB',
              marginTop: scaleSzie(10),
              alignItems: 'center'
            },
          ]}>
          <Text style={[styles.titletabar, {width: '15%'}]}>Date</Text>
          <Text style={[styles.titletabar, {width: '20%'}]}>Customer</Text>
          <Text style={[styles.titletabar, {width: '40%'}]}>Review</Text>
          <Text style={[styles.titletabar, {width: '15%'}]}>Rating</Text>
          <Text style={[styles.titletabar, {width: '15%'}]}>Actions</Text>
        </View>
      </View>
    );
  }
}

export default Layout;

import React from "react";
import {
  View,
  FlatList,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  Text,
} from "react-native";

import { scaleSzie, localize } from "@utils";
import styles from "./style";
import { DatePicker, Dropdown } from "@components";
import {
  ItemReview,
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

const data = [
  {
    date: '12/12/2020',
    customer: 'TEST',
    review: "goodjob",
    rating: 5,
    actions: 'Show'
  },
  {
    date: '12/12/2020',
    customer: 'TEST',
    review: "goodjob",
    rating: 5,
    actions: 'Show'
  },
  {
    date: '12/12/2020',
    customer: 'TEST',
    review: "goodjob",
    rating: 5,
    actions: 'Hide'
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
            isRating={true}
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

        {/* FILTERS */}
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
                backgroundColor: "#FFF",
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
                backgroundColor: "#FFF",
                borderWidth: 1,
                borderColor: "#C5C5C5",
                flex: 1,
                borderRadius: 10,
              }}
            />
          </View>
        </View>

        {/* TAB */}
        <View  style={[
            styles.row,
            {
              justifyContent: "space-between",
              paddingHorizontal: scaleSzie(15),
              paddingVertical: 10,
              backgroundColor: '#F1F1F1',
              marginTop: scaleSzie(10),
              alignItems: 'center'
            },
          ]}>
          <Text style={[styles.titletabar, {width: '12%'}]}>Date</Text>
          <Text style={[styles.titletabar, {width: '15%'}]}>Customer</Text>
          <Text style={[styles.titletabar, {width: '45%'}]}>Review</Text>
          <Text style={[styles.titletabar, {width: '20%'}]}>Rating</Text>
          <Text style={[styles.titletabar, {width: '15%'}]}>Actions</Text>
        </View>

        {/* ITEM REVIEW */}
        <View>
          <FlatList 
          data={data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => <ItemReview item={item} />}
          />
        </View>
      </View>
    );
  }
}

export default Layout;

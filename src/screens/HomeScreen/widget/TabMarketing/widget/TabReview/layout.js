import React from "react";
import {
  View,
  Modal,
  Dimensions,
  ActivityIndicator,
  Image,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  FlatList,
} from "react-native";

import { scaleSzie, localize } from "@utils";
import styles from "./style";
import { DatePicker, Dropdown } from "@components";
import { ItemReview, ItemHeader } from "./widget";
import ImageViewer from "react-native-image-zoom-viewer";
import IMAGE from "@resources";

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

  renderItem = () => {
    return this.props.listReview.map((obj, index) => (
      <ItemReview
        key={index}
        item={obj}
        openImage={this.openImage}
        isVisibleReview={this.isVisibleReview}
      />
    ));
  };

  renderHeader = () => {
    const { rating, count, goodCount, badCount } = this.props.summaryReview;
    return (
      <View>
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
            rating={rating}
            isRating={true}
          />
          <ItemHeader
            title={"Total reivews"}
            content={"All time statictics"}
            rating={count}
          />
          <ItemHeader
            title={"Good reviews"}
            content={"All time statictics"}
            rating={goodCount}
          />
          <ItemHeader
            title={"Bad reviews"}
            content={"All time statictics"}
            rating={badCount}
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
              value={this.formatDataReview(this.state.isReview).value}
              onChangeText={(value) => this.onFilterReview(value)}
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
              value={this.formatDataStatus(this.state.isStatus).value}
              onChangeText={(value) => this.onFilterStatus(value)}
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
        <View
          style={[
            styles.row,
            {
              justifyContent: "space-between",
              paddingHorizontal: scaleSzie(15),
              paddingVertical: 10,
              backgroundColor: "#F1F1F1",
              marginTop: scaleSzie(10),
              alignItems: "center",
            },
          ]}
        >
          <Text style={[styles.titletabar, { width: "12%" }]}>Date</Text>
          <Text style={[styles.titletabar, { width: "15%" }]}>Customer</Text>
          <Text style={[styles.titletabar, { width: "45%" }]}>Review</Text>
          <Text style={[styles.titletabar, { width: "20%" }]}>Rating</Text>
          <Text style={[styles.titletabar, { width: "15%" }]}>Actions</Text>
        </View>
      </View>
    );
  };

  render() {
    const { isLoadMoreReviewList } = this.props;
    return (
      <View style={styles.container}>
        <FlatList
          data={this.props.listReview}
          ListHeaderComponent={this.renderHeader}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }
          renderItem={({ item, index }) => (
            <ItemReview
              key={index}
              item={item}
              openImage={this.openImage}
              isVisibleReview={this.isVisibleReview}
            />
          )}
          keyExtractor={(item, index) => `${index}`}
          onEndReached={this.onLoadmore}
          onEndReachedThreshold={0.5}
          onMomentumScrollBegin={() => {
            this.onEndReachedCalledDuringMomentum = false;
          }}
          removeClippedSubviews={true}
          initialNumToRender={20}
          maxToRenderPerBatch={5}
          ListFooterComponent={() => (
            <View
              style={{
                height: scaleSzie(30),
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {isLoadMoreReviewList ? (
                <ActivityIndicator size="large" color="#0764B0" />
              ) : null}
            </View>
          )}
        />

        <Modal
          visible={this.state.isvisible}
          transparent={true}
          onRequestClose={this.closeImage}
        >
          <ImageViewer
            imageUrls={this.state.imageArr}
            onSwipeDown={this.closeImage}
            enableSwipeDown={true}
            backgroundColor={"#2D2D2DC7"}
            index={this.state.indexImage}
            renderHeader={() => (
              <View style={styles.headerView}>
                <TouchableOpacity
                  style={styles.closeBtn}
                  onPress={this.closeImage}
                >
                  <Image
                    style={styles.close}
                    source={IMAGE.close_appointment_popup}
                  />
                </TouchableOpacity>
              </View>
            )}
          />
        </Modal>
      </View>
    );
  }
}

export default Layout;

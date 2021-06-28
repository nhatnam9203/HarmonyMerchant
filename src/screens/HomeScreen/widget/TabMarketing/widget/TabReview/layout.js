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

import { scaleSize, localize } from "@utils";
import styles from "./style";
import { DatePicker, Dropdown } from "@components";
import { ItemReview, ItemHeader } from "./widget";
import ImageViewer from "react-native-image-zoom-viewer";
import IMAGE from "@resources";
import FastImage from "react-native-fast-image";

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
    const { language } = this.props;
    return (
      <View>
        <View
          style={[
            styles.row,
            {
              justifyContent: "space-between",
              paddingHorizontal: scaleSize(15),
            },
          ]}
        >
          <ItemHeader
            title={`${localize("Aggregate Rating", language)}`}
            content={"All time statistics"}
            rating={rating}
            isRating={true}
          />
          <ItemHeader
            title={`${localize("Total Reviews", language)}`}
            content={"All time statistics"}
            rating={count}
          />
          <ItemHeader
            title={`${localize("Good Reviews", language)}`}
            content={"All time statistics"}
            rating={goodCount}
          />
          <ItemHeader
            title={`${localize("Bad Reviews", language)}`}
            content={"All time statistics"}
            rating={badCount}
          />
        </View>

        {/* FILTERS */}
        <View
          style={[
            styles.row,
            {
              paddingHorizontal: scaleSize(15),
              paddingTop: scaleSize(15),
              alignItems: "center",
            },
          ]}
        >
          <Text style={{ color: "#6A6A6A", fontSize: scaleSize(17) }}>
            Filters
          </Text>
          <View style={[styles.itemDropdown, { width: scaleSize(135) }]}>
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
              paddingHorizontal: scaleSize(15),
              paddingVertical: 10,
              backgroundColor: "#F1F1F1",
              marginTop: scaleSize(10),
              alignItems: "center",
            },
          ]}
        >
          <Text style={[styles.titletabar, { width: "12%" }]}>{`${localize(
            "Date",
            language
          )}`}</Text>
          <Text style={[styles.titletabar, { width: "15%" }]}>{`${localize(
            "Customer",
            language
          )}`}</Text>
          <Text style={[styles.titletabar, { width: "45%" }]}>{`${localize(
            "Review",
            language
          )}`}</Text>
          <Text style={[styles.titletabar, { width: "20%" }]}>{`${localize(
            "Rating",
            language
          )}`}</Text>
          <Text style={[styles.titletabar, { width: "15%" }]}>{`${localize(
            "Actions",
            language
          )}`}</Text>
        </View>
      </View>
    );
  };

  render() {
    const { isLoadMoreReviewList } = this.props;
    return (
      <View style={styles.container}>
        <FlatList
         ref={this.flatListRef}
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
          onEndReachedThreshold={0.1}
          onMomentumScrollBegin={() => {
            this.onEndReachedCalledDuringMomentum = false;
          }}
          removeClippedSubviews={true}
          initialNumToRender={20}
          maxToRenderPerBatch={5}
          ListFooterComponent={() => (
            <View
              style={{
                height: scaleSize(30),
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
            onChange={(index) => this.setIndex(index)}
            saveToLocalByLongPress={false}
            renderImage={(props) => (
              <Image
                {...props}
                style={{
                  height: "80%",
                  marginTop: "20%"
                }}
                resizeMode={"contain"}
              />
            )}
            renderArrowLeft={() =>
              this.state.indexImage === 0 ? (
                <View style={{ marginHorizontal: 20, opacity: 0.5 }}>
                  <Image source={IMAGE.ArrowLeft} />
                </View>
              ) : (
                <TouchableOpacity
                  style={{ marginHorizontal: 15 }}
                  onPress={this.prevImage}
                >
                  <Image source={IMAGE.ArrowLeft} />
                </TouchableOpacity>
              )
            }
            renderArrowRight={() =>
              this.state.indexImage === this.state.imageArr.length - 1 ? (
                <View style={{ marginHorizontal: 20, opacity: 0.5 }}>
                  <Image source={IMAGE.ArrowRight} />
                </View>
              ) : (
                <TouchableOpacity
                  style={{ marginHorizontal: 15 }}
                  onPress={this.nextImage}
                >
                  <Image source={IMAGE.ArrowRight} />
                </TouchableOpacity>
              )
            }
          />
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={this.closeImage}
            >
              <Image
                style={styles.close}
                source={IMAGE.close_appointment_popup}
              />
            </TouchableOpacity>

        </Modal>
      </View>
    );
  }
}

export default Layout;

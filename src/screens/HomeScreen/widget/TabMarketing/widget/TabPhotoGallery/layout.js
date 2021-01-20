import { scaleSzie, localize } from "@utils";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
  TouchableOpacity,
  Image,
} from "react-native";
import styles from "./style";
import { ItemPhoto } from "./widget";
import IMAGE from "@resources";

const data = [
  {
    brandName: "filename.jpg",
    url:
      "https://stc.hoatuoihoangnga.com/data/uploads/news/8d/nhung-dieu-ma-ban-chua-hieu-het-ve-hoa-mai-1577947427224.jpg",
    linking: "https://www.google.com/",
  },
  {
    brandName: "filename.jpg",
    url:
      "https://stc.hoatuoihoangnga.com/data/uploads/news/8d/nhung-dieu-ma-ban-chua-hieu-het-ve-hoa-mai-1577947427224.jpg",
    linking: "https://www.google.com/",
  },
  {
    brandName: "filename.jpg",
    url:
      "https://stc.hoatuoihoangnga.com/data/uploads/news/8d/nhung-dieu-ma-ban-chua-hieu-het-ve-hoa-mai-1577947427224.jpg",
    linking: "https://www.google.com/",
  },
  {
    brandName: "filename.jpg",
    url:
      "https://stc.hoatuoihoangnga.com/data/uploads/news/8d/nhung-dieu-ma-ban-chua-hieu-het-ve-hoa-mai-1577947427224.jpg",
    linking: "https://www.google.com/",
  },
  {
    brandName: "filename.jpg",
    url:
      "https://stc.hoatuoihoangnga.com/data/uploads/news/8d/nhung-dieu-ma-ban-chua-hieu-het-ve-hoa-mai-1577947427224.jpg",
    linking: "https://www.google.com/",
  },
  {
    brandName: "filename.jpg",
    url:
      "https://stc.hoatuoihoangnga.com/data/uploads/news/8d/nhung-dieu-ma-ban-chua-hieu-het-ve-hoa-mai-1577947427224.jpg",
    linking: "https://www.google.com/",
  },
  {
    brandName: "filename.jpg",
    url:
      "https://stc.hoatuoihoangnga.com/data/uploads/news/8d/nhung-dieu-ma-ban-chua-hieu-het-ve-hoa-mai-1577947427224.jpg",
    linking: "https://www.google.com/",
  },
  {
    brandName: "filename.jpg",
    url:
      "https://stc.hoatuoihoangnga.com/data/uploads/news/8d/nhung-dieu-ma-ban-chua-hieu-het-ve-hoa-mai-1577947427224.jpg",
    linking: "https://www.google.com/",
  },
];

class Layout extends React.Component {
  render() {
    const { language, listBanners } = this.props;
    const { isSelected, imageSelect } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.tabName}>
          <Text style={styles.title}>{`${localize(
            "Slide Banner",
            language
          )}`}</Text>
        </View>

        {/* RENDER WHEN LENGTH ITEM = 0 */}
        {/* <View style={styles.upload}>
          <View style={{ height: scaleSzie(70) }} />
          <Text style={styles.text}>You have not uploaded any images yet</Text>
          <View style={{ height: scaleSzie(40) }} />
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity style={styles.btn_upload} onPress={this.takePhoto}>
              <Image style={styles.ic} source={IMAGE.Ic_Camera} />
              <Text style={styles.text}>Take a Photo</Text>
            </TouchableOpacity>
            <View style={{ width: scaleSzie(30) }} />
            <TouchableOpacity style={styles.btn_upload} onPress={this.openImageLibrary}>
              <Image style={styles.ic} source={IMAGE.Ic_Gallery} />
              <Text style={styles.text}>Add Photos</Text>
            </TouchableOpacity>
          </View>
        </View> */}

        {/* RENDER WHEN LENGTH ITEM > 0 */}
        <View style={{ height: "92%" }}>
          <View
            style={{
              backgroundColor: "#FFF",
              marginTop: -1,
              paddingLeft: scaleSzie(15),
              height: "100%",
            }}
          >
            <FlatList
              data={isSelected ? imageSelect : listBanners}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this.onRefresh}
                />
              }
              renderItem={({ item, index }) => (
                <ItemPhoto
                  key={index}
                  item={item}
                  selectImage={this.selectImage}
                  imageSelect={this.state.imageSelect}
                />
              )}
              numColumns={"5"}
              keyExtractor={(item, index) => `${index}`}
              // onEndReached={this.onLoadmore}
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
                    height: scaleSzie(50),
                    justifyContent: "center",
                    marginBottom: scaleSzie(50),
                  }}
                >
                  {/* {isLoadMoreMarketList ? (
                    <ActivityIndicator size="large" color="#0764B0" />
                  ) : null} */}
                </View>
              )}
            />
          </View>
          <View style={styles.footer}>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity style={styles.btn} onPress={this.takePhoto}>
                <Image source={IMAGE.Ic_Camera_Small} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btn}
                onPress={this.openImageLibrary}
              >
                <Image source={IMAGE.Ic_Gallery_Small} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={this.deleteBanner}
              style={[styles.btn, { marginRight: scaleSzie(15) }]}
            >
              <Image source={IMAGE.Trash} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

export default Layout;

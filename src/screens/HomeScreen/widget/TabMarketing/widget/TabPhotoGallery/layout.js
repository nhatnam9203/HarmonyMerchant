import { ScaleSzie, localize } from "@utils";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
  TouchableOpacity,
  Image,
  Modal,
} from "react-native";
import styles from "./style";
import { ItemPhoto } from "./widget";
import IMAGE from "@resources";
import ImageViewer from "react-native-image-zoom-viewer";

class Layout extends React.Component {
  render() {
    const { language, listBanners } = this.props;
    const { isSelected, imageSelect } = this.state;
    return (
      <View style={styles.container}>
        <View>
          <View style={styles.tabName}>
            <Text style={styles.title}>{`${localize(
              "Slide Banner",
              language
            )}`}</Text>
          </View>
          {listBanners.length > 0 ? (
            //  RENDER WHEN LENGTH ITEM > 0
            <View style={{ height: "92%" }}>
              <View
                style={{
                  backgroundColor: "#FFF",
                  marginTop: -1,
                  paddingLeft: ScaleSzie(15),
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
                      index={index}
                      item={item}
                      selectImage={this.selectImage}
                      imageSelect={this.state.imageSelect}
                      isSelected={this.state.isSelected}
                      openImage={this.openImage}
                    />
                  )}
                  ref={(ref) => {
                    this.flatListRef = ref;
                  }}
                  numColumns={"5"}
                  keyExtractor={(item, index) => `${index}`}
                  // onEndReached={this.onLoadmore}
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
                        height: ScaleSzie(50),
                        justifyContent: "center",
                        marginBottom: ScaleSzie(50),
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
                {this.state.isSelected ? (
                  <TouchableOpacity
                    onPress={this.deleteBanner}
                    style={[styles.btn, { marginRight: ScaleSzie(15) }]}
                  >
                    <Image source={IMAGE.Trash} />
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
          ) : (
            //  RENDER WHEN LENGTH ITEM = 0
            <View style={styles.upload}>
              <View style={{ height: ScaleSzie(70) }} />
              <Text style={styles.text}>
                You have not uploaded any images yet
              </Text>
              <View style={{ height: ScaleSzie(40) }} />
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  style={styles.btn_upload}
                  onPress={this.takePhoto}
                  activeOpacity={0.8}
                >
                  <Image style={styles.ic} source={IMAGE.Ic_Camera} />
                  <Text style={styles.text}>Take a Photo</Text>
                </TouchableOpacity>
                <View style={{ width: ScaleSzie(30) }} />
                <TouchableOpacity
                  style={styles.btn_upload}
                  onPress={this.openImageLibrary}
                  activeOpacity={0.8}
                >
                  <Image style={styles.ic} source={IMAGE.Ic_Gallery} />
                  <Text style={styles.text}>Add Photos</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
        <Modal
          visible={this.state.isvisible}
          transparent={true}
          onRequestClose={this.closeImage}
        >
          <ImageViewer
            imageUrls={this.formatImageArr(listBanners)}
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
                  marginVertical: "10%",
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
              this.state.indexImage === listBanners.length - 1 ? (
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
          <TouchableOpacity style={styles.closeBtn} onPress={this.closeImage}>
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

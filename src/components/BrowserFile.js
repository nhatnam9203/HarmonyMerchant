import React from "react";
import { View, Text, StyleSheet, Platform, Image } from "react-native";
import ImagePicker from "react-native-image-picker";

import ButtonCustom from "./ButtonCustom";
import IMAGE from "@resources";
import connectRedux from "@redux/ConnectRedux";

import { scaleSize, gotoSettingsDevice } from "@utils";

class BrowserFile extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      uriUpload: this.props.imageUrl,
      isProcessingUpload: false,
    };
  }

  setImageUrlFromParent = async (url) => {
    await this.setState({
      uriUpload: url,
    });
  };

  handleImagePicker = async (response) => {
    if (response.error === "Photo library permissions not granted") {
      gotoSettingsDevice();
    } else if (response.uri) {
      this.props.editButtonSubmit(false);
      await this.setState({
        isProcessingUpload: true,
      });

      let fileName = response.fileName;
      if (fileName) {
        if (
          Platform.OS === "ios" &&
          (fileName.endsWith(".heic") || fileName.endsWith(".HEIC"))
        ) {
          fileName = `${fileName.split(".")[0]}.JPG`;
        }
      }

      this.props.actions.upload.uploadAvatar([
        {
          uri: response.uri,
          fileName: fileName ? fileName : "",
          type: response.type,
        },
      ]);
    }
  };

  showPicker = () => {
    try {
      //   ImagePicker.showImagePicker(
      //     {
      //       quality: 0.2,
      //     },
      //     (response) => this.handleImagePicker(response)
      //   );

      ImagePicker.launchImageLibrary({ quality: 0.2 }, (response) => {
        if (response.uri) {
          this.handleImagePicker(response);
        }
      });
    } catch (error) {
      alert(error);
    }
  };

  render() {
    const { uriUpload } = this.state;
    const temptImage =
      uriUpload === "" ? IMAGE.imagePlaceHolder : { uri: uriUpload };
    return (
      <View style={{ marginBottom: scaleSize(10), marginTop: scaleSize(10) }}>
        <Text
          style={[
            {
              color: "#404040",
              fontSize: scaleSize(12),
              marginBottom: scaleSize(10),
            },
            this.props.styleText,
          ]}
        >
          Image
        </Text>
        <View style={{ flexDirection: "row" }}>
          <View style={{ width: scaleSize(80), height: scaleSize(80) }}>
            <Image
              source={temptImage}
              style={{ width: scaleSize(80), height: scaleSize(80) }}
            />
          </View>
          <View
            style={{ justifyContent: "flex-end", marginLeft: scaleSize(16) }}
          >
            <ButtonCustom
              width={scaleSize(150)}
              height={38}
              backgroundColor="#F1F1F1"
              title={"Browse File"}
              textColor="#6A6A6A"
              onPress={this.showPicker}
              style={[{ borderRadius: scaleSize(2) }, styles.shadowBtn]}
              styleText={{
                fontSize: scaleSize(16),
              }}
            />
          </View>
        </View>
      </View>
    );
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    const { loading, isUpload, dataUpload } = this.props;
    const { isProcessingUpload } = this.state;
    if (isUpload && isUpload !== prevProps.isUpload && isProcessingUpload) {
      this.props.actions.upload.resetStateUpload();
      this.props.editButtonSubmit(true);
      await this.setState({
        isProcessingUpload: false,
        uriUpload: dataUpload.url,
      });
      this.props.updateFileId(dataUpload.fileId);
    } else if (!loading && dataUpload === false && isProcessingUpload) {
      this.props.actions.upload.resetStateUpload();
      this.props.editButtonSubmit(true);
      await this.setState({
        isProcessingUpload: false,
      });
    }
  }
}

const styles = StyleSheet.create({
  shadowBtn: {
    ...Platform.select({
      ios: {
        borderRadius: scaleSize(2),
        shadowColor: "rgba(0, 0, 0, 0.5)",
        shadowOpacity: 0.54,
        shadowOffset: { width: 0, height: 0 },
      },

      android: {
        elevation: 2,
      },
    }),
  },
});

const mapStateToProps = (state) => ({
  language: state.dataLocal.language,
  loading: state.app.loading,
  isUpload: state.upload.isUpload,
  dataUpload: state.upload.dataUpload,
  isResetInfoAdmin: state.staff.isResetInfoAdmin,
});

export default connectRedux(mapStateToProps, BrowserFile);

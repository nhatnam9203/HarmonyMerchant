import connectRedux from "@redux/ConnectRedux";
import { gotoSettingsDevice } from "@utils";
import React from "react";
import { Platform } from "react-native";
import * as ImagePicker from "react-native-image-picker";
import Layout from "./layout";

class TabPhotoGallery extends Layout {
  constructor(props) {
    super(props);
    this.state = {
      isvisible: false,
      refreshing: false,
      uriUpload: "",
      bannerUpload: {
        uri: "",
        fileName: "",
        type: "",
      },
      imageSelect: [],
      isSelected: false,
      indexImage: 0,
    };
    this.onEndReachedCalledDuringMomentum = true;
    this.flatListRef = React.createRef();
  }

  componentDidMount() {
    // this.props.actions.review.getListMarketPlace();
  }

  openImage = (index) => {
    this.setState({
      isvisible: true,
      indexImage: index,
    });
  };

  closeImage = () => {
    this.setState({ isvisible: false });
  };

  formatImageArr = (oldArr) => {
    const resultArr = oldArr.map((item) => ({
      url: item.imageUrl,
      id: item.merchantBannerId,
      // width: Image.getSize(item.imageUrl, (width)),
      // height: Image.getSize(item.imageUrl, (height)),
    }));
    return resultArr;
  };

  setIndex = (index) => {
    this.setState({ indexImage: index });
  };

  nextImage = () => {
    if (this.state.indexImage < this.props.listBanners?.length - 1) {
      this.setState({ indexImage: this.state.indexImage + 1 });
    }
  };

  prevImage = () => {
    if (this.state.indexImage > 0) {
      this.setState({ indexImage: this.state.indexImage - 1 });
    }
  };

  onRefresh = () => {
    const { profile } = this.props;
    this.setState({ refreshing: true, isSelected: false, imageSelect: [] });
    this.props.actions.marketing.getBannerMerchant(
      profile.merchantId,
      false,
      true
    );
    this.setState({ refreshing: false });
  };

  handleUploadBannerLocal = async (response) => {
    const { profile } = this.props;
    if (response.error === "Photo library permissions not granted") {
      gotoSettingsDevice();
    } else if (response.uri) {
      let fileName = response?.fileName || `IMG_${response?.fileSize}.JPG`;
      if (
        Platform.OS === "ios" &&
        (fileName.endsWith(".heic") || fileName.endsWith(".HEIC"))
      ) {
        fileName = `${fileName.split(".")[0]}.JPG`;
      }

      const bannerUpload = {
        uri: response.uri,
        fileName: fileName,
        type: response.type,
      };
      const infoImage = {
        title: fileName,
        description: "",
      };
      this.props.actions.upload.uploadBanner(
        [bannerUpload],
        infoImage,
        profile.merchantId
      );
    }
  };

  takePhoto = () => {
    this.setState({ isSelected: false });
    ImagePicker.launchCamera({}, (response) => {
      if (response?.assets?.length > 0) {
        this.handleUploadBannerLocal(response?.assets[0]);
      }
    });
  };

  openImageLibrary = () => {
    this.setState({ isSelected: false });
    ImagePicker.launchImageLibrary({}, (response) => {
      if (response?.assets?.length > 0) {
        this.handleUploadBannerLocal(response?.assets[0]);
      }
    });
  };

  deleteBanner = () => {
    const { profile } = this.props;
    const isSelectedImage = this.state.imageSelect.filter(
      (item) => item.selected === true
    );
    const arrBody = isSelectedImage.map((item) => item.merchantBannerId);

    this.props.actions.marketing.deleteBannerMerchant(
      arrBody,
      profile.merchantId
    );
    setTimeout(() => {
      this.setState({ isSelected: false, imageSelect: [] });
    }, 500);
  };

  selectImage = (id) => {
    let imageSelect = [...this.props.listBanners];
    for (let data of imageSelect) {
      if (data.merchantBannerId == id) {
        data.selected = data.selected == null ? true : !data.selected;
        break;
      }
    }
    this.setState({ imageSelect });
    const isCheckSelect = imageSelect.findIndex(
      (item) => item.selected === true
    );
    if (isCheckSelect !== -1) {
      this.setState({ isSelected: true });
    } else {
      this.setState({ isSelected: false });
    }
  };

  setStateFromParent = () => {
    this.setState({ isSelected: false, imageSelect: [] });
    if (this.flatListRef?.current) {
      this.flatListRef?.current?.scrollToOffset({ y: 0, animated: false });
    }
  };
}

const mapStateToProps = (state) => ({
  language: state.dataLocal.language,
  profile: state.dataLocal.profile,
  listBanners: state.marketing?.listBanners,
  isUploadBanner: state.marketing.isUploadBanner,
  loading: state.app.loading,
  refreshBannerList: state.marketing.refreshBannerList,
});

export default connectRedux(mapStateToProps, TabPhotoGallery);

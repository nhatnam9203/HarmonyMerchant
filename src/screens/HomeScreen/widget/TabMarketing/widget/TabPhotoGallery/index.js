import Layout from "./layout";
import connectRedux from "@redux/ConnectRedux";
import { gotoSettingsDevice, scaleSzie } from "@utils";
import ImagePicker from "react-native-image-picker";
import { Platform } from "react-native";
import ItemPhoto from "./widget/ItemPhoto";

const Data = [
  {
    merchantBannerId: 1,
    brandName: "filename.jpg",
    url:
      "https://stc.hoatuoihoangnga.com/data/uploads/news/8d/nhung-dieu-ma-ban-chua-hieu-het-ve-hoa-mai-1577947427224.jpg",
    linking: "https://www.google.com/",
  },
  {
    merchantBannerId: 2,
    brandName: "filename.jpg",
    url:
      "https://stc.hoatuoihoangnga.com/data/uploads/news/8d/nhung-dieu-ma-ban-chua-hieu-het-ve-hoa-mai-1577947427224.jpg",
    linking: "https://www.google.com/",
  },
  {
    merchantBannerId: 3,
    brandName: "filename.jpg",
    url:
      "https://stc.hoatuoihoangnga.com/data/uploads/news/8d/nhung-dieu-ma-ban-chua-hieu-het-ve-hoa-mai-1577947427224.jpg",
    linking: "https://www.google.com/",
  },
];

class TabPhotoGallery extends Layout {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      uriUpload: "",
      bannerUpload: {
        uri: "",
        fileName: "",
        type: "",
      },
      imageSelect: [],
      isSelected: false,
    };
    this.onEndReachedCalledDuringMomentum = true;
  }

  componentDidMount() {
    // this.props.actions.review.getListMarketPlace();
  }

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
      let fileName = response?.fileName || "";
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
      if (response.uri) {
        this.handleUploadBannerLocal(response);
      }
    });
  };

  openImageLibrary = () => {
    this.setState({ isSelected: false });
    ImagePicker.launchImageLibrary({}, (response) => {
      if (response.uri) {
        this.handleUploadBannerLocal(response);
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
    this.flatListRef.scrollToOffset({ y: 0, animated: false });
  };
}

const mapStateToProps = (state) => ({
  language: state.dataLocal.language,
  profile: state.dataLocal.profile,
  listBanners: state.marketing.listBanners,
  isUploadBanner: state.marketing.isUploadBanner,
  loading: state.app.loading,
  refreshBannerList: state.marketing.refreshBannerList,
});

export default connectRedux(mapStateToProps, TabPhotoGallery);

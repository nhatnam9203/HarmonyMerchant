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
      imageSelect: this.props.listBanners,
      isSelected: false,
    };
    this.onEndReachedCalledDuringMomentum = true;
  }

  componentDidMount() {
    // this.props.actions.review.getListMarketPlace();
  }

  onLoadmore = () => {
    if (!this.onEndReachedCalledDuringMomentum) {
      const { totalPages, currentPage } = this.props;
      if (currentPage < totalPages) {
        this.props.actions.review.getListReview(
          this.state.isStatus,
          this.state.isReview,
          parseInt(currentPage + 1),
          false,
          true
        );
        this.onEndReachedCalledDuringMomentum = true;
      }
    }
  };

  onRefresh = () => {
    const { profile } = this.props;
    this.setState({ refreshing: true, isSelected: false });
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

  deleteBanner = async () => {
    const { profile } = this.props;
    const isSelectedImage = this.state.imageSelect.filter((item) => item.selected === true);
    console.log(isSelectedImage)
    // const { merchantBannerIdDelete } = this.state;

    // this.props.actions.marketing.deleteBannerMerchant(
    //   merchantBannerIdDelete,
    //   profile.merchantId
    // );
  };

  cancelUploadBannerLocal = async () => {
    await this.setState({
      bannerUpload: {
        uri: "",
        fileName: "",
        type: "",
      },
    });
  };

  selectImage = (id) => {
    const isCheckSelect = this.state.imageSelect.findIndex(
      (item) => item.selected === true
    );
    if (isCheckSelect !== -1) {
      this.setState({ isSelected: false });
    } else {
      this.setState({ isSelected: true });
    }
    let imageSelect = [...this.props.listBanners];
    for (let data of imageSelect) {
      if (data.merchantBannerId == id) {
        data.selected = data.selected == null ? true : !data.selected;
        break;
      }
    }
    this.setState({ imageSelect });
    // console.log(imageSelect);
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

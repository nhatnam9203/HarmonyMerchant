import ImagePicker from 'react-native-image-picker';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import NavigationServices from "@navigators/NavigatorServices";


class TabCustomBanner extends Layout {

    constructor(props) {
        super(props);
        this.state = {
            uriUpload: '',
            visibleDeleteBanner: false,
            merchantBannerIdDelete: -1
        }
    }

    componentDidMount() {
        const { profile } = this.props;
        this.props.actions.marketing.getBannerMerchant(profile.merchantId);
    }

    takePhoto = () => {
        ImagePicker.launchCamera({}, (response) => {
            if (response.uri) {
                this.setState({
                    uriUpload: response.uri,
                })
            }
        });
    }

    openImageLibrary = () => {
        ImagePicker.launchImageLibrary({}, (response) => {
            if (response.uri) {
                this.setState({
                    uriUpload: response.uri,
                })
            }
        });
    }

    deleteBanner = async (merchantBannerId) => {
        await this.setState({
            visibleDeleteBanner: true,
            merchantBannerIdDelete: merchantBannerId
        })
    }

    submitDeleteBanner = async () => {
        const { profile } = this.props;
        const { merchantBannerIdDelete } = this.state;
        await this.setState({
            visibleDeleteBanner:false
        })
        this.props.actions.marketing.deleteBannerMerchant(merchantBannerIdDelete, profile.merchantId);
    }


}

const mapStateToProps = state => ({
    language: state.dataLocal.language,
    profile: state.dataLocal.profile,
    listBanners: state.marketing.listBanners
})



export default connectRedux(mapStateToProps, TabCustomBanner);
import React from 'react';
import ImagePicker from 'react-native-image-picker';
import {
    Platform
} from 'react-native';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import NavigationServices from "@navigators/NavigatorServices";
import { gotoSettingsDevice ,ScaleSzie} from '@utils';



class TabCustomBanner extends Layout {

    constructor(props) {
        super(props);
        this.state = {
            uriUpload: '',
            visibleDeleteBanner: false,
            merchantBannerIdDelete: -1,
            bannerUpload: {
                uri: '',
                fileName: '',
                type: ''
            },
            titleBanner: '',
            descriptionBanner: ''
        }
        this.scrollTabRef = React.createRef();
        this.scrollInputRef = React.createRef();
    }

    componentDidMount() {
        const { profile } = this.props;
        // this.props.actions.marketing.getBannerMerchant(profile.merchantId,true);
    }

    scrollInputTo = (index) =>{
        this.scrollInputRef.current.scrollTo({x: 0, y: ScaleSzie(index), animated: true})
    }

    onRefreshBannerList = () =>{
        const { profile } = this.props;
        this.props.actions.marketing.getBannerMerchant(profile.merchantId,false,true);
    }

    handleUploadBannerLocal = async (response) => {
        if (response.error === "Photo library permissions not granted") {
            gotoSettingsDevice();
        } else if (response.uri) {
            let fileName = response.fileName;
            if (fileName) {
                if (Platform.OS === 'ios' && (fileName.endsWith('.heic') || fileName.endsWith('.HEIC'))) {
                    fileName = `${fileName.split(".")[0]}.JPG`;
                }
            }

            const bannerUpload = {
                uri: response.uri,
                fileName: fileName,
                type: response.type
            }

            await this.setState({
                bannerUpload
            });
        }



    }

    takePhoto = () => {
        ImagePicker.launchCamera({}, (response) => {
            if (response.uri) {
                this.handleUploadBannerLocal(response);
            }
        });
    }

    openImageLibrary = () => {
        ImagePicker.launchImageLibrary({}, (response) => {
            if (response.uri) {
                this.handleUploadBannerLocal(response);
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
            visibleDeleteBanner: false
        })
        this.props.actions.marketing.deleteBannerMerchant(merchantBannerIdDelete, profile.merchantId);
    }

    cancelUploadBannerLocal = async () => {
        await this.setState({
            bannerUpload: {
                uri: '',
                fileName: '',
                type: ''
            }
        })
    }

    gotoPageUploadToServer = () => {
        const { bannerUpload } = this.state;
        if (bannerUpload.uri) {
            this.scrollTabRef.current.goToPage(1);
        } else {
            alert('Please upload a photo')
        }
    }

    uploadBannerToServer = () => {
        const { profile } = this.props;
        const { titleBanner, descriptionBanner, bannerUpload } = this.state;
        if (titleBanner && descriptionBanner) {
            this.props.actions.upload.uploadBanner([bannerUpload], {
                title: titleBanner,
                description: descriptionBanner
            }, profile.merchantId)
        } else {
            alert('Please enter full infomation!')
        }
    }

    async componentDidUpdate(prevprops, prevState) {
        const { isUploadBanner, loading } = this.props;
        if (!loading && loading !== prevprops.loading && isUploadBanner) {
            await this.setState({
                bannerUpload: {
                    uri: '',
                    fileName: '',
                    type: ''
                },
                titleBanner: '',
                descriptionBanner: ''
            });
            this.scrollTabRef.current.goToPage(0);
            this.props.actions.marketing.resetStateUploadBanner();
        }
    }


}

const mapStateToProps = state => ({
    language: state.dataLocal.language,
    profile: state.dataLocal.profile,
    listBanners: state.marketing.listBanners,
    isUploadBanner: state.marketing.isUploadBanner,
    loading: state.app.loading,
    refreshBannerList: state.marketing.refreshBannerList
})



export default connectRedux(mapStateToProps, TabCustomBanner);
import ImagePicker from 'react-native-image-picker';

import Layout from './layout';
import connectRedux from '../../../../../../redux/ConnectRedux';
import NavigationServices from "../../../../../../navigators/NavigatorServices";


class TabCustomBanner extends Layout {

    constructor(props) {
        super(props);
        this.state ={
            uriUpload:''
        }
    }

    takePhoto = () => {
        ImagePicker.launchCamera({}, (response) => {
            if (response.uri) {
                // this.setState({
                //     uriUpload: response.uri,
                //     visibleUpload: true
                // })
            }
        });
    }

    openImageLibrary = () => {
        ImagePicker.launchImageLibrary({}, (response) => {
            if (response.uri) {
                // this.setState({
                //     uriUpload: response.uri,
                //     visibleUpload: true
                // })
            }
        });
    }


}

const mapStateToProps = state => ({
    profile: state.dataLocal.profile,
})



export default connectRedux(mapStateToProps, TabCustomBanner);
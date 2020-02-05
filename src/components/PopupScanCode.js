import React from 'react';
import {
    View,
} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera} from 'react-native-camera';

import PopupParent from './PopupParent';
import { scaleSzie,  } from '../utils';
import connectRedux from '@redux/ConnectRedux';

class PopupScanCode extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        };
        this.scannerRef = React.createRef();
    }



    onSuccess = (e) => {
        this.props.resultScanCode(e);
    }

    render() {
        const {  onRequestClose, hideCloseButton,
            visible
        } = this.props;
        const {  customStyle } = this.state;
        return (
            <PopupParent
                title={"Scan Your Code"}
                visible={visible}
                onRequestClose={() => onRequestClose()}
                hideCloseButton={hideCloseButton}
                style={customStyle}
                width={500}
            >
                <View style={{
                    height: scaleSzie(400),
                    width: scaleSzie(500),
                    backgroundColor: "#fff",
                    borderBottomLeftRadius: scaleSzie(15), borderBottomRightRadius: scaleSzie(15),
                    overflow:"hidden",
                }} >
                    <QRCodeScanner
                        ref={this.scannerRef}
                        onRead={this.onSuccess}
                        cameraProps={{ flashMode: RNCamera.Constants.FlashMode.auto }}
                        showMarker={true}
                        reactivateTimeout={3000}
                        containerStyle={{
                            height: scaleSzie(400),
                            width: scaleSzie(500),
                        }}

                        cameraStyle={{
                            height: scaleSzie(400),
                            width: scaleSzie(500),
                        }}
                    />

                </View>
            </PopupParent>
        );
    }
}


const mapStateToProps = state => ({
    language: state.dataLocal.language,
    isShowButtonEnterPinCode: state.staff.isShowButtonEnterPinCode,
    visiblePopupActiveGiftCard: state.appointment.visiblePopupActiveGiftCard
});

export default connectRedux(mapStateToProps, PopupScanCode);


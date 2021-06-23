import React from 'react';
import {
    View,
    Text,
} from 'react-native';

import ButtonCustom from './ButtonCustom';
import PopupParent from './PopupParent';
import { ScaleSzie } from '../utils';
import connectRedux from '@redux/ConnectRedux';

class PopupDisconnected extends React.Component {

    onPress = () => {
        this.props.actions.app.toogleOfflineMode(true);
        this.props.actions.appointment.checkAppointmentBeforOffline(true);
    }

    render() {
        const {  visibleDisconnect } = this.props;
        return (
            <PopupParent
                title={"Warning"}
                visible={visibleDisconnect}
                onRequestClose={() => { }}
                hideCloseButton={true}
            >
                <View style={{
                    height: ScaleSzie(130), backgroundColor: '#fff',
                    borderBottomLeftRadius: ScaleSzie(15), borderBottomRightRadius: ScaleSzie(15)
                }} >
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                        <Text style={{ color: '#404040', fontSize: ScaleSzie(18) }} >
                            Your internet is disconnected !
                        </Text>
                        <Text style={{ color: '#404040', fontSize: ScaleSzie(18) }} >
                            You will use offline mode.
                        </Text>
                    </View>
                    <View style={{
                        height: ScaleSzie(45), flexDirection: 'row',
                    }} >
                        <View style={{ flex: 1, alignItems: 'center' }} >
                            <ButtonCustom
                                width={'30%'}
                                height={35}
                                title="OK"
                                backgroundColor="#EC1818"
                                textColor="#fff"
                                onPress={this.onPress}
                                style={{
                                    borderWidth: 1,
                                    borderColor: '#C5C5C5'
                                }}
                                styleText={{
                                    fontSize: ScaleSzie(14)
                                }}
                            />
                        </View>

                    </View>
                </View>
            </PopupParent>
        );
    }

}

const mapStateToProps = state => ({
    visibleDisconnect: state.app.visibleDisconnect
})

export default connectRedux(mapStateToProps, PopupDisconnected);

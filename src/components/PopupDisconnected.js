import React from 'react';
import {
    View,
    Text,
} from 'react-native';

import ButtonCustom from './ButtonCustom';
import PopupParent from './PopupParent';
import { scaleSzie } from '../utils';
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
                    height: scaleSzie(130), backgroundColor: '#fff',
                    borderBottomLeftRadius: scaleSzie(15), borderBottomRightRadius: scaleSzie(15)
                }} >
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                        <Text style={{ color: '#404040', fontSize: scaleSzie(18) }} >
                            Your internet is disconnected !
                        </Text>
                        <Text style={{ color: '#404040', fontSize: scaleSzie(18) }} >
                            You will use offline mode.
                        </Text>
                    </View>
                    <View style={{
                        height: scaleSzie(45), flexDirection: 'row',
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
                                    fontSize: scaleSzie(14)
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

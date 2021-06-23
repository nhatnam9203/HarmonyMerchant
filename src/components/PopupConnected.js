import React from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet
} from 'react-native';

import ButtonCustom from './ButtonCustom';
import PopupParent from './PopupParent';
import { ScaleSzie } from '../utils';
import connectRedux from '@redux/ConnectRedux';

class PopupConnected extends React.Component {

    onPress =() =>{
        const { listAppointmentsOfflineMode } = this.props;
        if (listAppointmentsOfflineMode.length > 0) {
            this.props.actions.appointment.submitAppointmentOffline(listAppointmentsOfflineMode);
        }
         this.props.actions.app.showPopupConneted(false);
         


    }

    render() {
        const { visibleConnected } = this.props;
        return (
            <PopupParent
                title={"Warning"}
                visible={visibleConnected}
                onRequestClose={() => { }}
                hideCloseButton={true}
            >
                <View style={{
                    height: ScaleSzie(130), backgroundColor: '#fff',
                    borderBottomLeftRadius: ScaleSzie(15), borderBottomRightRadius: ScaleSzie(15)
                }} >
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                        <Text style={{ color: '#404040', fontSize: ScaleSzie(18) }} >
                            Your internet is connected !
                        </Text>
                        <Text style={{ color: '#404040', fontSize: ScaleSzie(18) }} >
                            You will use online mode.
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
                                backgroundColor="#0764B0"
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
    visibleConnected: state.app.visibleConnected,
    listAppointmentsOfflineMode: state.dataLocal.listAppointmentsOfflineMode,
})


export default connectRedux(mapStateToProps, PopupConnected);




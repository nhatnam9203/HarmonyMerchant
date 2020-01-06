import React from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet
} from 'react-native';

import ButtonCustom from './ButtonCustom';
import PopupParent from './PopupParent';
import { scaleSzie } from '../utils';
import connectRedux from '@redux/ConnectRedux';

class PopupDisconnected extends React.Component {

    render() {
        const { title, message, onRequestClose, confimYes ,visibleDisconnect} = this.props;
        return (
            <PopupParent
                title={"Warning"}
                visible={visibleDisconnect}
                onRequestClose={() => {}}
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
                                backgroundColor="#fff"
                                title="OK"
                                textColor="#6A6A6A"
                                onPress={() => {}}
                                style={{
                                    borderWidth: 1,
                                    borderColor: '#C5C5C5'
                                }}
                                styleText={{
                                    fontSize: scaleSzie(14)
                                }}
                            />
                        </View>
                        {/* <View style={{ flex: 1, alignItems: 'center' }} >
                            <ButtonCustom
                                width={'60%'}
                                height={35}
                                backgroundColor="#EC1818"
                                title="LOG OUT"
                                textColor="#fff"
                                onPress={() => confimYes()}
                                styleText={{
                                    fontSize: scaleSzie(14)
                                }}
                            />
                        </View> */}

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


// export default PopupDisconnected;


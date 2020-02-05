import React from 'react';
import {
    View,
    Text,
} from 'react-native';

import ButtonCustom from './ButtonCustom';
import PopupParent from './PopupParent';
import { scaleSzie,localize } from '../utils';

class PopupLogout extends React.Component {

    render() {
        const { title, visible, message,onRequestClose,confimYes,language } = this.props;

        return (
            <PopupParent
                title={title}
                visible={visible}
                onRequestClose={() => onRequestClose()}
            >
                <View style={{
                    height: scaleSzie(130), backgroundColor: '#fff',
                    borderBottomLeftRadius: scaleSzie(15), borderBottomRightRadius: scaleSzie(15)
                }} >
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                        <Text style={{ color: '#404040', fontSize: scaleSzie(18) }} >
                            {message}
                        </Text>
                    </View>
                    <View style={{
                        height: scaleSzie(45), flexDirection: 'row',
                    }} >
                        <View style={{ flex: 1, alignItems: 'center' }} >
                            <ButtonCustom
                                width={'60%'}
                                height={35}
                                backgroundColor="#fff"
                                title={localize('CANCEL', language)}
                                textColor="#6A6A6A"
                                onPress={() => onRequestClose()}
                                style={{
                                    borderWidth: 1,
                                    borderColor: '#C5C5C5'
                                }}
                                styleText={{
                                    fontSize: scaleSzie(14)
                                }}
                            />
                        </View>
                        <View style={{ flex: 1, alignItems: 'center' }} >
                            <ButtonCustom
                                width={'60%'}
                                height={35}
                                backgroundColor="#EC1818"
                                title={localize('LOG OUT', language)}
                                textColor="#fff"
                                onPress={() => confimYes()}
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


export default PopupLogout;


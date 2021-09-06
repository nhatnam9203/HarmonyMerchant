import React from 'react';
import {
    View,
    Text,
} from 'react-native';

import ButtonCustom from './ButtonCustom';
import PopupParent from './PopupParent';
import { scaleSize } from '../utils';

class PopupConfirm extends React.Component {

    render() {
        const { title, 
            visible, 
            message,
            onRequestClose,
            confimYes ,
            hideCloseButton,
            textLeftButton,
            textRightButton,
            confirmNo,
        } = this.props;
        return (
            <PopupParent
                title={title}
                visible={visible}
                onRequestClose={() => onRequestClose()}
                hideCloseButton={hideCloseButton}
            >
                <View style={{
                    height: scaleSize(130), backgroundColor: '#fff',
                    borderBottomLeftRadius: scaleSize(15), borderBottomRightRadius: scaleSize(15)
                }} >
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                        <Text style={{ color: '#404040', fontSize: scaleSize(18),textAlign:"center" }} >
                            {message}
                        </Text>
                    </View>
                    <View style={{
                        height: scaleSize(45), flexDirection: 'row',
                    }} >
                        <View style={{ flex: 1, alignItems: 'center' }} >
                            <ButtonCustom
                                width={'60%'}
                                height={35}
                                backgroundColor="#fff"
                                title={textLeftButton ? textLeftButton : "No"}
                                textColor="#6A6A6A"
                                onPress={() => confirmNo ? confirmNo : onRequestClose()}
                                style={{
                                    borderWidth: 1,
                                    borderColor: '#C5C5C5'
                                }}
                                styleText={{
                                    fontSize: scaleSize(14)
                                }}
                            />
                        </View>
                        <View style={{ flex: 1, alignItems: 'center' }} >
                            <ButtonCustom
                                width={'60%'}
                                height={35}
                                backgroundColor="#0764B0"
                                title={ textRightButton ? textRightButton : "Yes" }
                                textColor="#fff"
                                onPress={() => confimYes()}
                                styleText={{
                                    fontSize: scaleSize(14)
                                }}
                            />
                        </View>

                    </View>
                </View>
            </PopupParent>
        );
    }

}


export default PopupConfirm;


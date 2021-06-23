import React from 'react';
import {
    View,
    Text,
    Image
} from 'react-native';

import { ButtonCustom, PopupParent } from '@components';
import { ScaleSzie } from '@utils';
import ICON from '@resources';

class ErrorMessagePaxModal extends React.Component {

    render() {
        const { title, visible, message, onRequestClose, confimYes, hideCloseButton } = this.props;
        return (
            <PopupParent
                title={title}
                visible={visible}
                onRequestClose={() => onRequestClose()}
                hideCloseButton={hideCloseButton}
            >
                <View style={{
                    minHeight: ScaleSzie(180), backgroundColor: '#fff',
                    borderBottomLeftRadius: ScaleSzie(15), borderBottomRightRadius: ScaleSzie(15)
                }} >
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: ScaleSzie(10) }} >
                        <Image source={ICON.danger} />
                        <Text style={{ color: '#404040', fontSize: ScaleSzie(14), textAlign: "center", marginVertical: ScaleSzie(12) }} >
                            {message}
                        </Text>
                    </View>
                    <View style={{
                        height: ScaleSzie(65), flexDirection: 'row',
                        borderTopColor: '#EEEEEE', borderTopWidth: 1, alignItems: 'center', justifyContent: 'center'
                    }} >

                        <ButtonCustom
                            width={ScaleSzie(130)}
                            height={35}
                            backgroundColor="#0764B0"
                            title="OK"
                            textColor="#fff"
                            onPress={() => confimYes()}
                            styleText={{
                                fontSize: ScaleSzie(14)
                            }}
                        />

                    </View>
                </View>
            </PopupParent>
        );
    }

}

export default ErrorMessagePaxModal;


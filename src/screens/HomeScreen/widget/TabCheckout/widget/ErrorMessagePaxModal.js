import React from 'react';
import {
    View,
    Text,
    Image
} from 'react-native';

import { ButtonCustom, PopupParent } from '@components';
import { scaleSzie } from '@utils';
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
                    minHeight: scaleSzie(180), backgroundColor: '#fff',
                    borderBottomLeftRadius: scaleSzie(15), borderBottomRightRadius: scaleSzie(15)
                }} >
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                        <Image source={ICON.danger} />
                        <Text style={{ color: '#404040', fontSize: scaleSzie(16), textAlign: "center", marginVertical: scaleSzie(20) }} >
                            {message}
                        </Text>
                    </View>
                    <View style={{
                        height: scaleSzie(70), flexDirection: 'row',
                        borderTopColor: '#EEEEEE', borderTopWidth: 1, alignItems: 'center', justifyContent: 'center'
                    }} >

                        <ButtonCustom
                            width={scaleSzie(130)}
                            height={35}
                            backgroundColor="#0764B0"
                            title="OK"
                            textColor="#fff"
                            onPress={() => confimYes()}
                            styleText={{
                                fontSize: scaleSzie(14)
                            }}
                        />

                    </View>
                </View>
            </PopupParent>
        );
    }

}

export default ErrorMessagePaxModal;


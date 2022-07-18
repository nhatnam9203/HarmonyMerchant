import React from 'react';
import {
    View,
    Text,
    Image
} from 'react-native';

import { ButtonCustom, PopupParent } from '@components';
import { scaleSize, PaymentTerminalType } from '@utils';
import ICON from '@resources';

class ErrorMessagePaxModal extends React.Component {

    render() {
        const { title, visible, message, onRequestClose, confimYes, onConfirmRefresh, hideCloseButton, isShowRefreshButton } = this.props;
        return (
            <PopupParent
                title={title}
                visible={visible}
                onRequestClose={() => onRequestClose()}
                hideCloseButton={hideCloseButton}
            >
                <View style={{
                    minHeight: scaleSize(180), backgroundColor: '#fff',
                    borderBottomLeftRadius: scaleSize(15), borderBottomRightRadius: scaleSize(15)
                }} >
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: scaleSize(10) }} >
                        <Image source={ICON.danger} />
                        <Text style={{ color: '#404040', fontSize: scaleSize(14), textAlign: "center", marginVertical: scaleSize(12) }} >
                            {message}
                        </Text>
                    </View>
                    <View style={{
                        height: scaleSize(65), flexDirection: 'row',
                        borderTopColor: '#EEEEEE', borderTopWidth: 1, alignItems: 'center', justifyContent: 'center'
                    }} >

                        {
                            isShowRefreshButton ?
                            <>
                                <ButtonCustom
                                    width={scaleSize(130)}
                                    height={35}
                                    backgroundColor="#0764B0"
                                    title="Retry"
                                    textColor="#fff"
                                    onPress={() => onConfirmRefresh()}
                                    styleText={{
                                        fontSize: scaleSize(14)
                                    }}
                                />
                                <View style={{width: scaleSize(10)}}/>
                                <ButtonCustom
                                    width={scaleSize(130)}
                                    height={35}
                                    backgroundColor="#0764B0"
                                    title="Cancel"
                                    textColor="#fff"
                                    onPress={() => confimYes()}
                                    styleText={{
                                        fontSize: scaleSize(14)
                                    }}
                                />
                            </>
                            :
                            <ButtonCustom
                                width={scaleSize(130)}
                                height={35}
                                backgroundColor="#0764B0"
                                title="Cancel"
                                textColor="#fff"
                                onPress={() => confimYes()}
                                styleText={{
                                    fontSize: scaleSize(14)
                                }}
                            />
                        }
                        

                    </View>
                </View>
            </PopupParent>
        );
    }

}

export default ErrorMessagePaxModal;


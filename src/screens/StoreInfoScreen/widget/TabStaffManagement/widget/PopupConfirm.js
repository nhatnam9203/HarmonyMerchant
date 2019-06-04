import React from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet
} from 'react-native';

import {
    InputAuth, ButtonCustom, Button, ModalCustom,
    PopupParent
} from '../../../../../components';
import { scaleSzie } from '../../../../../utils';
import IMAGE from '../../../../../resources';

class PopupConfirm extends React.Component {

    render() {
        return (
            <PopupParent>
                <View style={{
                    height: scaleSzie(130), backgroundColor: '#fff',
                    borderBottomLeftRadius: scaleSzie(15), borderBottomRightRadius: scaleSzie(15)
                }} >
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                        <Text style={{ color: '#404040', fontSize: scaleSzie(18) }} >
                            Do you want to Archive this Staff ?
                        </Text>
                    </View>
                    <View style={{
                        height: scaleSzie(55), flexDirection: 'row',
                    }} >
                        <View style={{ flex: 1,  alignItems: 'center' }} >
                            <ButtonCustom
                                width={'60%'}
                                height={35}
                                backgroundColor="#fff"
                                title="No"
                                textColor="#6A6A6A"
                                onPress={this.nextTab}
                                style={{
                                    borderWidth:1,
                                    borderColor:'#C5C5C5'
                                }}
                                styleText={{
                                    fontSize:scaleSzie(14)
                                }}
                            />
                        </View>
                        <View style={{ flex: 1,  alignItems: 'center' }} >
                            <ButtonCustom
                                width={'60%'}
                                height={35}
                                backgroundColor="#0764B0"
                                title="Yes"
                                textColor="#fff"
                                onPress={this.nextTab}
                                styleText={{
                                    fontSize:scaleSzie(14)
                                }}
                            />
                        </View>

                    </View>
                </View>
            </PopupParent>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    footer: {
        height: scaleSzie(50),
        flexDirection: 'row',
    },
    buttonContainer: {
        flex: 1,
        alignItems: 'center'
    },
})

export default PopupConfirm;


import React from 'react';
import {
    View,
    Image,
    Text,
} from 'react-native';

import ModalCustom from './ModalCustom';
import { scaleSzie } from '../utils';
import IMAGE from '../resources';
import Button from './Button';

class PopupParent extends React.Component {

    onPress = () => {
        this.props.onRequestClose();
    }

    render() {
        const { title, visible, style, width, hideCloseButton, styleTitle } = this.props;
        const temptWidth = width ? width : 400;
        
        return (
            <ModalCustom
                transparent={true}
                visible={visible}
                onRequestClose={() => { }}
                style={style}
            >
                <View style={{ width: scaleSzie(temptWidth) }} >
                    <View style={{
                        height: scaleSzie(55), backgroundColor: '#0764B0',
                        borderTopRightRadius: scaleSzie(15), borderTopLeftRadius: scaleSzie(15), flexDirection: 'row'
                    }} >
                        {/* <View style={{ width: scaleSzie(70) }} /> */}
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                            <Text style={[{ color: '#fff', fontSize: scaleSzie(22), fontWeight: 'bold' }, styleTitle]} >
                                {title}
                            </Text>
                        </View>
                        <View style={{
                            height: scaleSzie(55), width: scaleSzie(70), justifyContent: 'center', alignItems: 'flex-end',
                            // paddingRight: scaleSzie(12),
                            position: "absolute", right: scaleSzie(12), top: 0
                        }} >
                            {
                                hideCloseButton ? <View /> : <Button onPress={this.onPress} style={{
                                    width: scaleSzie(30), height: scaleSzie(30), backgroundColor: '#fff',
                                    borderRadius: scaleSzie(15), justifyContent: 'center', alignItems: 'center'
                                }} >
                                    <Image source={IMAGE.closePopup} style={{ width: scaleSzie(14), height: scaleSzie(14) }} />
                                </Button>
                            }

                        </View>
                    </View>
                    {this.props.children}
                </View>

            </ModalCustom>

        );
    }
}


export default PopupParent;


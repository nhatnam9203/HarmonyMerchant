import React from 'react';
import {
    View,
    Image,
    Text,
} from 'react-native';

import ModalCustom from './ModalCustom';
import { scaleSize } from '../utils';
import IMAGE from '../resources';
import Button from './Button';

class PopupParent extends React.Component {

    onPress = () => {
        this.props.onRequestClose();
    }

    render() {
        const { title, visible, style, width, height, hideCloseButton, styleTitle,iconCloseStyle, btnCloseStyle} = this.props;
        const tempWidth = width || 400;
        const tempHeight = height || 55;

        return (
            <ModalCustom
                transparent={true}
                visible={visible}
                onRequestClose={() => { }}
                style={style}
            >
                <View style={{ width: tempWidth }} >
                    <View style={{
                        height: scaleSize(tempHeight), backgroundColor: '#0764B0',
                        borderTopRightRadius: scaleSize(15), borderTopLeftRadius: scaleSize(15), flexDirection: 'row'
                    }} >
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                            <Text style={[{ color: '#fff', fontSize: scaleSize(22), fontWeight: 'bold' }, styleTitle]} >
                                {title}
                            </Text>
                        </View>
                        <View style={{
                            height: scaleSize(tempHeight), width: scaleSize(70), justifyContent: 'center', alignItems: 'flex-end',
                            position: "absolute", right: scaleSize(12), top: 0
                        }} >
                            {
                                hideCloseButton ? <View /> : <Button onPress={this.onPress} style={[{
                                    width: scaleSize(30), height: scaleSize(30), backgroundColor: '#fff',
                                    borderRadius: scaleSize(15), justifyContent: 'center', alignItems: 'center'
                                },btnCloseStyle]} >
                                    <Image source={IMAGE.closePopup} style={[{ width: scaleSize(14), height: scaleSize(14) },iconCloseStyle]} />
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


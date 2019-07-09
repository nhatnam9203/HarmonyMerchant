import React from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet
} from 'react-native';

import {ButtonCustom,PopupParent} from '@components';
import { scaleSzie } from '@utils';

class PopupDiscount extends React.Component {

    render() {
        const { title, visible,onRequestClose} = this.props;
        return (
            <PopupParent
                title={title}
                visible={visible}
                onRequestClose={() => onRequestClose()}
                width={600}
            >
                <View style={{
                    height: scaleSzie(380), backgroundColor: '#fff',
                    borderBottomLeftRadius: scaleSzie(15), borderBottomRightRadius: scaleSzie(15)
                }} >
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

export default PopupDiscount;


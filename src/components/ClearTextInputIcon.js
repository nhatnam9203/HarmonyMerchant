import React from 'react';
import {
    View,
    Image
} from 'react-native';

import ICON from "@resources";
import { scaleSize } from '@utils';

export default ClearTextInputIcon = () => {
    return (
        <View style={{
            width: scaleSize(22), height: scaleSize(22), alignItems: 'center', justifyContent: 'center',
            borderRadius: scaleSize(11), borderColor: '#0764B0', borderWidth: 2
        }} >
            <Image source={ICON.clear_text_input} style={{ width: scaleSize(10), height: scaleSize(10) }} />
        </View>

    );
}
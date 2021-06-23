import React from 'react';
import {
    View,
    Image
} from 'react-native';

import ICON from "@resources";
import { ScaleSzie } from '@utils';

export default ClearTextInputIcon = () => {
    return (
        <View style={{
            width: ScaleSzie(22), height: ScaleSzie(22), alignItems: 'center', justifyContent: 'center',
            borderRadius: ScaleSzie(11), borderColor: '#0764B0', borderWidth: 2
        }} >
            <Image source={ICON.clear_text_input} style={{ width: ScaleSzie(10), height: ScaleSzie(10) }} />
        </View>

    );
}
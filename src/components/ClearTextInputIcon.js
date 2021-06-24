import React from 'react';
import {
    View,
    Image
} from 'react-native';

import ICON from "@resources";
import { scaleSzie } from '@utils';

export default ClearTextInputIcon = () => {
    return (
        <View style={{
            width: scaleSzie(22), height: scaleSzie(22), alignItems: 'center', justifyContent: 'center',
            borderRadius: scaleSzie(11), borderColor: '#0764B0', borderWidth: 2
        }} >
            <Image source={ICON.clear_text_input} style={{ width: scaleSzie(10), height: scaleSzie(10) }} />
        </View>

    );
}
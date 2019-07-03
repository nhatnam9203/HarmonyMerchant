import React from 'react';
import {
    View,
    Text,
    TextInput,
    Alert,
    Dimensions,
    ScrollView,
    StyleSheet,
    TouchableOpacity
} from 'react-native';

import { ButtonCustom, PopupParent, PopupConfirm } from '@components';
import { scaleSzie, localize, getCategoryName } from '@utils';

const { width } = Dimensions.get('window');

class PopupRestock extends React.Component {

    constructor(props) {
        super(props);
    }

    // ---------- Render --------
    render() {
        const { title, visible, onRequestClose, language } = this.props;
        const temptHeight = width - scaleSzie(520);
        return (
            <PopupParent
                title={title}
                visible={visible}
                onRequestClose={() => onRequestClose()}
                style={{  }}
            >
                <View style={{
                    height: scaleSzie(temptHeight), backgroundColor: '#fff',
                    borderBottomLeftRadius: scaleSzie(15),
                    borderBottomRightRadius: scaleSzie(15),
                    paddingHorizontal: scaleSzie(30)
                }} >
                    <View style={{ flex: 1 }} >
                    </View>
                </View>
            </PopupParent>
        );
    }
}


const styles = StyleSheet.create({
})

export default PopupRestock;



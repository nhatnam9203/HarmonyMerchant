import React from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet
} from 'react-native';

import { InputAuth, ButtonCustom, Button, DefaultTabBar } from '../../../../../components';
import { scaleSzie } from '../../../../../utils';

class TabProducts extends React.Component {

    constructor(props){
        super(props);
    }

    render() {
        return (
            <View style={styles.container} >
               
            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})

export default TabProducts;


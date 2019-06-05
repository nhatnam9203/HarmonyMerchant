import React from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet
} from 'react-native';

import { FooterTab } from '../../../../../components';
import { scaleSzie } from '../../../../../utils';
import IMAGE from '../../../../../resources';

class TabCategories extends React.Component {

    constructor(props) {
        super(props);
    }

    

    render() {
        return (
            <View style={styles.container} >
                <FooterTab />
            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop:scaleSzie(15)
    },
})

export default TabCategories;


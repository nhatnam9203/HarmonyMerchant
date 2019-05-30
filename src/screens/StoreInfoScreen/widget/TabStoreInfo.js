import React from 'react';
import {
    View,
    ScrollView,
    StyleSheet
} from 'react-native';

import { InputAuth, ButtonCustom, Button, DefaultTabBar } from '../../../components';
import { scaleSzie } from '../../../utils';

class TabStoreInfo extends React.Component {

    render() {
        return (
            <View style={styles.container} >
                <View style={styles.body} >
                    <ScrollView>

                    </ScrollView>
                </View>
                <View style={styles.footer} >

                </View>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    body: {
        flex: 1
    },
    footer: {
        height: scaleSzie(60),
        backgroundColor: 'red'
    }
})

export default TabStoreInfo;

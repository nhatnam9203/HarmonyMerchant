import React from 'react';
import {
    View,
    Image,
    Text,
    ImageBackground,
} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import { InputAuth, ButtonCustom, Button,DefaultTabBar } from '../../components';
import { scaleSzie } from '../../utils';
import styles from './style';
import Configs from '../../configs';
import IMAGE from '../../resources';

export default class Layout extends React.Component {

    render() {
        return (
            <View style={styles.container} >
                <ScrollableTabView
                    style={{ marginTop: 20, }}
                    initialPage={1}
                    renderTabBar={() => <DefaultTabBar />}
                >
                    <View tabLabel='Tab #1' style={{ flex: 1, backgroundColor: 'red' }} >

                    </View>
                    <View tabLabel='Tab #2' style={{ flex: 1 }} >

                    </View>
                    <View tabLabel='Tab #3' style={{ flex: 1, backgroundColor: 'red' }} >

                    </View>
                </ScrollableTabView>
            </View>

        );
    }
}

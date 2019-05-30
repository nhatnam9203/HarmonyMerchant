import React from 'react';
import {
    View,
    Image,
    Text,
    ImageBackground,
} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import { InputAuth, ButtonCustom, Button, DefaultTabBar } from '../../components';
import { scaleSzie } from '../../utils';
import styles from './style';
import Configs from '../../configs';
import IMAGE from '../../resources';

export default class Layout extends React.Component {

    render() {
        return (
            <View style={styles.container} >
                <ScrollableTabView
                    style={{}}
                    initialPage={1}
                    renderTabBar={() => <DefaultTabBar
                        activeTextColor="#fff"
                        inactiveTextColor="#6A6A6A"
                        backgroundTabActive="#0764B0"
                        textStyle={{
                            fontSize: scaleSzie(10)
                        }}
                    />}
                >
                    <View tabLabel='1. Store Info' style={{ flex: 1,}} >

                    </View>
                    <View tabLabel='2. Admin Info' style={{ flex: 1 }} >

                    </View>
                    <View tabLabel='3. Staff Management' style={{ flex: 1, }} >

                    </View>
                    <View tabLabel='4. Services / Products' style={{ flex: 1}} >

                    </View>
                </ScrollableTabView>
            </View>

        );
    }
}

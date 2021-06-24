import React from 'react';
import {
    View,
    Image,
    ScrollView,
    FlatList,
} from 'react-native';

import { CustomTabBar ,ScrollableTabView} from '@components';

import { scaleSzie } from '@utils';
import styles from './style';
import IMAGE from '@resources';

class Layout extends React.Component {

    render() {
        return (
            <View style={styles.container} >
                <ScrollableTabView
                    ref={this.scrollTabRef}
                    style={{}}
                    initialPage={2}
                    renderTabBar={() => <CustomTabBar
                        activeTextColor="#fff"
                        inactiveTextColor="#0764B0"
                        backgroundTabActive="#0764B0"
                        textStyle={{
                            fontSize: scaleSzie(16)
                        }}
                    />}
                >
                    <View tabLabel='Promotions' style={{flex:1}} />
                    <View tabLabel='Custom Banner' style={{flex:1}} />
                    <View tabLabel='Custom Marketing' style={{flex:1}} />

                </ScrollableTabView>
            </View>
        );
    }

}

export default Layout;


import React from 'react';
import {
    View,
    Image,
    ScrollView,
    FlatList,
} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import { InputAuth, ButtonCustom, Button, Text,CustomTabBar } from '../../../../components';
import { scaleSzie } from '../../../../utils';
import styles from './style';
// import { EmptyStaff, TableHeader, RowTable, PopupConfirm } from './widget';
import IMAGE from '../../../../resources';

class Layout extends React.Component {

    render() {
        return (
            <View style={styles.container} >
                <ScrollableTabView
                    style={{}}
                    initialPage={3}
                    renderTabBar={() => <CustomTabBar
                        activeTextColor="#fff"
                        inactiveTextColor="#6A6A6A"
                        backgroundTabActive="#0764B0"
                        textStyle={{
                            fontSize: scaleSzie(10)
                        }}
                    />}
                >
                    <View tabLabel='Categories' style={{flex:1}} />
                    <View tabLabel='Services' style={{flex:1}} />
                    <View tabLabel='Extra' style={{flex:1}} />
                    <View tabLabel='Products' style={{flex:1}} />

                </ScrollableTabView>
            </View>
        );
    }

}

export default Layout;


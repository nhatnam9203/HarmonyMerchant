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
import { TabCategories,TabServices,TabExtra,TabProducts} from './widget';
import IMAGE from '../../../../resources';

class Layout extends React.Component {

    render() {
        return (
            <View style={styles.container} >
                <ScrollableTabView
                    style={{}}
                    initialPage={0}
                    renderTabBar={() => <CustomTabBar
                        activeTextColor="#fff"
                        inactiveTextColor="#6A6A6A"
                        backgroundTabActive="#0764B0"
                        textStyle={{
                            fontSize: scaleSzie(16)
                        }}
                    />}
                >
                    <TabCategories tabLabel='Categories'  />
                    <TabServices tabLabel='Services' />
                    <TabExtra tabLabel='Extra'  />
                    <TabProducts tabLabel='Products'  />

                </ScrollableTabView>
            </View>
        );
    }

}

export default Layout;


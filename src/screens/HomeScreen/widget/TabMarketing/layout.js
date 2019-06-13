import React from 'react';
import {
    View,
    Image,
    ScrollView,
    FlatList,
} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import { CustomTabBar } from '../../../../components';
import { scaleSzie } from '../../../../utils';
import styles from './style';
import IMAGE from '../../../../resources';
import {TabPromotion,TabCustomMarketing,TabCustomBanner} from './widget';

class Layout extends React.Component {

    render() {
        return (
            <View style={styles.container} >
                <ScrollableTabView
                    ref={this.scrollTabRef}
                    style={{}}
                    initialPage={1}
                    renderTabBar={() => <CustomTabBar
                        activeTextColor="#fff"
                        inactiveTextColor="#0764B0"
                        backgroundTabActive="#0764B0"
                        textStyle={{
                            fontSize: scaleSzie(16)
                        }}
                    />}
                >
                    <TabPromotion tabLabel='Promotions' />
                    <TabCustomBanner tabLabel='Custom Banner' />
                    <TabCustomMarketing tabLabel='Custom Marketing'/>

                </ScrollableTabView>
            </View>
        );
    }

}

export default Layout;


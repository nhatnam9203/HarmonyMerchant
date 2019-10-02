import React from 'react';
import {
    View,
    Image,
    ScrollView,
    FlatList,
} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import { CustomTabBar } from '@components';
import { scaleSzie,localize } from '@utils';
import styles from './style';
import { TabPromotion, TabCustomMarketing, TabCustomBanner } from './widget';

class Layout extends React.Component {

    render() {
        const { language } = this.props;
        return (
            <View style={styles.container} >
                <ScrollableTabView
                    ref={this.scrollTabRef}
                    style={{}}
                    initialPage={0}
                    renderTabBar={() => <CustomTabBar
                        activeTextColor="#fff"
                        inactiveTextColor="#0764B0"
                        backgroundTabActive="#0764B0"
                        textStyle={{
                            fontSize: scaleSzie(16)
                        }}
                    />}
                >
                    <TabPromotion tabLabel={`${localize('Promotions',language)}`} 
                    addPromotion={this.addPromotion}
                    />
                    <TabCustomBanner tabLabel={`${localize('Custom Banner',language)}`} />
                    {/* <TabCustomMarketing tabLabel={`${localize('Custom Marketing',language)}`} /> */}

                </ScrollableTabView>
            </View>
        );
    }

}

export default Layout;


import React from 'react';
import {
    View,
    Image,
    ScrollView,
    FlatList,
} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import { CustomTabBar } from '@components';
import { scaleSzie } from '@utils';
import styles from './style';
import { TabPromotion, TabCustomMarketing, TabCustomBanner } from './widget';
import localization from './localization';

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
                    <TabPromotion tabLabel={`${localization[language].titleTabPromo}`} />
                    <TabCustomBanner tabLabel={`${localization[language].titleTabCustomBanner}`} />
                    <TabCustomMarketing tabLabel={`${localization[language].titleTabCustomMarketing}`} />

                </ScrollableTabView>
            </View>
        );
    }

}

export default Layout;


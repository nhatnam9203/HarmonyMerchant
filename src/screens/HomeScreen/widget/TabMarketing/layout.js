import React from 'react';
import {
    View,
} from 'react-native';

import { CustomTabBar,ScrollableTabView } from '@components';
import { scaleSzie, localize } from '@utils';
import styles from './style';
import { TabPromotion, TabCustomBanner } from './widget';

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
                    onChangeTab={this.onChangeTab}
                >
                    <TabPromotion tabLabel={`${localize('Promotions', language)}`}
                        addPromotion={this.addPromotion}
                    />
                    <TabCustomBanner tabLabel={`${localize('Market Place', language)}`} />

                </ScrollableTabView>
            </View>
        );
    }

}

export default Layout;


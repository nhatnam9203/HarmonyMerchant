import React from 'react';
import {
    View,
} from 'react-native';

import { CustomTabBar,ScrollableTabView } from '@components';
import { scaleSzie, localize } from '@utils';
import styles from './style';
import { TabPromotion, TabCustomBanner, TabReview, TabMarketPlace, TabPhotoGallery} from './widget';

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
                    <TabCustomBanner tabLabel={`${localize('Photos Gallery', language)}`} />
                    {/* <TabPhotoGallery tabLabel={`${localize('Photos Gallery', language)}`} /> */}
                    <TabReview tabLabel={`${localize('Reviews', language)}`} ref={this.reviewRef} />
                    <TabMarketPlace tabLabel={`${localize('Market Place', language)}`} ref={this.marketPlace} />

                </ScrollableTabView>
            </View>
        );
    }

}

export default Layout;


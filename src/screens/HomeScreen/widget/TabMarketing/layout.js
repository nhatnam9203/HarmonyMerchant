import React from 'react';
import {
    View,
} from 'react-native';

import { CustomTabBar, ScrollableTabView } from '@components';
import { scaleSzie, localize } from '@utils';
import styles from './style';
import { TabPromotion, TabCustomBanner, TabReview, TabMarketPlace, TabPhotoGallery } from './widget';

class Layout extends React.Component {

    render() {
        const { language } = this.props;
        const { isChangeBackground } = this.state;
        const tempBackgroundColor = isChangeBackground ? { backgroundColor: "#fff" } : {};

        return (
            <View style={[styles.container, tempBackgroundColor]} >
                <ScrollableTabView
                    ref={this.scrollTabRef}
                    style={{}}
                    locked={true}
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
                    <TabPromotion
                        ref={this.promotionTabRef}
                        tabLabel={`${localize('Promotions', language)}`}
                        addPromotion={this.addPromotion}
                        handleChangeBackgrounColor={this.handleChangeBackgrounColor}
                    />
                    {/* <TabCustomBanner tabLabel={`${localize('Photos Gallery', language)}`} /> */}
                    <TabPhotoGallery tabLabel={`${localize('Photos Gallery', language)}`} ref={this.photoGalleryRef} />
                    <TabReview tabLabel={`${localize('Reviews', language)}`} ref={this.reviewRef} />
                    <TabMarketPlace tabLabel={`${localize('Market Place', language)}`} ref={this.marketPlace} />

                </ScrollableTabView>
            </View>
        );
    }

}

export default Layout;


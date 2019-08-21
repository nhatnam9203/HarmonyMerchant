import React from 'react';
import {
    View,
    Image
} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import { HomeTabBar, StatusBarHeader, Button, ParentContainer } from '@components';
import { scaleSzie, localize } from '@utils';
import styles from './style';
import IMAGE from '@resources';
import { TabMarketing, TabAppointment, TabCheckout } from './widget';

export default class Layout extends React.Component {

    render() {
        const { language } = this.props;
        const { visibleConfirm ,isFocus} = this.state;
        return (
            <ParentContainer
                handleLockScreen={this.handleLockScreen}
                activeScreen={isFocus}
            >
                <View style={styles.container} >
                    <StatusBarHeader />
                    <ScrollableTabView
                        ref={this.scrollTabParentRef}
                        style={{}}
                        initialPage={0}
                        locked={true}
                        renderTabBar={() => <HomeTabBar
                            activeTextColor="#fff"
                            inactiveTextColor="#0764B0"
                            backgroundTabActive="#0764B0"
                            textStyle={{
                                fontSize: scaleSzie(16),
                                fontWeight: '500'
                            }}
                            onPressHandlerChangeTab={this.onPressHandlerChangeTab}
                        />}
                        onChangeTab={index => this.setState({ currentTab: index.i })}

                    >
                        <TabMarketing
                            tabLabel={`${localize('MARKETING', language)}`}
                        />
                        <TabAppointment
                            tabLabel={`${localize('APPOINTMENT', language)}`}
                            gotoCheckoutScreen={this.gotoCheckoutScreen}
                        />
                        <TabCheckout
                            tabLabel={`${localize('CHECKOUT', language)}`}
                            navigation={this.props.navigation}
                            visibleConfirm={visibleConfirm}
                            closePopupConfirm={() => this.setState({visibleConfirm:false})}
                            gotoPageCurent={this.gotoPageCurent}
                            gotoTabAppointment={this.gotoTabAppointment}
                            checkVisibleConfirm={this.checkVisibleConfirm}
                            gotoAppoitmentScreen={this.gotoAppoitmentScreen}
                        />
                    </ScrollableTabView>
                    <Button onPress={this.openDrawer} style={{ position: 'absolute', top: 20, left: 0 }} >
                        <Image source={IMAGE.openDrawer} style={{ width: scaleSzie(34), height: scaleSzie(34) }} />
                    </Button>

                    <Button onPress={this.showLockScreen} style={{ position: 'absolute', top: 20, right: 0 }} >
                        <Image source={IMAGE.signOut} style={{ width: scaleSzie(34), height: scaleSzie(34) }} />
                    </Button>
                </View>
            </ParentContainer>
        );
    }
}

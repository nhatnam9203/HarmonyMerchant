import React from 'react';
import {
    View,
    Image
} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import { HomeTabBar, StatusBarHeader, Button, ParentContainer, PopupEnterPin } from '@components';
import { scaleSzie, localize } from '@utils';
import styles from './style';
import IMAGE from '@resources';
import { TabMarketing, TabAppointment, TabCheckout } from './widget';

export default class Layout extends React.Component {

    render() {
        const { language } = this.props;
        const { visibleConfirm, isFocus } = this.state;
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
                        initialPage={1}
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
                            ref={this.tabAppointmentRef}
                            tabLabel={`${localize('APPOINTMENT', language)}`}
                            currentTabParent={this.state.currentTab}
                            clearDataTabCheckout={this.clearDataTabCheckout}
                            checkoutAppointment={this.checkoutAppointment}
                            bookAppointment={this.bookAppointment}
                        />
                        <TabCheckout
                            ref={this.tabCheckoutRef}
                            tabLabel={`${localize('CHECKOUT', language)}`}
                            navigation={this.props.navigation}
                            gotoPageCurentParent={this.gotoPageCurentParent}
                            gotoTabAppointment={this.gotoTabAppointment}
                            gotoAppoitmentScreen={this.gotoAppoitmentScreen}
                            currentTabParent={this.state.currentTab}
                        />
                    </ScrollableTabView>
                    <Button onPress={this.openDrawer} style={{ position: 'absolute', top: 20, left: 0 }} >
                        <Image source={IMAGE.openDrawer} style={{ width: scaleSzie(34), height: scaleSzie(34) }} />
                    </Button>

                    <Button onPress={this.showLockScreen} style={{ position: 'absolute', top: 20, right: 0 }} >
                        <Image source={IMAGE.signOut} style={{ width: scaleSzie(34), height: scaleSzie(34) }} />
                    </Button>

                    <PopupEnterPin
                        ref={this.popupEnterPinRef}
                        visible={this.state.visibleEnterPin}
                        title="Pin code"
                        message="If you exit Checkout Screen , Basket will Reset ?"
                        onRequestClose={() => { }}
                        confimYes={this.submitPincode}
                        hideCloseButton={true}
                    />
                </View>
            </ParentContainer>
        );
    }
}

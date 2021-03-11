import React from 'react';
import {
    View,
    Image
} from 'react-native';

import {
    HomeTabBar, StatusBarHeader, Button, ParentContainer,
    PopupEnterPin, PopupCheckStaffPermission,
    ScrollableTabView
} from '@components';
import { scaleSzie, localize } from '@utils';
import styles from './style';
import IMAGE from '@resources';
import { TabMarketing, TabAppointment, TabCheckout } from './widget';
import configs from "@configs";

export default class Layout extends React.Component {

    render() {
        const { language, navigation, marketingTabPermission, visibleEnterPin } = this.props;
        const { isFocus } = this.state;
        return (
            <ParentContainer
                handleLockScreen={this.handleLockScreen}
                activeScreen={isFocus}
                navigation={navigation}
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
                        onChangeTab={this.onChangeTab}

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
                            createABlockAppointment={this.createABlockAppointment}
                            addMoreAppointmentFromCalendar={this.addMoreAppointmentFromCalendar}
                            navigation={this.props.navigation}
                        />
                        <TabCheckout
                            ref={this.tabCheckoutRef}
                            tabLabel={`${localize('CHECK-OUT', language)}`}
                            navigation={this.props.navigation}
                            gotoPageCurentParent={this.gotoPageCurentParent}
                            gotoTabAppointment={this.gotoTabAppointment}
                            gotoAppoitmentScreen={this.gotoAppoitmentScreen}
                            currentTabParent={this.state.currentTab}
                            gotoAppointmentTabToGroup={this.gotoAppointmentTabToGroup}
                            pushAppointmentIdOfflineIntoWebview={this.pushAppointmentIdOfflineIntoWebview}
                        />
                    </ScrollableTabView>
                    <Button onPress={this.openDrawer} style={configs.btn_left_position} >
                        <Image source={IMAGE.openDrawer} style={{ width: scaleSzie(34), height: scaleSzie(34) }} />
                    </Button>

                    <Button onPress={this.showLockScreen} style={configs.btn_right_position} >
                        <Image source={IMAGE.signOut} style={{ width: scaleSzie(34), height: scaleSzie(34) }} />
                    </Button>

                    <PopupEnterPin
                        visibleEnterPin={visibleEnterPin && isFocus ? true : false}
                        ref={this.popupEnterPinRef}
                        title="Pin code"
                        onRequestClose={() => { }}
                        confimYes={this.submitPincode}
                        hideCloseButton={true}
                    />
                    <PopupCheckStaffPermission
                        ref={this.checkMarketingPermissionRef}
                        visiblePopupCheckStaffPermission={marketingTabPermission}
                        title={localize('Input PIN Number', language)}
                        tabName="Marketing"
                        onRequestClose={this.closePopupCheckMarketingTabPermission}
                    />
                </View>
            </ParentContainer>

        );
    }
}

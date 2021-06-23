import React from 'react';
import {
    View,
    Image,
    Dimensions,
    Text,
    VirtualizedList,
    Modal
} from 'react-native';

import {
    HomeTabBar, StatusBarHeader, Button, ParentContainer,
    PopupEnterPin, PopupCheckStaffPermission,
    ScrollableTabView, Loading
} from '@components';
import { ScaleSzie, localize, getIconByNotiType, getColorTitleByNotiType, getNotiContentByType, formatWithMoment } from '@utils';
import styles from './style';
import ICON from '@resources';
import { TabMarketing, TabAppointment, TabCheckout } from './widget';
import configs from "@configs";

const { width, height } = Dimensions.get("window");

export default class Layout extends React.Component {

    renderNotiItem(noti) {
        const icon = noti?.view ? `${getIconByNotiType(noti?.type || "")}_is_read` : getIconByNotiType(noti?.type || "");
        const content = getNotiContentByType(noti);

        return (
            <Button onPress={this.handlePushNotiDataToWebView(noti)} style={{ minHeight: ScaleSzie(110), }} >
                <View style={{ flex: 1, flexDirection: "row", paddingTop: ScaleSzie(10), paddingBottom: ScaleSzie(6) }} >
                    {/* ------------ Icon ------------ */}
                    <View style={{ width: ScaleSzie(50) }} >
                        <Image source={ICON[icon]} style={{ width: ScaleSzie(30), height: ScaleSzie(30) }} />
                    </View>
                    {/* ------------ Information ------------ */}
                    <View style={{ flex: 1 }} >
                        <Text style={{
                            color: getColorTitleByNotiType(noti?.view, noti?.type), fontSize: ScaleSzie(16), fontWeight: "600",
                            marginBottom: ScaleSzie(6)
                        }} >
                            {noti?.title || ""}
                        </Text>
                        {content}

                        <View style={{ flex: 1, justifyContent: "flex-end", }} >
                            <Text style={{ color: "#585858", fontSize: ScaleSzie(12), marginTop: ScaleSzie(10) }} >
                                {formatWithMoment(noti?.createdDate, "MM/DD/YYYY   hh:mm A")}
                            </Text>
                        </View>
                    </View>
                </View>


                <View style={{ height: 2, backgroundColor: "#EEEEEE" }} />
            </Button>
        );
    }

    render() {
        const { language, navigation, marketingTabPermission, visibleEnterPin, notificationList, notificationContUnread } = this.props;
        const { isFocus, visible } = this.state;
        return (
            <ParentContainer
                handleLockScreen={this.handleLockScreen}
                activeScreen={isFocus}
                navigation={navigation}
                clearIntervalById={this.clearIntervalById}
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
                                fontSize: ScaleSzie(16),
                                fontWeight: '500'
                            }}
                            onPressHandlerChangeTab={this.onPressHandlerChangeTab}
                            displayNotifiPopup={this.displayNotifiPopup}
                            notificationContUnread={notificationContUnread}
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
                        <Image source={ICON.openDrawer} style={{ width: ScaleSzie(34), height: ScaleSzie(34) }} />
                    </Button>

                    <Button onPress={this.showLockScreen} style={configs.btn_right_position} >
                        <Image source={ICON.signOut} style={{ width: ScaleSzie(34), height: ScaleSzie(34) }} />
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
                    {/* --------- Notification Popup  ------ */}
                    <Modal
                        transparent={true}
                        visible={visible}
                        animationType={"fade"}
                    >
                        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.6)", alignItems: "center", paddingTop: ScaleSzie(48) }} >
                            <View style={{
                                height: height - ScaleSzie(48), width: ScaleSzie(300), backgroundColor: "#fff",
                                paddingHorizontal: ScaleSzie(10)
                            }} >
                                {/* -------------- Header ----------- */}
                                <View style={{ height: ScaleSzie(50) }}>
                                    <Text style={{ color: "#404040", fontSize: ScaleSzie(14), fontWeight: "600", marginTop: ScaleSzie(10) }} >
                                        {`Notifications`}
                                    </Text>

                                    <Button onPress={this.closeNotiPopup} style={{
                                        height: ScaleSzie(30), width: ScaleSzie(30),
                                        justifyContent: "center", alignItems: "flex-end",
                                        position: "absolute", top: 0, right: 0
                                    }} >
                                        <Image source={ICON.close_noti_popup} />
                                    </Button>

                                    <Button onPress={this.readAllNotification}
                                        style={{
                                            position: "absolute", top: 0, right: ScaleSzie(16), height: ScaleSzie(30), width: ScaleSzie(30),
                                            justifyContent: "center",
                                        }}
                                    >
                                        <Image style={{ width: ScaleSzie(22), height: ScaleSzie(22) }}
                                            source={ICON.read_all_noti} />
                                    </Button>
                                </View>

                                {/* ------------ Notification List ---------- */}
                                <View style={{ flex: 1 }} >
                                    <VirtualizedList
                                        data={notificationList}
                                        initialNumToRender={10}
                                        renderItem={({ item }) => this.renderNotiItem(item)}
                                        keyExtractor={(item, index) => `${item?.merchantNotificationId}_${index}`}
                                        getItemCount={this.getItemCount}
                                        getItem={this.getItem}
                                        showsVerticalScrollIndicator={false}
                                        onEndReached={this.loadMoreNotificationList}
                                        onEndReachedThreshold={0.1}
                                        onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
                                    />
                                </View>
                            </View>
                        </View>
                        <Loading />
                    </Modal>
                </View>
            </ParentContainer>

        );
    }
}

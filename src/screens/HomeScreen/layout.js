import React from 'react';
import {
    View,
    Image,
    Dimensions,
    Text,
    FlatList,
    VirtualizedList,
    ScrollView,
    Modal
} from 'react-native';

import {
    HomeTabBar, StatusBarHeader, Button, ParentContainer,
    PopupEnterPin, PopupCheckStaffPermission,
    ScrollableTabView
} from '@components';
import { scaleSzie, localize, getIconByTitle } from '@utils';
import styles from './style';
import ICON from '@resources';
import { TabMarketing, TabAppointment, TabCheckout } from './widget';
import configs from "@configs";

const { width, height } = Dimensions.get("window");

const DATA = [
    {
        "merchantNotificationId": 43545,
        "title": "Appointment changes",
        "content": "Rockie has changed the appointment #9876006623",
        "createdDate": "2021-03-16T11:19:19.970411",
        "view": 0,
        "type": "appointment_update",
        "appointmentId": 14926,
        "appointmentDate": "2021-03-16T10:30:00",
        "customerName": null,
        "customerPhone": null,
        "appointmentCode": null,
        "staffName": null,
        "message": null
    },
    {
        "merchantNotificationId": 43544,
        "title": "New Appointment",
        "content": "New appointment for: <b>Rockie</b> #9876006623",
        "createdDate": "2021-03-16T11:17:42.684294",
        "view": 0,
        "type": "appointment_add",
        "appointmentId": 14926,
        "appointmentDate": "2021-03-16T10:30:00",
        "customerName": null,
        "customerPhone": null,
        "appointmentCode": null,
        "staffName": null,
        "message": null
    },
    {
        "merchantNotificationId": 43543,
        "title": "New Appointment",
        "content": "New appointment for: <b>Rockie</b> #9876006622",
        "createdDate": "2021-03-16T11:16:16.633511",
        "view": 0,
        "type": "appointment_add",
        "appointmentId": 14925,
        "appointmentDate": "2021-03-16T16:30:00",
        "customerName": null,
        "customerPhone": null,
        "appointmentCode": null,
        "staffName": null,
        "message": null
    },
    {
        "merchantNotificationId": 43542,
        "title": "Appointment changes",
        "content": "Rockie has changed the appointment #9876006619",
        "createdDate": "2021-03-16T11:15:00.478879",
        "view": 0,
        "type": "appointment_update",
        "appointmentId": 14922,
        "appointmentDate": "2021-03-16T13:30:00",
        "customerName": null,
        "customerPhone": null,
        "appointmentCode": null,
        "staffName": null,
        "message": null
    },
    {
        "merchantNotificationId": 43541,
        "title": "Appointment changes",
        "content": "Rockie has changed the appointment #9876006619",
        "createdDate": "2021-03-16T11:14:27.459535",
        "view": 0,
        "type": "appointment_update",
        "appointmentId": 14922,
        "appointmentDate": "2021-03-16T13:30:00",
        "customerName": null,
        "customerPhone": null,
        "appointmentCode": null,
        "staffName": null,
        "message": null
    },
    {
        "merchantNotificationId": 43540,
        "title": "Appointment schedule changes",
        "content": "Rockie has changed the appointment time.",
        "createdDate": "2021-03-16T11:13:55.288042",
        "view": 0,
        "type": "appointment_schedule_changes",
        "appointmentId": 14922,
        "appointmentDate": "2021-03-16T13:30:00",
        "customerName": null,
        "customerPhone": null,
        "appointmentCode": null,
        "staffName": null,
        "message": null
    },
    {
        "merchantNotificationId": 43539,
        "title": "New Appointment",
        "content": "New appointment for: <b>Rockie</b> #9876006621",
        "createdDate": "2021-03-16T11:12:17.964114",
        "view": 0,
        "type": "appointment_add",
        "appointmentId": 14924,
        "appointmentDate": "2021-03-16T13:30:00",
        "customerName": null,
        "customerPhone": null,
        "appointmentCode": null,
        "staffName": null,
        "message": null
    },
    {
        "merchantNotificationId": 43538,
        "title": "New Appointment",
        "content": "New appointment for: <b>Rockie</b> #9876006620",
        "createdDate": "2021-03-16T11:10:55.180735",
        "view": 0,
        "type": "appointment_add",
        "appointmentId": 14923,
        "appointmentDate": "2021-03-15T14:30:00",
        "customerName": null,
        "customerPhone": null,
        "appointmentCode": null,
        "staffName": null,
        "message": null
    },
    {
        "merchantNotificationId": 43537,
        "title": "Appointment schedule changes",
        "content": "Rockie has changed the appointment time.",
        "createdDate": "2021-03-16T11:10:31.833091",
        "view": 0,
        "type": "appointment_schedule_changes",
        "appointmentId": 14922,
        "appointmentDate": "2021-03-16T13:30:00",
        "customerName": null,
        "customerPhone": null,
        "appointmentCode": null,
        "staffName": null,
        "message": null
    },
    {
        "merchantNotificationId": 43536,
        "title": "New Appointment",
        "content": "New appointment for: <b>Rockie</b> #9876006619",
        "createdDate": "2021-03-16T11:07:14.065807",
        "view": 0,
        "type": "appointment_add",
        "appointmentId": 14922,
        "appointmentDate": "2021-03-16T13:30:00",
        "customerName": null,
        "customerPhone": null,
        "appointmentCode": null,
        "staffName": null,
        "message": null
    }
]

export default class Layout extends React.Component {

    renderNotiItem(noti) {
        //  console.log("----- renderNotiItem: ",JSON.stringify(noti));

        const icon = getIconByTitle(noti?.type || "");

        return (
            <View style={{ minHeight: scaleSzie(125), }} >
                <View style={{ flex: 1, flexDirection: "row", paddingTop: scaleSzie(10),paddingBottom:scaleSzie(6) }} >
                    {/* ------------ Icon ------------ */}
                    <View style={{ width: scaleSzie(50) }} >
                        <Image source={ICON[icon]} style={{ width: scaleSzie(30), height: scaleSzie(30) }} />
                    </View>
                    {/* ------------ Information ------------ */}
                    <View style={{ flex: 1 }} >
                        <Text style={{ color: "#0764B0", fontSize: scaleSzie(16), fontWeight: "600" }} >
                            {noti?.title || ""}
                        </Text>
                        <Text style={{ color: "#585858", fontSize: scaleSzie(16), marginTop: scaleSzie(6) }} >
                            {`${noti?.content}` || ""}
                        </Text>

                        <View style={{ flex: 1,justifyContent:"flex-end", }} >
                            <Text style={{ color: "#585858", fontSize: scaleSzie(12),marginTop:scaleSzie(10)  }} >
                                {`1 minute ago.`}
                            </Text>
                        </View>
                    </View>
                </View>


                <View style={{ height: 2, backgroundColor: "#EEEEEE" }} />
            </View>
        );
    }

    render() {
        const { language, navigation, marketingTabPermission, visibleEnterPin } = this.props;
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
                                fontSize: scaleSzie(16),
                                fontWeight: '500'
                            }}
                            onPressHandlerChangeTab={this.onPressHandlerChangeTab}
                            displayNotifiPopup={this.displayNotifiPopup}
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
                        <Image source={ICON.openDrawer} style={{ width: scaleSzie(34), height: scaleSzie(34) }} />
                    </Button>

                    <Button onPress={this.showLockScreen} style={configs.btn_right_position} >
                        <Image source={ICON.signOut} style={{ width: scaleSzie(34), height: scaleSzie(34) }} />
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
                        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.6)", alignItems: "center", paddingTop: scaleSzie(48) }} >
                            <View style={{
                                height: height - scaleSzie(48), width: scaleSzie(300), backgroundColor: "#fff",
                                paddingHorizontal: scaleSzie(10)
                            }} >
                                {/* -------------- Header ----------- */}
                                <View style={{ height: scaleSzie(50) }}>
                                    <Text style={{ color: "#404040", fontSize: scaleSzie(14), fontWeight: "600", marginTop: scaleSzie(10) }} >
                                        {`Notifications`}
                                    </Text>

                                    <Button onPress={this.closeNotiPopup} style={{
                                        height: scaleSzie(30), width: scaleSzie(30),
                                        justifyContent: "center", alignItems: "flex-end",
                                        position: "absolute", top: 0, right: 0
                                    }} >
                                        <Image source={ICON.close_noti_popup} />
                                    </Button>
                                </View>

                                {/* ------------ Notification List ---------- */}
                                <View style={{ flex: 1 }} >
                                    <VirtualizedList
                                        data={DATA}
                                        initialNumToRender={10}
                                        renderItem={({ item }) => this.renderNotiItem(item)}
                                        keyExtractor={(item, index) => `${item?.merchantNotificationId}_${index}`}
                                        getItemCount={this.getItemCount}
                                        getItem={this.getItem}
                                        showsVerticalScrollIndicator={false}
                                    />
                                </View>
                            </View>
                        </View>
                    </Modal>
                </View>
            </ParentContainer>

        );
    }
}

import React from 'react';
import {
    View,
    Image,
    Dimensions,
    Text,
    FlatList,
    VirtualizedList
} from 'react-native';

import {
    HomeTabBar, StatusBarHeader, Button, ParentContainer,
    PopupEnterPin, PopupCheckStaffPermission,
    ScrollableTabView, ModalCustom
} from '@components';
import { scaleSzie, localize } from '@utils';
import styles from './style';
import ICON from '@resources';
import { TabMarketing, TabAppointment, TabCheckout } from './widget';
import configs from "@configs";

const { width, height } = Dimensions.get("window");

const DATA = [
    {
        "merchantNotificationId": 43517,
        "title": "New Appointment",
        "content": "New appointment for: <b>vva</b> #9876006606",
        "createdDate": "2021-03-15T17:32:26.487363",
        "view": 0,
        "type": "appointment_add",
        "appointmentId": 14909,
        "appointmentDate": "2021-03-15T18:00:00"
    },
    {
        "merchantNotificationId": 43516,
        "title": "New Appointment",
        "content": "New appointment for: <b>cae</b> #9876006605",
        "createdDate": "2021-03-15T17:29:24.39587",
        "view": 0,
        "type": "appointment_add",
        "appointmentId": 14908,
        "appointmentDate": "2021-03-03T14:00:00"
    },
    {
        "merchantNotificationId": 43515,
        "title": "Appointment schedule changes",
        "content": "JerryDat  has changed the appointment time.",
        "createdDate": "2021-03-15T10:57:16.290354",
        "view": 0,
        "type": "appointment_schedule_changes",
        "appointmentId": 14711,
        "appointmentDate": "2021-03-15T12:15:00"
    },
    {
        "merchantNotificationId": 43514,
        "title": "Appointment schedule changes",
        "content": "JerryDat  has changed the appointment time.",
        "createdDate": "2021-03-15T10:57:05.907348",
        "view": 0,
        "type": "appointment_schedule_changes",
        "appointmentId": 14711,
        "appointmentDate": "2021-03-15T12:15:00"
    },
    {
        "merchantNotificationId": 43513,
        "title": "New Appointment",
        "content": "New appointment for: <b>Phi </b> #9876006604",
        "createdDate": "2021-03-15T10:43:42.514064",
        "view": 0,
        "type": "appointment_add",
        "appointmentId": 14907,
        "appointmentDate": "2021-03-15T12:45:00"
    },
    {
        "merchantNotificationId": 43512,
        "title": "New Appointment",
        "content": "New appointment for: <b>Phi </b> #9876006603",
        "createdDate": "2021-03-15T10:42:37.635098",
        "view": 0,
        "type": "appointment_add",
        "appointmentId": 14906,
        "appointmentDate": "2021-03-15T13:45:00"
    },
    {
        "merchantNotificationId": 43511,
        "title": "New Appointment",
        "content": "New appointment for: <b>cae</b> #9876006602",
        "createdDate": "2021-03-12T10:24:46.550508",
        "view": 0,
        "type": "appointment_add",
        "appointmentId": 14905,
        "appointmentDate": "2021-03-03T14:00:00"
    },
    {
        "merchantNotificationId": 43510,
        "title": "New Appointment",
        "content": "New appointment for: <b>cae</b> #9876006601",
        "createdDate": "2021-03-12T10:23:00.245834",
        "view": 0,
        "type": "appointment_add",
        "appointmentId": 14904,
        "appointmentDate": "2021-03-03T14:00:00"
    },
    {
        "merchantNotificationId": 43509,
        "title": "New Appointment",
        "content": "New appointment for: <b>cae</b> #9876006600",
        "createdDate": "2021-03-12T09:44:04.916669",
        "view": 0,
        "type": "appointment_add",
        "appointmentId": 14903,
        "appointmentDate": "2021-03-03T14:00:00"
    },
    {
        "merchantNotificationId": 43508,
        "title": "New Appointment",
        "content": "New appointment for: <b>cae</b> #9876006599",
        "createdDate": "2021-03-11T17:30:24.597443",
        "view": 0,
        "type": "appointment_add",
        "appointmentId": 14902,
        "appointmentDate": "0001-01-01T00:35:00"
    }
]

export default class Layout extends React.Component {

    renderNotiItem(noti){
        return(
            <View style={{minHeight:scaleSzie(125)}} >
                <View style={{flex:1,flexDirection:"row"}} >

                </View>

                <View style={{height: 2, backgroundColor:"#EEEEEE"}} />
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
                    <ModalCustom
                        transparent={true}
                        visible={visible}
                        animationType={"fade"}
                        onRequestClose={this.closeNotiPopup}
                        style={{
                            justifyContent: "flex-start",
                            paddingTop: scaleSzie(45)
                        }}
                    >
                        <View style={{ height: height - scaleSzie(45), width: scaleSzie(300), backgroundColor: "#fff", paddingHorizontal: scaleSzie(10) }} >
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
                                    initialNumToRender={5}
                                    renderItem={({ item }) => this.renderNotiItem(item)}
                                    keyExtractor={(item,index) => `${item?.merchantNotificationId}_${index}`}
                                    getItemCount={this.getItemCount}
                                    getItem={this.getItem}
                                />
                            </View>

                        </View>
                    </ModalCustom>

                </View>
            </ParentContainer>

        );
    }
}

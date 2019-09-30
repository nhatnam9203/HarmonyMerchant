import React from 'react';
import {
    View,
    Image
} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import { StatusBarHeader, Button, ParentContainer, Text, PopupLogout } from '@components';
import { scaleSzie, localize } from '@utils';
import styles from './style';
import IMAGE from '@resources';
import { TabStaff, TabService, TabExtra, TabCategories, TabGaneral, TabHardware } from './widget';

const MENU = ["General", "Staff", "Categories", "Services", "Extra", "Hardware", "About", "Logout"];

export default class Layout extends React.Component {

    renderHeader() {
        const { language } = this.props;
        return (
            <View style={{
                height: scaleSzie(35), borderBottomColor: '#0764B0', borderWidth: 3, paddingLeft: scaleSzie(50),
                justifyContent: 'center'
            }} >
                <Text style={{ fontSize: scaleSzie(16), color: '#0764B0' }} >
                    {localize('Settings', language)}
                </Text>
            </View>
        );
    }

    renderMenu() {
        const { indexTab } = this.state;
        return (
            <View style={{ width: scaleSzie(140), backgroundColor: 'rgb(250,250,250)' }} >
                {
                    MENU.map((title, index) => {
                        const temptIcon = index === indexTab ? title : `${title}_in`;
                        const temptBackground = index === indexTab ? { backgroundColor: '#fff', borderLeftColor: '#0764B0', borderLeftWidth: 7 } : {};
                        const temptTextColorSelect = index === indexTab ? { color: '#0764B0' } : {}
                        return (
                            <Button onPress={() => this.selectMenu(index)} key={index} style={[{
                                height: scaleSzie(50), borderBottomColor: 'rgb(241,241,241)', borderBottomWidth: 3,
                                flexDirection: 'row', alignItems: "center", paddingLeft: scaleSzie(10)
                            }, temptBackground]} >
                                <Image source={IMAGE[temptIcon]} style={{
                                    width: scaleSzie(18), height: scaleSzie(18),
                                    marginRight: scaleSzie(10)
                                }} />
                                <Text style={[{ color: '#404040', fontSize: scaleSzie(16) }, temptTextColorSelect]} >
                                    {title}
                                </Text>
                            </Button>
                        );
                    })
                }

            </View>
        );
    }

    render() {
        const { language } = this.props;
        const { isFocus } = this.state;
        return (
            <ParentContainer
                handleLockScreen={this.handleLockScreen}
                activeScreen={isFocus}
            >
                <View style={styles.container} >
                    <StatusBarHeader />
                    {this.renderHeader()}
                    <View style={{ flex: 1, flexDirection: 'row' }} >
                        {this.renderMenu()}
                        <View style={{ flex: 1 }} >
                            <ScrollableTabView
                                ref={this.scrollTabRef}
                                style={{}}
                                initialPage={2}
                                tabBarPosition="bottom"
                                locked={true}
                                springTension={1}
                                springFriction={1}
                                renderTabBar={() => <View />}
                            >
                                <TabGaneral />
                                <TabStaff />
                                <TabCategories />
                                <TabService />
                                <TabExtra />
                                {/* <View style={{ flex: 1 }} /> */}
                                <TabHardware />
                                {/* -------- Tab About ----- */}
                                <View style={styles.containerAbout} >
                                    <View style={{ flex: 1 }} >
                                        <Text style={styles.textTitle} >
                                            About
                                        </Text>
                                        {/* ------- Logo -------- */}
                                        <View style={styles.logo} >
                                            <Image source={IMAGE.logoAbout} />
                                        </View>
                                        {/* ----------- */}
                                        <Text style={styles.text2} >
                                            HarmonyPay Application
                                        </Text>
                                        {/* ----------- */}
                                        <Text style={styles.textVersion} >
                                            Version 1.0
                                        </Text>
                                        {/* ----------- */}
                                        <Text style={styles.textCopy} >
                                            Copyright ©  2019 Hamory Inc.
                                        </Text>
                                        {/* -------- Text decription ------ */}
                                        <View style={{
                                            paddingRight: scaleSzie(20),
                                            marginTop: scaleSzie(20)
                                        }} >
                                            <Text style={styles.textDesc} >
                                                Lorem Ipsum is simply dummy text of the
                                                printing and typesetting industry.
                                                 Lorem Ipsum has been the industry's
                                                  standard dummy text ever since the 1 500s,
                                                   when an unknown printer took a galley of type
                                                   and scrambled it to make a type specimen book.
                                                   It has survived not only five centuries,
                                                    but also the leap into electronic typesetting,
                                                     remaining essentially unchanged.
                                        </Text>
                                        </View>
                                        {/* ------- Footer ----- */}
                                        <View style={{
                                            flex: 1, flexDirection: 'row',
                                            alignItems: 'flex-end', justifyContent: 'space-between',
                                            paddingBottom: scaleSzie(20)
                                        }} >
                                            <Text style={[styles.textFooter, { textDecorationLine: "underline" }]} >
                                                www.harmonypay.com
                                            </Text>
                                            <Text style={styles.textFooter} >
                                                Created by Levin Team
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </ScrollableTabView>
                        </View>
                    </View>

                    <Button onPress={this.openDrawer} style={{ position: 'absolute', top: 20, left: 0 }} >
                        <Image source={IMAGE.openDrawer} style={{ width: scaleSzie(34), height: scaleSzie(34) }} />
                    </Button>

                    <Button onPress={this.backTab} style={{
                        position: 'absolute', top: 20, right: 0,
                        width: scaleSzie(34), height: scaleSzie(34), backgroundColor: '#0764B0', justifyContent: 'center', alignItems: 'center'
                    }} >
                        <Image source={IMAGE.arrowRight} style={{ width: scaleSzie(22), height: scaleSzie(17) }} />
                    </Button>
                </View>
                <PopupLogout
                    visible={this.state.visibleLogout}
                    title="Confirmation"
                    message="Are you sure you want to Log out?"
                    onRequestClose={() => this.setState({ visibleLogout: false })}
                    confimYes={this.logout}
                />
            </ParentContainer>
        );
    }
}

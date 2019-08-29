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
import { TabContactUs} from './widget';

const MENU = ["Videos", "Documents", "Text message", "Contact us", "Live chat"];

export default class Layout extends React.Component {

    renderHeader() {
        const { language } = this.props;
        return (
            <View style={{
                height: scaleSzie(35), borderBottomColor: '#0764B0', borderWidth: 3, paddingLeft: scaleSzie(50),
                justifyContent: 'center'
            }} >
                <Text style={{ fontSize: scaleSzie(16), color: '#0764B0' }} >
                    {localize('Support', language)}
                </Text>
            </View>
        );
    }

    renderMenu() {
        const { indexTab } = this.state;
        return (
            <View style={{ width: scaleSzie(150), backgroundColor: 'rgb(250,250,250)' }} >
                {
                    MENU.map((title, index) => {
                        let temptIcon;
                        if (title === 'Text message') {
                            temptIcon = index === indexTab ? 'TextMessage' : `TextMessage_in`;
                        } else if (title === 'Contact us') {
                            temptIcon = index === indexTab ? 'ContactUs' : `ContactUs_in`;
                        } else if (title === 'Live chat') {
                            temptIcon = index === indexTab ? 'LiveChat' : `LiveChat_in`;
                        } else {
                            temptIcon = index === indexTab ? title : `${title}_in`;
                        }

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
                                initialPage={0}
                                tabBarPosition="bottom"
                                locked={true}
                                springTension={1}
                                springFriction={1}
                                renderTabBar={() => <View />}
                            >
                                <View style={{ flex: 1 }} />
                                <View style={{ flex: 1 }} />
                                <View style={{ flex: 1 }} />
                                <TabContactUs />
                                <View style={{ flex: 1 }} />

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
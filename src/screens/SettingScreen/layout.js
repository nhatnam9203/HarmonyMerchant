import React from 'react';
import {
    View,
    Image
} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import { StatusBarHeader, Button, ParentContainer, Text } from '@components';
import { scaleSzie, localize } from '@utils';
import styles from './style';
import IMAGE from '@resources';
import { TabStaff, TabService, TabExtra } from './widget';

const MENU = ["General", "Staff", "Services", "Extra", "Payment", "Hardware", "About", "Logout"];

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
                                height: scaleSzie(55), borderBottomColor: 'rgb(241,241,241)', borderBottomWidth: 3,
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
        return (
            <ParentContainer
                handleLockScreen={this.handleLockScreen}
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
                                initialPage={3}
                                tabBarPosition="bottom"
                                locked={true}
                                springTension={1}
                                springFriction={1}
                                renderTabBar={() => <View />}
                            >
                                <View style={{ flex: 1 }} >

                                </View>
                                <TabStaff />
                                <TabService />
                                <TabExtra />

                                <View style={{ flex: 1 }} />

                                <View style={{ flex: 1 }} />

                                <View style={{ flex: 1, }} />

                                <View style={{ flex: 1, }} />

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
            </ParentContainer>
        );
    }
}

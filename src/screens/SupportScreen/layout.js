import React from 'react';
import {
    View,
    Image
} from 'react-native';

import { StatusBarHeader, Button, ParentContainer, Text, ScrollableTabView } from '@components';
import { ScaleSzie, localize } from '@utils';
import styles from './style';
import IMAGE from '@resources';
import { TabContactUs, TabVideos } from './widget';
import configs from "@configs";

const MENU = ["Videos", "Contact us"];

export default class Layout extends React.Component {

    renderHeader() {
        const { language } = this.props;
        return (
            <View style={{
                height: ScaleSzie(35), borderBottomColor: '#0764B0', borderWidth: 3, paddingLeft: ScaleSzie(50),
                justifyContent: 'center'
            }} >
                <Text style={{ fontSize: ScaleSzie(16), color: '#0764B0' }} >
                    {localize('Support', language)}
                </Text>
            </View>
        );
    }

    renderMenu() {
        const { indexTab } = this.state;
        return (
            <View style={{ width: ScaleSzie(150), backgroundColor: 'rgb(250,250,250)' }} >
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
                                height: ScaleSzie(50), borderBottomColor: 'rgb(241,241,241)', borderBottomWidth: 3,
                                flexDirection: 'row', alignItems: "center", paddingLeft: ScaleSzie(10)
                            }, temptBackground]} >
                                <Image source={IMAGE[temptIcon]} style={{
                                    width: ScaleSzie(18), height: ScaleSzie(18),
                                    marginRight: ScaleSzie(10)
                                }} />
                                <Text style={[{ color: '#404040', fontSize: ScaleSzie(16) }, temptTextColorSelect]} >
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
        const { language, navigation } = this.props;
        const { isFocus } = this.state;
        return (
            <ParentContainer
                handleLockScreen={this.handleLockScreen}
                activeScreen={isFocus}
                navigation={navigation}
                clearIntervalById={this.clearIntervalById}
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

                                <TabVideos />
                                <TabContactUs />

                            </ScrollableTabView>
                        </View>
                    </View>

                    <Button onPress={this.openDrawer} style={configs.btn_left_position} >
                        <Image source={IMAGE.openDrawer} style={{ width: ScaleSzie(34), height: ScaleSzie(34) }} />
                    </Button>

                    <Button onPress={this.backTab} style={[configs.btn_right_position, {
                        width: ScaleSzie(34), height: ScaleSzie(34), backgroundColor: '#0764B0', justifyContent: 'center', alignItems: 'center'
                    }]} >
                        <Image source={IMAGE.arrowRight} style={{ width: ScaleSzie(22), height: ScaleSzie(17) }} />
                    </Button>
                </View>
            </ParentContainer>
        );
    }
}

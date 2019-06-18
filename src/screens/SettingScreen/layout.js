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
import { TabMarketing, TabAppointment, TabCheckout } from './widget';

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
        return (
            <View style={{ width: scaleSzie(140), backgroundColor: 'rgb(250,250,250)' }} >
                <View style={{ height: scaleSzie(50), borderBottomColor: 'rgb(241,241,241)', borderBottomWidth: 3 }} >
                    <Image source={IMAGE.checkBox} style={{width:scaleSzie(18),height:scaleSzie(18)}} />
                    <Text>
                        General
                    </Text>
                </View>
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
                                initialPage={0}
                                tabBarPosition="bottom"
                                renderTabBar={() => <View />}
                            >
                                <View style={{ flex: 1 }} >

                                </View>
                                <View style={{ flex: 1 }} >

                                </View>
                                <View style={{ flex: 1, backgroundColor: 'red' }} >

                                </View>
                                <TabMarketing tabLabel={`${localize('MARKETING', language)}`} />
                                <TabAppointment tabLabel={`${localize('APPOINTMENT', language)}`} />
                                <TabCheckout tabLabel={`${localize('CHECKOUT', language)}`} />
                            </ScrollableTabView>
                        </View>
                    </View>

                    <Button onPress={this.openDrawer} style={{ position: 'absolute', top: 20, left: 0 }} >
                        <Image source={IMAGE.openDrawer} style={{ width: scaleSzie(34), height: scaleSzie(34) }} />
                    </Button>

                    <Button onPress={this.showLockScreen} style={{
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

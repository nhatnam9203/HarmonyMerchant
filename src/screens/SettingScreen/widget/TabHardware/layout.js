import React from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    TextInput,
    Image
} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import { ButtonCustom, Text, Dropdown } from '@components';
import { scaleSzie, localize, WorkingTime, getNameLanguage } from '@utils';
import IMAGE from '@resources';
import styles from './style';
import { HomeHardware, AddDeviceHardware } from './widget';

class Layout extends React.Component {

    render() {
        return (
            <View style={styles.container} >
                <ScrollableTabView
                    ref={this.scrollTabHardwareRef}
                    style={{}}
                    initialPage={2}
                    locked={true}
                    renderTabBar={() => <View />}
                    onChangeTab={(index) => {
                        this.setState({ tabCurrent: index.i })
                    }}
                >
                    <HomeHardware
                        gotoListDevices={this.gotoListDevices}
                    />
                    <AddDeviceHardware />
                    <View style={{ flex: 1, paddingHorizontal: scaleSzie(14), paddingTop: scaleSzie(20) }} >
                        <Text style={{
                            fontSize: scaleSzie(16),
                            fontWeight: '600',
                            color: '#0764B0'
                        }} >
                            Payment Terminal
                        </Text>
                        <Text style={{
                            fontSize: scaleSzie(16),
                            fontWeight: '600',
                            color: 'rgb(81,81,81)',
                            marginTop: scaleSzie(26),
                            marginBottom: scaleSzie(10)
                        }} >
                            Terminal configuration
                        </Text>

                        {/* ----------- Line ------------ */}
                        <View style={{ height: scaleSzie(1), backgroundColor: 'rgb(227,227,227)', }} />

                        {/* ------- Item ------ */}
                        <View style={{ flexDirection: 'row', marginTop: scaleSzie(20), }} >
                            <View style={{ marginRight: scaleSzie(60), justifyContent: 'center', }} >
                                <Text style={{ fontSize: scaleSzie(14), color: 'rgb(42,42,42)' }} >
                                    Name
                                </Text>
                            </View>
                            <View style={{ flex: 1, }} >
                                <View style={{
                                    height: scaleSzie(35), width: '85%', borderColor: 'rgb(227,227,227)',
                                    borderWidth: scaleSzie(1), paddingHorizontal: scaleSzie(10)
                                }} >
                                    <TextInput
                                        style={{ flex: 1, fontSize: scaleSzie(14) }}
                                        placeholder="Device name"
                                    />
                                </View>
                            </View>
                        </View>

                        {/* ------- Footer -------- */}
                        <View style={{ flex: 1, justifyContent: 'flex-end',paddingBottom:scaleSzie(30)}} >
                            <View style={{ flexDirection: 'row',justifyContent:'center' }} >
                                <ButtonCustom
                                    width={scaleSzie(130)}
                                    height={50}
                                    backgroundColor="#F1F1F1"
                                    title="CANCEL"
                                    textColor="#6A6A6A"
                                    onPress={this.searchService}
                                    style={{ borderWidth: 2, borderColor: 'rgb(227,227,227)', borderRadius: 2, }}
                                    styleText={{ fontSize: scaleSzie(20), fontWeight: '500' }}
                                />
                                <View style={{width:scaleSzie(100)}} />
                                <ButtonCustom
                                    width={scaleSzie(130)}
                                    height={50}
                                    backgroundColor="#0764B0"
                                    title="SAVE"
                                    textColor="#fff"
                                    onPress={this.searchService}
                                    style={{ borderWidth: 2, borderColor: 'rgb(227,227,227)', borderRadius: 2, }}
                                    styleText={{ fontSize: scaleSzie(20), fontWeight: '500' }}
                                />
                            </View>
                        </View>
                    </View>

                </ScrollableTabView>
            </View>

        );
    }
}



export default Layout;


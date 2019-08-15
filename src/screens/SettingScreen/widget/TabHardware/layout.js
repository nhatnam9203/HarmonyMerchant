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

class Layout extends React.Component {

    render() {
        return (
            <View style={styles.container} >
                <ScrollableTabView
                    ref={this.scrollTabHardwareRef}
                    style={{}}
                    initialPage={0}
                    locked={true}
                    renderTabBar={() => <View />}
                    onChangeTab={(index) => {
                        this.setState({ tabCurrent: index.i })
                    }}
                >
                    <View style={{ flex: 1 }} >

                        <View style={{
                            width: '100%', flexDirection: 'row', marginTop: scaleSzie(20), justifyContent: 'space-around',
                            paddingHorizontal: scaleSzie(10)
                        }} >
                             {/* ------------- Box 1 ----------- */}
                            <View style={styles.box} >
                                <View style={styles.containerIconBox} >
                                    <Image source={IMAGE.Barcode} style={{
                                        width: scaleSzie(33),
                                        height: scaleSzie(35)
                                    }} />
                                </View>
                                <View style={styles.containerTextBox} >
                                    <Text style={styles.textBox} >
                                        Barcode scanner
                                    </Text>
                                    <Text style={[styles.textBox, { fontWeight: 'normal', fontSize: scaleSzie(11), marginTop: scaleSzie(10) }]} >
                                        No device
                                    </Text>
                                </View>
                            </View>
                            {/* ------------- Box 2 ----------- */}
                            <View style={styles.box} >
                                <View style={styles.containerIconBox} >
                                    <Image source={IMAGE.Pax} style={{
                                        width: scaleSzie(25),
                                        height: scaleSzie(35)
                                    }} />
                                </View>
                                <View style={styles.containerTextBox} >
                                    <Text style={styles.textBox} >
                                        Payment terminal
                                    </Text>
                                    <Text style={[styles.textBox, { fontWeight: 'normal', fontSize: scaleSzie(11), marginTop: scaleSzie(10) }]} >
                                        No device
                                    </Text>
                                </View>
                            </View>
                             {/* ------------- Box 3 ----------- */}
                            <View style={styles.box} >
                                <View style={styles.containerIconBox} >
                                    <Image source={IMAGE.Print} style={{
                                        width: scaleSzie(28),
                                        height: scaleSzie(35)
                                    }} />
                                </View>
                                <View style={styles.containerTextBox} >
                                    <Text style={styles.textBox} >
                                        Receipt printer
                                    </Text>
                                    <Text style={[styles.textBox, { fontWeight: 'normal', fontSize: scaleSzie(11), marginTop: scaleSzie(10) }]} >
                                        No device
                                    </Text>
                                </View>
                            </View>
                        </View>

                    </View>

                </ScrollableTabView>
            </View>

        );
    }
}



export default Layout;


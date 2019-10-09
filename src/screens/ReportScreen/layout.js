import React from 'react';
import {
    View,
    Image,
    TextInput,
    FlatList
} from 'react-native';

import { Text, StatusBarHeader, Button, ParentContainer, ButtonCustom } from '@components';
import { scaleSzie, localize } from '@utils';
import styles from './style';
import IMAGE from '@resources';

export default class Layout extends React.Component {

    renderHeader() {
        const { language } = this.props;
        return (
            <View style={{
                height: scaleSzie(35), borderBottomColor: '#0764B0', borderWidth: 3, paddingLeft: scaleSzie(50),
                justifyContent: 'center'
            }} >
                <Text style={{ fontSize: scaleSzie(16), color: '#0764B0' }} >
                    {localize('Reports', language)}
                </Text>
            </View>
        );
    }

    renderFilter() {
        return (
            <View style={{ paddingHorizontal: scaleSzie(20), marginTop: scaleSzie(20) }} >
                {/* ---------- Row 1 ---------- */}
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={IMAGE.sale} style={{ width: scaleSzie(26), height: scaleSzie(32) }} />
                    <Text style={{ color: '#6A6A6A', fontSize: scaleSzie(22), fontWeight: '700', marginLeft: scaleSzie(8) }} >
                        Compare sales of Staffs
                    </Text>
                </View>
                {/* ---------- Row 2 ---------- */}
                <View style={{ flexDirection: 'row',marginTop:scaleSzie(16) }}>
                    <Text style={{ fontSize: scaleSzie(18), color: '#6A6A6A' }} >
                        Filters
                    </Text>
                </View>
                {/* ---------- Row 3 ---------- */}
            </View>
        );
    }

    render() {
        const { isFocus } = this.state;
        return (
            <ParentContainer
                handleLockScreen={this.handleLockScreen}
                activeScreen={isFocus}
            >
                <View style={styles.container} >
                    <StatusBarHeader />
                    {this.renderHeader()}
                    {this.renderFilter()}
                    <Button onPress={this.openDrawer} style={{ position: 'absolute', top: 20, left: 0 }} >
                        <Image source={IMAGE.openDrawer} style={{ width: scaleSzie(34), height: scaleSzie(34) }} />
                    </Button>
                </View>
            </ParentContainer>
        );
    }
}

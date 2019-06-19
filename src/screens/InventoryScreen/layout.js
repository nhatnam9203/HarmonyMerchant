import React from 'react';
import {
    View,
    Image
} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import { Text, StatusBarHeader, Button, ParentContainer } from '@components';
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
                    {localize('Inventory', language)}
                </Text>
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

import React from 'react';
import {
    View,
    Image,
    Text,
    ImageBackground,
} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import { DefaultTabBar ,Button} from '../../components';
import { scaleSzie } from '../../utils';
import styles from './style';
import Configs from '../../configs';
import IMAGE from '../../resources';
import { TabStoreInfo, TabAdminInfo, TabStaffManagement, TabServiceProduct } from './widget';

export default class Layout extends React.Component {

    render() {
        return (
            <View style={styles.container} >
                <ScrollableTabView
                    ref={this.scrollTabRef}
                    style={{}}
                    initialPage={0}
                    locked={true}
                    renderTabBar={() => <DefaultTabBar
                        activeTextColor="#fff"
                        inactiveTextColor="#6A6A6A"
                        backgroundTabActive="#0764B0"
                        textStyle={{
                            fontSize: scaleSzie(14)
                        }}
                    />}
                >
                    <TabStoreInfo tabLabel='1. Store Info'
                        nextTab={() => this.scrollTabRef.current.goToPage(1)}
                    />
                    <TabAdminInfo tabLabel='2. Admin Info'
                        backTab={() => this.scrollTabRef.current.goToPage(0)}
                        nextTab={this.gotoTabStaffManagement}
                    />
                    <TabStaffManagement tabLabel='3. Staff Management'
                        backTab={() => this.scrollTabRef.current.goToPage(1)}
                        nextTab={this.gotoTabService}
                    />
                    <TabServiceProduct tabLabel='4. Services / Products'
                        backTab={() => this.scrollTabRef.current.goToPage(2)}
                    />
                </ScrollableTabView>
                <Button onPress={this.signOut} style={{position:'absolute',top:0,right:0}} >
                    <Image source={IMAGE.signOut} style={{ width: scaleSzie(40), height: scaleSzie(40) }} />
                </Button>

            </View>

        );
    }
}

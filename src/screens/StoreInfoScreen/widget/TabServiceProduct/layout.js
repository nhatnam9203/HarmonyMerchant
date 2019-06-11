import React from 'react';
import {
    View,
    Image,
    ScrollView,
    FlatList,
} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import { CustomTabBar } from '../../../../components';
import { scaleSzie } from '../../../../utils';
import styles from './style';
import { TabCategories, TabServices, TabExtra, TabProducts } from './widget';
import IMAGE from '../../../../resources';

class Layout extends React.Component {

    render() {
        return (
            <View style={styles.container} >
                <ScrollableTabView
                    ref={this.scrollTabRef}
                    style={{}}
                    initialPage={2}
                    renderTabBar={() => <CustomTabBar
                        activeTextColor="#fff"
                        inactiveTextColor="#6A6A6A"
                        backgroundTabActive="#0764B0"
                        textStyle={{
                            fontSize: scaleSzie(16)
                        }}
                    />}
                >
                    <TabCategories tabLabel='Categories'
                        backTab={() => this.props.backTab()}
                        nextTab={this.gotoTabServices}
                    />
                    <TabServices tabLabel='Services'
                        backTab={() => this.scrollTabRef.current.goToPage(0)}
                        nextTab={this.gotoTabExtra}
                    />
                    <TabExtra tabLabel='Extra'
                        backTab={() => this.scrollTabRef.current.goToPage(1)}
                        nextTab={this.gotoTabProduct}
                    />
                    <TabProducts tabLabel='Products' 
                     backTab={() => this.scrollTabRef.current.goToPage(2)}
                     nextTab={this.gotoCongratulation}
                    />

                </ScrollableTabView>
            </View>
        );
    }

}

export default Layout;


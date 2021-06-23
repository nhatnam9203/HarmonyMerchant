import React from 'react';
import {
    View,
} from 'react-native';

import { CustomTabBar,ScrollableTabView } from '@components';
import { ScaleSzie ,localize} from '@utils';
import styles from './style';
import { TabCategories, TabServices, TabExtra, TabProducts } from './widget';

class Layout extends React.Component {

    render() {
        const {language} = this.props;

        return (
            <View style={styles.container} >
                <ScrollableTabView
                    ref={this.scrollTabRef}
                    style={{}}
                    initialPage={0}
                    renderTabBar={() => <CustomTabBar
                        activeTextColor="#fff"
                        inactiveTextColor="#6A6A6A"
                        backgroundTabActive="#0764B0"
                        textStyle={{
                            fontSize: ScaleSzie(16)
                        }}
                    />}
                >
                    <TabCategories tabLabel={localize('Categories', language)}
                        backTab={() => this.props.backTab()}
                        nextTab={this.gotoTabServices}
                    />
                    <TabServices tabLabel={localize('Services', language)}
                        backTab={() => this.scrollTabRef.current.goToPage(0)}
                        nextTab={this.gotoTabExtra}
                    />
                    <TabExtra tabLabel={localize('Extra', language)}
                        backTab={() => this.scrollTabRef.current.goToPage(1)}
                        nextTab={this.gotoTabProduct}
                    />
                    <TabProducts tabLabel={localize('Products', language)}
                        backTab={() => this.scrollTabRef.current.goToPage(2)}
                        nextTab={this.gotoCongratulation}
                    />

                </ScrollableTabView>
            </View>
        );
    }

}

export default Layout;


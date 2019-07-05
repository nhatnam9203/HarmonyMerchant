import React from 'react';
import {
    View,
    Image,
    ScrollView,
    FlatList,
} from 'react-native';

import { scaleSzie, localize } from '@utils';
import { Text } from '@components';
import styles from './style';
import IMAGE from '@resources';
import { ItemCategory, ColPlaceHolder } from './widget';

class Layout extends React.Component {

    renderHeader() {
        const { language } = this.props;
        return (
            <View style={styles.headerContainer} >
                <Text style={styles.textHeader} >
                    {`${localize('Customer', language)}:`}
                </Text>
                <Text style={[styles.textHeader, { marginLeft: scaleSzie(12), marginRight: scaleSzie(90) }]} >
                    Jerry Nguyen
                </Text>
                <Text style={styles.textHeader} >
                    {`${localize('Phone', language)}:`}
                </Text>
                <Text style={[styles.textHeader, { marginLeft: scaleSzie(12) }]} >
                    0123 456 789
                </Text>
            </View>
        );
    }

    renderCategoriesCheckout() {
        const { language } = this.props;
        return (
            <View style={{ width: scaleSzie(180), flexDirection: 'row' }} >
                <View style={{ flex: 1 }} >
                    {/* ------- Header ----- */}
                    <View style={[styles.categoriesHeader, { borderRightWidth: 0 }]} >
                        <Text style={styles.textHeader} >
                            {localize('Categories', language)}
                        </Text>
                    </View>
                    {/* ------- Body ----- */}
                    <View style={styles.categoriesBody} >
                        <ItemCategory />
                        <ItemCategory />
                        <ItemCategory />
                        <ItemCategory />
                    </View>
                </View>

                {/* ------- Line ----- */}
                {this.renderLineShadow()}
            </View>
        );
    }

    renderLineShadow() {
        return <View style={styles.shadowLine} />;
    }

    renderBodyCheckout() {
        return (
            <View style={{ flex: 1, flexDirection: 'row' }} >
                {this.renderCategoriesCheckout()}
                <View style={{ width: scaleSzie(5) }} />
                <ColPlaceHolder />
                <ColPlaceHolder />
                <View style={{ flex: 1 }} >

                </View>
            </View>
        );
    }

    render() {
        return (
            <View style={styles.container} >
                {this.renderHeader()}
                {this.renderBodyCheckout()}
            </View>
        );
    }

}

export default Layout;


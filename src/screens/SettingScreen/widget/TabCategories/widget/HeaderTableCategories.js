import React from 'react';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';

import { scaleSzie, localize } from '@utils';

class HeaderTableCategories extends React.Component {

    render() {
        const { language } = this.props;

        return (
            <View style={styles.tableHeader} >
                {/* ----- 1 ------ */}
                <View style={[{
                    width: scaleSzie(50),
                }, styles.itemTableHeaderContainer]} >
                    <Text style={styles.textTableHeader} >
                        {`${localize('No', language)}.`}
                    </Text>
                </View>
                {/* ----- 2 ------ */}
                <View style={{
                    width: scaleSzie(150), flexDirection: 'row',
                }} >
                    <View style={{ flex: 1, justifyContent: 'center', paddingLeft: scaleSzie(5) }} >
                        <Text style={styles.textTableHeader} >

                            {localize('Name', language)}
                        </Text>
                    </View>
                </View>
                {/* ----- 3 ------ */}
                <View style={{
                    width: scaleSzie(100), flexDirection: 'row',
                }} >
                    <View style={{ flex: 1, justifyContent: 'center', paddingLeft: scaleSzie(10) }} >
                        <Text style={styles.textTableHeader} >

                            {localize('Type', language)}
                        </Text>
                    </View>
                </View>
                {/* ----- 4 ------ */}
                <View style={{
                    width: scaleSzie(170), flexDirection: 'row',
                }} >
                    <View style={{ flex: 1, justifyContent: 'center', paddingLeft: scaleSzie(10) }} >
                        <Text style={styles.textTableHeader} >

                            {localize('Display on Sign In App', language)}
                        </Text>
                    </View>
                </View>
                {/* ----- 5 ----- */}
                <View style={[{
                    flex: 1
                }, styles.itemTableHeaderContainer]} >
                    <Text style={styles.textTableHeader} >

                        {localize('Actions', language)}
                    </Text>
                </View>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tableHeader: {
        height: scaleSzie(35),
        backgroundColor: '#fff',
        borderBottomWidth: 0.5,
        borderBottomColor: '#C5C5C5',
        flexDirection: 'row'
    },
    textTableHeader: {
        color: '#0764B0',
        fontSize: scaleSzie(14)
    },
    itemTableHeaderContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    iconSort: {
        width: scaleSzie(8),
        height: scaleSzie(12)
    }

})

export default HeaderTableCategories;


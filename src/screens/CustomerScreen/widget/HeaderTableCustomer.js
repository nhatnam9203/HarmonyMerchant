import React from 'react';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';

import { scaleSize, localize } from '@utils';

class HeaderTableCustomer extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { language } = this.props;
        return (
            <View style={styles.tableHeader} >
                {/* ----- 1 ------ */}
                <View style={{ width : scaleSize(60), flexDirection: 'row' }} >
                    <View style={{ flex: 1, justifyContent: 'center', paddingLeft: scaleSize(10) }} >
                        <Text style={styles.textTableHeader} >
                            {localize('No.', language)}
                        </Text>
                    </View>
                </View>
                <View style={{ flex: 1, flexDirection: 'row' }} >
                    <View style={{ flex: 1, justifyContent: 'center', paddingLeft: scaleSize(10) }} >
                        <Text style={styles.textTableHeader} >
                            {localize('Name', language)}
                        </Text>
                    </View>
                </View>
                {/* ----- 2 ------ */}
                <View style={{ flex: 1, flexDirection: 'row' }} >
                    <View style={{ flex: 1, justifyContent: 'center'}} >
                        <Text style={styles.textTableHeader} >
                            {localize('Phone Number', language)}
                        </Text>
                    </View>
                </View>
                {/* ----- 3 ------ */}
                <View style={{ flex: 1.3, flexDirection: 'row' }} >
                    <View style={{ flex: 1, justifyContent: 'center', paddingLeft: scaleSize(10) }} >
                        <Text style={styles.textTableHeader} >
                            {localize('Email', language)}
                        </Text>
                    </View>
                </View>
                {/* ----- 4 ------ */}
                <View style={{ flex: 1, flexDirection: 'row' }} >
                    <View style={{ flex: 1, justifyContent: 'center', paddingLeft: scaleSize(10) }} >
                        <Text style={styles.textTableHeader} >
                            {localize('Referrer', language)}
                        </Text>
                    </View>
                </View>
                {/* ----- 5 ------ */}
                <View style={{ flex: 1, flexDirection: 'row' }} >
                    <View style={{ flex: 1, justifyContent: 'center', paddingLeft: scaleSize(10) }} >
                        <Text style={styles.textTableHeader} >
                            {localize('Referrer phone', language)}
                        </Text>
                    </View>
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
        height: scaleSize(40),
        backgroundColor: '#F1F1F1',
        flexDirection: 'row'
    },
    textTableHeader: {
        color: '#0764B0',
        fontSize: scaleSize(15),
        fontWeight: "600"
    },
    itemTableHeaderContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    iconSort: {
        width: scaleSize(8),
        height: scaleSize(12)
    }

})

export default HeaderTableCustomer;


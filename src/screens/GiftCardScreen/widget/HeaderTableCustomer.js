import React from 'react';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';

import { scaleSize,localize } from '@utils';

class HeaderTableCustomer extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {language} = this.props;

        return (
            <View style={styles.tableHeader} >
                {/* ----- 1 ------ */}
                <View style={{  flex:1, flexDirection: 'row'}} >
                    <View style={{ width: 1, paddingVertical: scaleSize(3) }} >
                        <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center', paddingLeft: scaleSize(10) }} >
                        <Text style={styles.textTableHeader} >
                        {localize('ID', language)}
                        </Text>
                    </View>
                    {/* <View style={{ width: 1, paddingVertical: scaleSize(3) }} >
                        <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                    </View> */}
                </View>
                {/* ----- 2 ------ */}
                <View style={{flex:1.2, flexDirection: 'row'}} >
                    <View style={{ flex: 1, justifyContent: 'center', paddingLeft: scaleSize(10) }} >
                        <Text style={styles.textTableHeader} >

                        {localize('Serial', language)}
                            </Text>
                    </View>
                    {/* <View style={{ width: 1, paddingVertical: scaleSize(3) }} >
                        <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                    </View> */}
                </View>
                {/* ----- 3 ------ */}
                <View style={{flex:1, flexDirection: 'row' }} >
                    <View style={{ flex: 1, justifyContent: 'center', paddingLeft: scaleSize(10) }} >
                        <Text style={styles.textTableHeader} >

                        {localize('Created On', language)}
                            </Text>
                    </View>
                    {/* <View style={{ width: 1, paddingVertical: scaleSize(3) }} >
                        <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                    </View> */}
                </View>

                {/* ----- 4 ------ */}
                <View style={{ flex:1, flexDirection: 'row'}} >
                    <View style={{ flex: 1, justifyContent: 'center',alignItems:"flex-end",paddingHorizontal: scaleSize(10) }} >
                        <Text style={styles.textTableHeader} >

                        {localize('Value', language)}
                        </Text>
                    </View>
                    {/* <View style={{ width: 1, paddingVertical: scaleSize(3) }} >
                        <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                    </View> */}
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
        // borderWidth: 0.5,
        // borderColor: '#C5C5C5',
        flexDirection: 'row'
    },
    textTableHeader: {
        color: '#0764B0',
        fontSize: scaleSize(15),
        fontWeight:"600"
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


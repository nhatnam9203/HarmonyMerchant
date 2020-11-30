import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Platform
} from 'react-native';

import { Button, } from '@components';
import { scaleSzie } from '@utils';
import Configs from "@configs";

class CustomerDetailTab extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={{ flex: 1, padding: scaleSzie(10) }} >
                <View style={{ flex: 1, flexDirection: "row" }} >
                    {/* --------------- Left Content ----------- */}
                    <View style={{ flex: 1,...styles.SHADOW}} >
                   

                    </View>

                    {/* --------------- Line ----------- */}
                    <View style={{ width: scaleSzie(12) }} />

                    {/* --------------- Right Content ----------- */}
                    <View style={{ flex: 1.7}} >
                        {/* --------------- Top Right Content ----------- */}
                        <View style={{ height: scaleSzie(130),...styles.SHADOW}} >

                        </View>
                        {/* --------------- Line ----------- */}
                        <View style={{ height: scaleSzie(12) }} />
                        {/* --------------- Bottom Right Content ----------- */}
                        <View style={{ flex: 1 ,...styles.SHADOW}} >

                        </View>
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
        height: scaleSzie(50),
        backgroundColor: '#FAFAFA',
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
        flexDirection: 'row'
    },
    textTableHeader: {
        color: '#6A6A6A',
        fontSize: scaleSzie(14)
    },
    itemTableHeaderContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    actionButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    SHADOW: { 
        backgroundColor: "#fff",
        borderRadius: scaleSzie(4),
        ...Platform.select({
            ios: {
                shadowRadius: 2,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
                shadowOpacity: 0.6,
                shadowOffset: { width: 0, height: 1 },
            },

            android: {
                elevation: 2,
            },
        })
    },

})

export default CustomerDetailTab;


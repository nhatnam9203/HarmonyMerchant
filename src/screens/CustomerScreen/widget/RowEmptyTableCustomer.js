import React from 'react';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';

import { Button, } from '@components';
import { ScaleSzie } from '@utils';

const RowEmptyTableCustomer = () => {
    return (
        <View style={styles.tableHeader} >
            {/* ----- 1 ------ */}
            <View style={{
                flex: 1, flexDirection: 'row',
            }} >
                <View style={[{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingLeft: ScaleSzie(12)
                }]} >
                    <Button onPress={this.selectCheckBox} style={{ marginRight: ScaleSzie(12) }} >
                    </Button>
                    <Text style={styles.textTableHeader} >
                        {/* {product.name} */}
                    </Text>
                </View>
                <View style={{ width: 1, paddingVertical: ScaleSzie(3) }} >
                    <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                </View>
            </View>
            {/* ----- 2 ----- */}
            <View style={{
                width: ScaleSzie(172), flexDirection: 'row',
            }} >
                <View style={{ flex: 1, justifyContent: 'center', paddingLeft: ScaleSzie(10) }} >
                    <Text style={styles.textTableHeader} >
                        {/* {product.status} */}
                    </Text>
                </View>
                <View style={{ width: 1, paddingVertical: ScaleSzie(3) }} >
                    <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                </View>
            </View>
            {/* ----- 3 ----- */}
            <View style={{
                width: ScaleSzie(172), flexDirection: 'row',
            }} >
                <View style={{ flex: 1, justifyContent: 'center', paddingLeft: ScaleSzie(10) }} >
                    <Text style={styles.textTableHeader} >
                        {/* {product.price} */}
                    </Text>
                </View>
                <View style={{ width: 1, paddingVertical: ScaleSzie(3) }} >
                    <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                </View>
            </View>
            {/* ----- 4 ------ */}

            {/* ----- 3 ----- */}
            <View style={{
                width: ScaleSzie(172), flexDirection: 'row',
            }} >
                <View style={{ flex: 1, justifyContent: 'center', paddingLeft: ScaleSzie(10) }} >
                    <Text style={styles.textTableHeader} >
                        {/* {product.price} */}
                    </Text>
                </View>
                <View style={{ width: 1, paddingVertical: ScaleSzie(3) }} >
                    <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                </View>
            </View>
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tableHeader: {
        height: ScaleSzie(60),
        backgroundColor: '#FAFAFA',
        borderWidth: 0.5,
        borderColor: '#C5C5C5',
        flexDirection: 'row'
    },
    textTableHeader: {
        color: '#C5C5C5',
        fontSize: ScaleSzie(14)
    },
    itemTableHeaderContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    actionButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }

})

export default RowEmptyTableCustomer;


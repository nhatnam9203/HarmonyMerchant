import React from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet
} from 'react-native';

import { Button, } from '@components';
import { scaleSzie } from '@utils';

const RowEmptyTableProducts = () => {
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
                    paddingLeft: scaleSzie(12)
                }]} >
                    <Button onPress={this.selectCheckBox} style={{ marginRight: scaleSzie(12) }} >
                    </Button>
                    <Text style={styles.textTableHeader} >
                        {/* {product.name} */}
                    </Text>
                </View>
                <View style={{ width: 1, paddingVertical: scaleSzie(3) }} >
                    <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                </View>
            </View>
            {/* ----- 2 ----- */}
            <View style={{
                width: scaleSzie(140), flexDirection: 'row',
            }} >
                <View style={{ flex: 1, justifyContent: 'center', paddingLeft: scaleSzie(10) }} >
                    <Text style={styles.textTableHeader} >
                        {/* {product.status} */}
                    </Text>
                </View>
                <View style={{ width: 1, paddingVertical: scaleSzie(3) }} >
                    <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                </View>
            </View>
            {/* ----- 3 ----- */}
            <View style={{
                width: scaleSzie(140), flexDirection: 'row',
            }} >
                <View style={{ flex: 1, justifyContent: 'center', paddingLeft: scaleSzie(10) }} >
                    <Text style={styles.textTableHeader} >
                        {/* {product.price} */}
                    </Text>
                </View>
                <View style={{ width: 1, paddingVertical: scaleSzie(3) }} >
                    <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                </View>
            </View>
            {/* ----- 3 ----- */}
            <View style={{
                width: scaleSzie(140), flexDirection: 'row',
            }} >
                <View style={{ flex: 1, justifyContent: 'center', paddingLeft: scaleSzie(10) }} >
                    <Text style={styles.textTableHeader} >
                        {/* {product.price} */}
                    </Text>
                </View>
                <View style={{ width: 1, paddingVertical: scaleSzie(3) }} >
                    <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                </View>
            </View>
            {/* ----- 4 ------ */}

            {/* ----- 3 ----- */}
            <View style={{
                width: scaleSzie(140), flexDirection: 'row',
            }} >
                <View style={{ flex: 1, justifyContent: 'center', paddingLeft: scaleSzie(10) }} >
                    <Text style={styles.textTableHeader} >
                        {/* {product.price} */}
                    </Text>
                </View>
                <View style={{ width: 1, paddingVertical: scaleSzie(3) }} >
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
        height: scaleSzie(60),
        backgroundColor: '#FAFAFA',
        borderWidth: 0.5,
        borderColor: '#C5C5C5',
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
    }

})

export default RowEmptyTableProducts;


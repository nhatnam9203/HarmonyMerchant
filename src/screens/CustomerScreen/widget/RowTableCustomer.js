import React from 'react';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';

import { Button, } from '@components';
import { scaleSzie } from '@utils';

class RowTableCustomer extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { customer} = this.props;

        return (
            <Button onPress={() => this.props.showModalDetail(customer)} style={styles.tableHeader} >
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
                        <Text style={styles.textTableHeader} >
                            {`${customer.firstName} ${customer.lastName}`}
                        </Text>
                    </View>
                    <View style={{ width: 1, paddingVertical: scaleSzie(3) }} >
                        <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                    </View>
                </View>
                {/* ----- 2 ----- */}
                <View style={{
                    width: scaleSzie(172), flexDirection: 'row',
                }} >
                    <View style={{ flex: 1, justifyContent: 'center', paddingLeft: scaleSzie(10) }} >
                        <Text style={styles.textTableHeader} >
                            {customer.phone}
                        </Text>
                    </View>
                    <View style={{ width: 1, paddingVertical: scaleSzie(3) }} >
                        <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                    </View>
                </View>
                {/* ----- 3 ----- */}
                <View style={{
                    width: scaleSzie(172), flexDirection: 'row',
                }} >
                    <View style={{ flex: 1, justifyContent: 'center', paddingLeft: scaleSzie(10) }} >
                        <Text style={styles.textTableHeader} >
                            {customer.email}
                        </Text>
                    </View>
                    <View style={{ width: 1, paddingVertical: scaleSzie(3) }} >
                        <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                    </View>
                </View>
                {/* ----- 3 ----- */}
                <View style={{
                    width: scaleSzie(172), flexDirection: 'row',
                }} >
                    <View style={{ flex: 1, justifyContent: 'center', paddingLeft: scaleSzie(10) }} >
                        <Text style={styles.textTableHeader} >
                            {customer.referrerPhone === '+1' || customer.referrerPhone === '+84' ? '' : customer.referrerPhone}
                        </Text>
                    </View>
                    <View style={{ width: 1, paddingVertical: scaleSzie(3) }} >
                        <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                    </View>
                </View>
            </Button>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tableHeader: {
        height: scaleSzie(60),
        backgroundColor: '#FAFAFA',
        borderBottomWidth: 1,
        borderBottomColor: '#C5C5C5',
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

export default RowTableCustomer;


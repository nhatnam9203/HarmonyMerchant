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
        const { customer } = this.props;

        return (
            <Button onPress={() => this.props.showModalDetail(customer)} style={styles.tableHeader} >
                {/* ----- 1 ------ */}
                <View style={{ flex: 1, flexDirection: 'row' }} >
                    <View style={[{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: scaleSzie(12)
                    }]} >
                        <Text style={styles.textTableHeader} numberOfLines={1} >
                            {`${customer?.firstName || ""} ${customer?.lastName || ""}`}
                        </Text>
                    </View>
                    {/* <View style={{ width: 1, paddingVertical: scaleSzie(3) }} >
                        <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                    </View> */}
                </View>

                {/* ----- 2 ----- */}
                <View style={{flex:1,  flexDirection: 'row' }} >
                    <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: scaleSzie(10) }} >
                        <Text style={styles.textTableHeader} numberOfLines={1} >
                            {customer?.phone || ""}
                        </Text>
                    </View>
                    {/* <View style={{ width: 1, paddingVertical: scaleSzie(3) }} >
                        <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                    </View> */}
                </View>

                {/* ----- 3 ----- */}
                <View style={{flex:1.3, flexDirection: 'row',}} >
                    <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: scaleSzie(10) }} >
                        <Text style={styles.textTableHeader} numberOfLines={1} >
                            {customer?.email || ""}
                        </Text>
                    </View>
                    {/* <View style={{ width: 1, paddingVertical: scaleSzie(3) }} >
                        <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                    </View> */}
                </View>

                {/* ----- 4 ----- */}
                <View style={{ flex: 1, flexDirection: 'row' }} >
                    <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: scaleSzie(10) }} >
                        <Text style={styles.textTableHeader} numberOfLines={1} >
                            {customer?.referrerBy || ""}
                        </Text>
                    </View>
                    {/* <View style={{ width: 1, paddingVertical: scaleSzie(3) }} >
                        <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                    </View> */}
                </View>

                {/* ----- 5 ----- */}
                <View style={{ flex: 1, flexDirection: 'row' }} >
                    <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: scaleSzie(10) }} >
                        <Text style={styles.textTableHeader} numberOfLines={1} >
                            {customer?.referrerPhone || ""}
                        </Text>
                    </View>
                    {/* <View style={{ width: 1, paddingVertical: scaleSzie(3) }} >
                        <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                    </View> */}
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
    }

})

export default RowTableCustomer;


import React from 'react';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';

import { Button, } from '@components';
import { ScaleSzie, formatWithMoment } from '@utils';

class RowTableCustomer extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { giftCard } = this.props;

        return (
            <Button onPress={() => this.props.goToGiftCardLogs(giftCard)} style={styles.tableHeader} >
                {/* ----- 1 ------ */}
                <View style={{ flex: 1, flexDirection: 'row' }} >
                    <View style={[{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: ScaleSzie(12)
                    }]} >
                        <Text style={styles.textTableHeader} numberOfLines={1} >
                            {`${giftCard?.giftCardId || 0}`}
                        </Text>
                    </View>

                </View>

                {/* ----- 2 ----- */}
                <View style={{ flex: 1.2, flexDirection: 'row' }} >
                    <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: ScaleSzie(10) }} >
                        <Text style={styles.textTableHeader} numberOfLines={1} >
                            {`${giftCard?.serialNumber || 0}`}
                        </Text>
                    </View>

                </View>

                {/* ----- 3 ----- */}
                <View style={{ flex: 1, flexDirection: 'row', }} >
                    <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: ScaleSzie(10) }} >
                        <Text style={styles.textTableHeader} numberOfLines={1} >
                            {`${formatWithMoment(giftCard?.createdDate, "MMM DD, YYYY")}`}
                        </Text>
                    </View>

                </View>

                {/* ----- 4 ----- */}
                <View style={{ flex: 1, flexDirection: 'row' }} >
                    <View style={{ flex: 1, justifyContent: 'center',alignItems:"flex-end",paddingHorizontal: ScaleSzie(10) }} >
                        <Text style={styles.textTableHeader} numberOfLines={1} >
                            {`$ ${giftCard?.amount}`}
                        </Text>
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
        height: ScaleSzie(50),
        backgroundColor: '#FAFAFA',
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
        flexDirection: 'row'
    },
    textTableHeader: {
        color: '#6A6A6A',
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

export default RowTableCustomer;


import React from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet,
    FlatList
} from 'react-native';

import { Button } from '@components';
import { ScaleSzie, formatNumberFromCurrency, formatMoney, roundFloatNumber } from '@utils';

class RowFooterStaffSalary extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            sortUpStaffName: false,
            sortUpId: false,
            sortUpRole: false,
            sortUpStatus: false
        }
    }

    sortStaffName = () => {
        this.setState(prevState => ({
            sortUpStaffName: !prevState.sortUpStaffName
        }))
    }

    sortId = () => {
        this.setState(prevState => ({
            sortUpId: !prevState.sortUpId
        }))
    }

    sortRole = () => {
        this.setState(prevState => ({
            sortUpRole: !prevState.sortUpRole
        }))
    }

    sortStatus = () => {
        this.setState(prevState => ({
            sortUpStatus: !prevState.sortUpStatus
        }))
    }

    handleTotal = keyTotal => (accumulator, currentValue) => ({
        [keyTotal]: formatNumberFromCurrency(accumulator[keyTotal]) + formatNumberFromCurrency(currentValue[keyTotal])
    });


    handleTotal1 = (accumulator, currentValue) => accumulator + currentValue;
    render() {
        const { data } = this.props;

        const tipAmount = roundFloatNumber((data.reduce(this.handleTotal('tip'), 0)).tip);
        const totalAmount = roundFloatNumber((data.reduce(this.handleTotal('total'), 0)).total);
        const split = roundFloatNumber((data.reduce(this.handleTotal('split'), 0)).split);
        const product = roundFloatNumber((data.reduce(this.handleTotal('product'), 0)).product);


        return (
            <View style={styles.tableHeader} >
                {/* ----- 0 ------ */}
                <View style={{
                    width: ScaleSzie(40), flexDirection: 'row',
                }} >
                    <View style={{ flex: 1, justifyContent: 'center', paddingLeft: ScaleSzie(10) }} >
                    </View>
                </View>
                {/* ----- 1 ------ */}
                <View style={{
                    flex: 1, flexDirection: 'row'
                }} >
                    <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: ScaleSzie(10) }} >
                        <Text style={[styles.textTableHeader, { fontWeight: 'bold' }]} numberOfLines={1} >
                            Total
                        </Text>
                    </View>
                    <View style={{ width: 1, paddingVertical: ScaleSzie(3) }} >
                        <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                    </View>
                </View>
                {/* ----- 2 ------ */}

                {/* ----- 5 ------ */}
                <View style={{
                    width: ScaleSzie(120), flexDirection: 'row',
                }} >
                    <View style={{ flex: 1, justifyContent: 'center', paddingLeft: ScaleSzie(10) }} >
                        <Text style={styles.textTableHeader} >
                            {`$ ${formatMoney(split)}`}
                        </Text>
                    </View>
                    <View style={{ width: 1, paddingVertical: ScaleSzie(3) }} >
                        <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                    </View>
                </View>
                {/* ----- 6 ------ */}
                <View style={{
                    width: ScaleSzie(120), flexDirection: 'row',
                }} >
                    <View style={{ flex: 1, justifyContent: 'center', paddingLeft: ScaleSzie(10) }} >
                        <Text style={styles.textTableHeader} >
                            {`$ ${formatMoney(tipAmount)}`}
                        </Text>
                    </View>
                    <View style={{ width: 1, paddingVertical: ScaleSzie(3) }} >
                        <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                    </View>
                </View>
                {/* ----- product ------ */}
                <View style={{
                    width: ScaleSzie(120), flexDirection: 'row',
                }} >
                    <View style={{ flex: 1, justifyContent: 'center', paddingLeft: ScaleSzie(10) }} >
                        <Text style={styles.textTableHeader} >
                            {`$ ${formatMoney(product)}`}
                        </Text>
                    </View>
                    <View style={{ width: 1, paddingVertical: ScaleSzie(3) }} >
                        <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                    </View>
                </View>
                {/* ----- total ------ */}
                <View style={{
                    width: ScaleSzie(120), flexDirection: 'row',
                }} >
                    <View style={{ flex: 1, justifyContent: 'center', paddingLeft: ScaleSzie(10) }} >
                        <Text style={styles.textTableHeader} >
                            {`$ ${formatMoney(totalAmount)}`}
                        </Text>
                    </View>
                    <View style={{ width: 1, paddingVertical: ScaleSzie(3) }} >
                        <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
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
        height: ScaleSzie(40),
        backgroundColor: '#E5E5E5',
        borderWidth: 0.5,
        borderColor: '#C5C5C5',
        flexDirection: 'row',
        marginBottom:ScaleSzie(7)
    },
    textTableHeader: {
        color: '#6A6A6A',
        fontSize: ScaleSzie(13)
    },
    itemTableHeaderContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    iconSort: {
        width: ScaleSzie(8),
        height: ScaleSzie(12)
    }

})

export default RowFooterStaffSalary;


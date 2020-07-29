import React from 'react';
import {
    View,
    TextInput,
    FlatList,
    ScrollView,
    Dimensions,
    RefreshControl,
} from 'react-native';
import _ from 'ramda';

import { scaleSzie, localize, formatNumberFromCurrency, formatMoney, roundFloatNumber, formatWithMoment } from '@utils';
import {
    Text, ButtonCustom, Dropdown
} from '@components';
import TextInputAmount from './widget/TextInputAmount';
import ItemStaff from './widget/ItemStaff';
import TotalCustom from './widget/TotalCustom';
import styles from "./style";
import { StaffsHeaderTable, StaffsItem, GiftCardItem, TotalItem, HeaderPaymentsReport, ItemPaymentsReport } from "./widget/ItemsSettlement";

const { height } = Dimensions.get('window');

class Layout extends React.Component {

    render() {
        const { } = this.props

        return (
            <View style={{ flex: 1, backgroundColor: "#fff" }} >
                <Text style={[styles.txt_top_title]} >
                    {"Staff income details"}
                </Text>

                {/* --------- Dropdown ---------- */}
                <View style={{
                    height: scaleSzie(35), width: scaleSzie(180),
                    marginLeft: scaleSzie(10), marginTop: scaleSzie(20)
                }} >
                    <Dropdown
                        label={""}
                        data={[{ value: '' }, { value: 'HP-Harmony Account' }, { value: 'HP-Credit Card' },
                        { value: 'Credit Card' }, { value: 'Cash' }, { value: 'Cheque/Bank Transfer' }
                        ]}
                        value={""}
                        onChangeText={(value) => { }}
                        containerStyle={{
                            backgroundColor: '#fff',
                            borderWidth: 2,
                            borderColor: '#CCCCCC',
                            flex: 1,
                            borderRadius: 4
                        }}
                    />
                </View>
                {/* --------- Header Table  ---------- */}
                <View style={{ height: scaleSzie(32), backgroundColor: "#F1F1F1", marginTop: scaleSzie(20) ,flexDirection:"row"}} >

                </View>
                {/* --------- Row Table  ---------- */}
                <View style={{ flex: 1 }} >

                </View>
                {/* --------- Footer Table  ---------- */}
                <View style={{ height: scaleSzie(40), backgroundColor: "#0764B0",}} >


                </View>

            </View>
        );
    }

}

export default Layout;


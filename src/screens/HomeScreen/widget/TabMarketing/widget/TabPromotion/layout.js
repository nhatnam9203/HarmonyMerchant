import React from 'react';
import {
    View,
    Image,
    ScrollView,
    Dimensions
} from 'react-native';

import { scaleSzie } from '../../../../../../utils';
import styles from './style';
import IMAGE from '../../../../../../resources';
import { Button, Text, InputForm } from '../../../../../../components';
import { ItemCalendar, ItemPromo, ItemDropdown, ItemCheckBoxInput } from './widget';


class Layout extends React.Component {

    renderDiscountAccording() {
        return (
            <ItemPromo >
                <View style={{ paddingHorizontal: scaleSzie(10), paddingVertical: scaleSzie(10) }} >
                    <InputForm
                        title="Campaign Name:"
                        subTitle=""
                        placeholder=""
                        // value={bankName}
                        onChangeText={(value) => { }}
                        style={{ marginBottom: scaleSzie(10) }}
                    />
                    <Text style={styles.textNormal} >
                        Campaign Time:
                            </Text>
                    {/* ---- Row ---- */}
                    <View style={{ flexDirection: 'row' }} >
                        <ItemCalendar
                            title="Start Date"
                            placeholder="01/01/19"
                        />
                        <View style={{ width: scaleSzie(50) }} />
                        <ItemCalendar
                            title="End Date"
                            placeholder="01/01/19"

                        />
                    </View>
                    {/* ---- Row ---- */}
                    <View style={{ flexDirection: 'row', marginTop: scaleSzie(2), marginBottom: scaleSzie(20) }} >
                        <ItemDropdown
                            title="From"
                            width={100}
                            placeholder="08:00 AM"
                        />
                        <View style={{ width: scaleSzie(50) }} />
                        <ItemDropdown
                            title="To"
                            width={100}
                            placeholder="08:00 AM"
                        />
                    </View>
                    {/* ---- Row ---- */}
                    <Text style={styles.textNormal} >
                        Promotion form:
                            </Text>
                    {/* ---- Row ---- */}
                    <View style={{ flexDirection: 'row' }} >
                        <ItemCheckBoxInput
                            title="Discount by percent (%)"
                            placeholder="15"
                        />
                        <View style={{ width: scaleSzie(50) }} />
                        <ItemCheckBoxInput
                            title="Discount fixtom amount ($)"
                            placeholder="100"
                        />
                    </View>
                </View>
            </ItemPromo>
        );
    }

    render() {
        return (
            <View style={styles.container} >
                <ScrollView>
                    {this.renderDiscountAccording()}
                </ScrollView>

            </View>
        );
    }
}


export default Layout;


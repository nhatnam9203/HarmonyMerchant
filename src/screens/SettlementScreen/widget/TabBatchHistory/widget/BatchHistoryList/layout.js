import React from 'react';
import {
    View,
    FlatList,
    Image,
    TextInput
} from 'react-native';
import _ from 'ramda';

import { scaleSzie, localize, formatWithMoment } from '@utils';
import {
    Text, Button, Dropdown, ButtonCustom
} from '@components';
import styles from "./style";
import ICON from "@resources";

class Layout extends React.Component {

    renderSearch() {
        const { language } = this.props;
        return (
            <View style={{ height: scaleSzie(35), paddingHorizontal: scaleSzie(12) }} >
                <View style={{ flex: 1, flexDirection: 'row' }} >
                    <View style={{ flex: 1, flexDirection: 'row' }} >
                        <View style={{ width: scaleSzie(70), justifyContent: 'center' }} >
                            <Text style={{ fontSize: scaleSzie(17), color: '#6A6A6A' }} >
                                {localize('Search', language)}
                            </Text>
                        </View>
                        <View style={{ flex: 1, borderColor: '#C5C5C5', borderWidth: 1, borderRadius: scaleSzie(4), flexDirection: 'row' }} >
                            <View style={{ flex: 1, paddingHorizontal: scaleSzie(12) }} >
                                <TextInput
                                    style={{ flex: 1, fontSize: scaleSzie(18) }}
                                    placeholder={localize('Extra Name', language)}
                                // value={keySearch}
                                // onChangeText={(value) => {
                                //     if (value === '') {
                                //         this.props.actions.extra.clearSearchExtra();
                                //     }
                                //     this.updateSearchFilterInfo('keySearch', value)
                                // }}
                                // onSubmitEditing={this.searchExtra}
                                />
                            </View>
                            <Button onPress={this.searchExtra} style={{ width: scaleSzie(35), alignItems: 'center', justifyContent: 'center' }} >
                                <Image source={ICON.search} style={{ width: scaleSzie(20), height: scaleSzie(20) }} />
                            </Button>

                        </View>
                    </View>
                    <View style={{ width: scaleSzie(170), alignItems: 'flex-end' }} >
                        <ButtonCustom
                            width={'90%'}
                            height={35}
                            backgroundColor="#F1F1F1"
                            title={localize('Search', language)}
                            textColor="#6A6A6A"
                            onPress={this.searchExtra}
                            style={{ borderWidth: 1, borderColor: '#C5C5C5' }}
                            styleText={{ fontSize: scaleSzie(15), fontWeight: '500' }}
                        />
                    </View>
                </View>
            </View>
        );
    }

    renderFilter() {
        const { language } = this.props;

        return (
            <View style={{ height: scaleSzie(35), paddingHorizontal: scaleSzie(12) }} >
                <View style={{ flex: 1, flexDirection: 'row' }} >
                    <View style={{ flex: 1, flexDirection: 'row' }} >
                        <View style={{ width: scaleSzie(70), justifyContent: 'center' }} >
                            <Text style={{ fontSize: scaleSzie(17), color: '#6A6A6A' }} >
                                {localize('Filters', language)}
                            </Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row' }} >
                            <View style={{ width: scaleSzie(220) }} >
                                <Dropdown
                                    label={localize('Status', language)}
                                    data={[{ value: '' }, { value: 'Active' }, { value: 'Disable' }]}
                                    // value={status}
                                    // onChangeText={(value) => this.updateSearchFilterInfo('status', value)}
                                    containerStyle={{
                                        backgroundColor: '#F1F1F1',
                                        borderWidth: 1,
                                        borderColor: '#C5C5C5',
                                        flex: 1,
                                        borderRadius: scaleSzie(4)
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                </View>
                {/* ----------- ICON ----------- */}
                <Button onPress={this.refreshSettlement} style={{
                    position: "absolute", top: scaleSzie(3), right: scaleSzie(10),
                    justifyContent: "center"
                }} >
                    <Image source={ICON.share_batch_history}
                        style={{ width: scaleSzie(30), height: scaleSzie(30) }}
                    />
                </Button>

                <Button onPress={this.refreshSettlement} style={{
                    position: "absolute", top: scaleSzie(3), right: scaleSzie(50),
                    justifyContent: "center"
                }} >
                    <Image source={ICON.print_batch_history}
                        style={{ width: scaleSzie(30), height: scaleSzie(30) }}
                    />
                </Button>
            </View>
        );
    }


    render() {
        const { staffSalesDetail, staffName, total, sales, tax, tip } = this.state;

        return (
            <View style={{ flex: 1, backgroundColor: "#fff" }} >
                <View style={{ height: scaleSzie(15) }} />
                {this.renderSearch()}
                <View style={{ height: scaleSzie(8) }} />
                {this.renderFilter()}

                {/* ---------  Table  ---------- */}
                <HeaderTable />
                <View style={{ flex: 1, paddingHorizontal: scaleSzie(10) }} >
                    <FlatList
                        data={[1]}
                        renderItem={({ item, index }) => <RowTable data={item} />}
                        // keyExtractor={(item, index) => `${item.appointmentCode}_${index}`}
                        style={{ flex: 1, borderColor: "#C5C5C5", borderWidth: 1 }}
                    />
                </View>
            </View>
        );
    }

}


const HeaderTable = ({ }) => {
    return (
        <View style={{
            height: scaleSzie(40), marginTop: scaleSzie(20), flexDirection: "row",
            paddingHorizontal: scaleSzie(10)
        }} >
            {/* --------- Batch ID  ---------- */}
            <View style={{ flex: 1, justifyContent: "center", paddingLeft: scaleSzie(10) }} >
                <Text style={styles.txt_header_table} >
                    {`Batch ID`}
                </Text>
            </View>

            {/* --------- Date  ---------- */}
            <View style={{ flex: 1, justifyContent: "center" }} >
                <Text style={styles.txt_header_table} >
                    {`Date`}
                </Text>
            </View>
            {/* --------- Time  ---------- */}
            <View style={{ flex: 1, justifyContent: "center" }} >
                <Text style={styles.txt_header_table} >
                    {`Time`}
                </Text>
            </View>
            {/* --------- Amount  ---------- */}
            <View style={{ flex: 2, justifyContent: "center", alignItems: "flex-end" }} >
                <Text style={styles.txt_header_table} >
                    {`Amount`}
                </Text>
            </View>
            <View style={{ width: scaleSzie(70) }} >

            </View>
        </View>
    );
}

const RowTable = ({ data }) => {
    return (
        <View style={{
            height: scaleSzie(40), backgroundColor: "#F8F8F8",
            flexDirection: "row", marginBottom: 2,
            borderBottomColor: "#C5C5C5", borderBottomWidth: 1
        }} >
            {/* --------- Batch ID  ---------- */}
            <View style={{ flex: 1, justifyContent: "center", paddingLeft: scaleSzie(10) }} >
                <Text numberOfLines={1} style={styles.txt_row_table} >
                    {/* {`${data.name ? data.name : ""}`} */}
                    {`#1096`}
                </Text>
            </View>
            {/* --------- Date  ---------- */}
            <View style={{ flex: 1, justifyContent: "center" }} >
                <Text style={[styles.txt_row_table, {}]} >
                    {/* {`$ ${data.tax ? data.tax : "0.00"}`} */}
                    {`July 31, 2020`}
                </Text>
            </View>
            {/* --------- Time  ---------- */}
            <View style={{ flex: 1, justifyContent: "center" }} >
                <Text style={[styles.txt_row_table, { fontWeight: "600" }]} >
                    {/* {`$ ${data.tip ? data.tip : "0.00"}`} */}
                    {`1:37 AM`}
                </Text>
            </View>
            {/* --------- Amount  ---------- */}
            <View style={{ flex: 2, justifyContent: "center", alignItems: "flex-end" }} >
                <Text style={[styles.txt_row_table, { fontWeight: "800" }]} >
                    {/* {`$ ${data.total ? data.total : "0.00"}`} */}
                    {`$ 3577.00`}
                </Text>
            </View>
            <View style={{ width: scaleSzie(60), justifyContent: "center", alignItems: "center" }} >
                <Image source={ICON.staff_invoice} style={{width:scaleSzie(16),height:scaleSzie(16)}} />
            </View>
        </View>
    );
}

export default Layout;


import React, { useState, useEffect } from 'react';
import {
    View,
    Image,
    Modal,
    Dimensions,
    StyleSheet
} from 'react-native';

import { scaleSize, } from '@utils';
import { Text, Button, GradientButton, Dropdown } from '@components';
import ICON from '@resources';

const { height } = Dimensions.get("window");
const PURCHASE_POINT_DROPDOWN_DATA = [
    { value: "All Points" }, { value: "Store" }, { value: "Website" }, { value: "Phone Call" },
];
const STATUS_DROPDOWN_DATA = [
    { value: "All Status" }, { value: "Canceled" }, { value: "Completed" }, { value: "Pending" },
    { value: "Processing" }, { value: "Shipped" }, { value: "Returned" },
];

const FilterModal = ({ visible, closeFilterModal, applyFilter, setStateFromParent }) => {

    const [purchansePointSelectedFilter, setPurchansePointSelectedFilter] = useState("All Points");
    const [statusSelectedFilter, setStatusSelectedFilter] = useState("All Status");

    setStateFromParent((purchansePointSelectedFilter, statusSelectedFilter) => {
        setPurchansePointSelectedFilter(purchansePointSelectedFilter);
        setStatusSelectedFilter(statusSelectedFilter);
    });

    resetFilter = () => {
        setPurchansePointSelectedFilter("All Points");
        setStatusSelectedFilter("All Status");
    }

    return (
        <Modal
            transparent={true}
            visible={visible}
            animationType={"fade"}
        >
            <View style={{
                flex: 1, backgroundColor: "rgba(0,0,0,0.6)", paddingTop: scaleSize(46),
                alignItems: "flex-end"
            }} >
                {/* ------------------  Fileter Header --------------------*/}
                <View style={{ height: height - scaleSize(46), width: scaleSize(220), backgroundColor: "#fff" }} >
                    <View style={{
                        height: scaleSize(50), paddingHorizontal: scaleSize(10),
                        borderBottomColor: "#EEEEEE", borderBottomWidth: 2, flexDirection: "row", alignItems: "center",
                        justifyContent: "space-between"
                    }} >
                        <Text style={{ color: "#404040", fontSize: scaleSize(16), fontWeight: "600" }} >
                            {`Filters`}
                        </Text>

                        <Button onPress={closeFilterModal} >
                            <Image source={ICON.close_order_filter_modal} />
                        </Button>
                    </View>

                    {/* ------------------  Fileter Content --------------------*/}
                    <View style={{ flex: 1, paddingHorizontal: scaleSize(10) }} >
                        <Text style={styles.txt_tit_dropdown} >
                            {`Purchase Point`}
                        </Text>

                        <Dropdown
                            label={'All Points'}
                            data={PURCHASE_POINT_DROPDOWN_DATA}
                            value={purchansePointSelectedFilter}
                            onChangeText={setPurchansePointSelectedFilter}
                            containerStyle={styles.drodown_container}
                            styleInput={styles.dropdown_input}
                            styleLable={styles.dropdown_label}
                        />

                        <Text style={styles.txt_tit_dropdown} >
                            {`Status`}
                        </Text>

                        <Dropdown
                            label={'All Status'}
                            data={STATUS_DROPDOWN_DATA}
                            value={statusSelectedFilter}
                            onChangeText={setStatusSelectedFilter}
                            containerStyle={styles.drodown_container}
                            styleInput={styles.dropdown_input}
                            styleLable={styles.dropdown_label}
                        />
                    </View>

                    {/* ------------------  Footer Content --------------------*/}
                    <View style={{
                        height: scaleSize(44), flexDirection: "row", paddingHorizontal: scaleSize(10),
                        paddingBottom: scaleSize(12)
                    }} >
                        <View style={{ flex: 1, }} >
                            <GradientButton
                                colors={["#FFFFFF", "#F1F1F1"]}
                                width={"100%"}
                                title={"Reset"}
                                textColor="#6A6A6A"
                                height={32}
                                onPress={resetFilter}
                                style={{ borderWidth: 1, borderColor: '#C5C5C5', borderRadius: scaleSize(4) }}
                                styleText={{ fontSize: scaleSize(12), fontWeight: '600', }}
                            />
                        </View>
                        <View style={{ width: scaleSize(6) }} />
                        <View style={{ flex: 1 }} >
                            <GradientButton
                                colors={["#0764B0", "#065596"]}
                                width={"100%"}
                                title={"Apply"}
                                textColor="#fff"
                                height={32}
                                onPress={applyFilter(purchansePointSelectedFilter, statusSelectedFilter)}
                                style={{ borderWidth: 1, borderColor: '#707070', borderRadius: scaleSize(4) }}
                                styleText={{ fontSize: scaleSize(12), fontWeight: '600', }}
                            />
                        </View>
                    </View>


                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    txt_tit_dropdown: {
        color: "#0764B0",
        fontSize: scaleSize(12),
        fontWeight: "400", marginTop: scaleSize(18)
    },
    drodown_container: {
        height: scaleSize(32),
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#CCCCCC',
        marginTop: scaleSize(12),
    },
    dropdown_input: {
        fontSize: scaleSize(14), color: "#404040"
    },
    dropdown_label: {
        fontSize: scaleSize(14)
    }
});

export default FilterModal;
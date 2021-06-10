import React from 'react';
import {
    View,
    TextInput,
    Image,
    ScrollView,
    Dimensions
} from 'react-native';
import _, { product } from 'ramda';
import LinearGradient from 'react-native-linear-gradient';

import { Button, ButtonCustom, Text, GradientButton, Dropdown } from "@components";
import styles from './style';
import ICON from "@resources";
import { scaleSize, localize, formatWithMoment } from '@utils';

const { width } = Dimensions.get("window");

class Layout extends React.Component {

    render() {
        const { language, orderRetailDetail } = this.props;
        const products = orderRetailDetail?.orderDetails || [];

        return (
            <View style={styles.container} >
                {/* --------- Header ------------ */}
                <View style={styles.header_container} >
                    <View style={styles.txt_order_id_box} >
                        <Text style={styles.txt_order_id} >
                            {'New product  '}
                        </Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "flex-end" }} >
                    </View>
                </View>

                {/* ------------------ Content ------------------- */}
                <View style={{ flex: 1, paddingHorizontal: scaleSize(10), }} >
                    <ScrollView
                        ref={this.scrollRef}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="always"
                    >

                        <View style={{ flexDirection: "row" }} >
                            {/* ------------------ Left Content ------------------- */}
                            <View style={{ flex: 1 }} >
                                <TitleUnderLine
                                    title={"Product details"}
                                    style={{ marginTop: scaleSize(10) }}
                                />

                                <View style={{ flexDirection: "row" }} >
                                    <View style={{ flex: 1 }} >
                                        <InputForm
                                            title='Category'
                                            placeholder='Enter SKU number'
                                        />
                                    </View>
                                    <View style={{ justifyContent: "center" }}>
                                        <GradientButton
                                            colors={["#0764B0", "#065596"]}
                                            width={scaleSize(120)}
                                            title={localize('New category', language)}
                                            textColor="#fff"
                                            height={35}
                                            onPress={this.search}
                                            style={{
                                                borderWidth: 1, borderColor: '#C5C5C5', borderRadius: 1,
                                                marginLeft: scaleSize(12),
                                                justifyContent: "center",
                                            }}
                                            styleText={{ fontSize: scaleSize(12), fontWeight: '600', }}
                                        />
                                    </View>
                                </View>


                                <InputForm
                                    title='Product Name'
                                    placeholder='Enter product name'
                                />

                                <InputForm
                                    title='Description'
                                    placeholder=''
                                    isNotRequired={true}
                                    multiline={true}
                                    styleInputBox={{ height: scaleSize(68), padding: scaleSize(10) }}
                                />

                                <View style={{ flexDirection: "row" }} >
                                    <View style={{ flex: 1 }} >
                                        <InputForm
                                            title='SKU'
                                            placeholder='Enter SKU number'
                                        />
                                    </View>
                                    <View style={{ justifyContent: "center" }}>
                                        <GradientButton
                                            colors={["#FFFFFF", "#F1F1F1"]}
                                            width={scaleSize(120)}
                                            title={localize('Scan SKU', language)}
                                            textColor="#6A6A6A"
                                            height={35}
                                            onPress={this.search}
                                            style={{
                                                borderWidth: 1, borderColor: '#C5C5C5', borderRadius: 1,
                                                marginLeft: scaleSize(12),
                                                justifyContent: "center",
                                            }}
                                            styleText={{ fontSize: scaleSize(12), fontWeight: '600', }}
                                            icon={ICON.scan_icon}
                                            iconStyles={{ marginRight: scaleSize(10) }}
                                        />
                                    </View>
                                </View>

                                <InputForm
                                    title='Price ($)'
                                    placeholder='Enter price'
                                />

                                <InputForm
                                    title='PItems in stock'
                                    placeholder='100'
                                />

                                <View style={{ flexDirection: "row" }} >
                                    <View style={{ flex: 1 }} >
                                        <InputForm
                                            title='Low threshold'
                                            placeholder='10'
                                        />
                                    </View>
                                    <View style={{ width: scaleSize(25) }} />
                                    <View style={{ flex: 1 }} >
                                        <InputForm
                                            title='High threshold'
                                            placeholder='20'
                                        />
                                    </View>
                                </View>

                                {/* --------------- Status ----------------- */}
                                <View style={[{ marginBottom: scaleSize(20) }]} >
                                    <Text style={{ color: "#404040", fontSize: scaleSize(13), fontWeight: "600", marginBottom: scaleSize(8) }} >
                                        {`Status `}
                                        <Text style={{ color: "#FF3B30" }} >
                                            {'*'}
                                        </Text>
                                    </Text>

                                    <View style={[{ height: scaleSize(35), width: scaleSize(130), borderColor: '#CCCCCC', borderWidth: 1 }]} >
                                        <Dropdown
                                            label={''}
                                            data={[{ value: 'Active' }, { value: 'Disable' }]}
                                            // value={this.state.codeAreaPhone}
                                            // onChangeText={this.onChangePhoneCode}
                                            containerStyle={{
                                                flex: 1
                                            }}
                                        />
                                    </View>
                                </View>

                                {/* --------------- Image Upload ----------------- */}
                                <Text style={{ color: "#404040", fontSize: scaleSize(13), fontWeight: "600", marginBottom: scaleSize(12) }} >
                                    {`Image `}
                                </Text>

                                <View style={{
                                    width: scaleSize(130), height: scaleSize(130), backgroundColor: '#F6F6F6',
                                    borderStyle: 'dotted', borderWidth: 1, borderColor: '#DDDDDD',
                                    justifyContent: 'center', alignItems: 'center'
                                }} >
                                    <Image source={ICON.upload_file_icon} style={{ width: scaleSize(40), height: scaleSize(40) }} />
                                    <Text style={{ color: "#404040", fontSize: scaleSize(16), marginTop: scaleSize(12) }} >
                                        {'Upload Image'}
                                    </Text>
                                </View>
                            </View>

                            {/* ------------ Place center ---------------- */}
                            <View style={{ width: scaleSize(30) }} />
                            {/* ------------------ Right Content ------------------- */}
                            <View style={{ flex: 1 }} >
                                <TitleUnderLine
                                    title={"Options"}
                                    style={{ marginTop: scaleSize(10) }}
                                />
                                <SubTitle title={'Color'} />

                                {/* ------------ Color Header  -------- */}
                                <View style={{ flexDirection: 'row', minHeight: scaleSize(40) }} >
                                    <View style={{ flex: 1.5, justifyContent: "center", }} >
                                        <Text style={styles.txtHeader} >
                                            {'Default Value'}
                                        </Text>
                                    </View>
                                    <View style={{ flex: 1.5, justifyContent: "center" }} >
                                        <Text style={styles.txtHeader} >
                                            {'Swatch'}
                                        </Text>
                                    </View>
                                    <View style={{ flex: 2.5, justifyContent: "center" }} >
                                        <Text style={styles.txtHeader} >
                                            {'Color Code'}
                                        </Text>
                                    </View>
                                    <View style={{ flex: 2.5, justifyContent: "center" }} >
                                        <Text style={styles.txtHeader} >
                                            {'Value added ($)'}
                                        </Text>
                                    </View>
                                    <View style={{ flex: 0.8 }} />
                                </View>

                                <ColorItem />
                                <ColorItem />

                                {/* ------------------- Add Option ------------------ */}
                                <View style={{ flexDirection: 'row', marginTop: scaleSize(10), alignItems: "center", marginBottom: scaleSize(20) }} >
                                    <Image source={ICON.add_option_btn} style={{ width: scaleSize(22), height: scaleSize(22) }} />
                                    <Text style={{ color: '#0764B0', fontSize: scaleSize(12), marginLeft: scaleSize(10) }} >
                                        {'Add Option'}
                                    </Text>
                                </View>

                                {/* ----------------- Header Size ---------------- */}
                                <View style={{ flexDirection: 'row', minHeight: scaleSize(40) }} >
                                    <View style={{ flex: 1.5, justifyContent: "center" }} >
                                        <Text style={styles.txtHeader} >
                                            {'Default Value'}
                                        </Text>
                                    </View>
                                    <View style={{ flex: 2.4, justifyContent: "center" }} >
                                        <Text style={styles.txtHeader} >
                                            {'Text Swatch'}
                                        </Text>
                                    </View>
                                    <View style={{ flex: 1.7, justifyContent: "center" }} />
                                    <View style={{ flex: 2.4, justifyContent: "center" }} >
                                        <Text style={styles.txtHeader} >
                                            {'Value added ($)'}
                                        </Text>
                                    </View>
                                    <View style={{ flex: 0.8 }} />
                                </View>

                                <SizeItem />
                                <SizeItem />

                            </View>
                        </View>
                        <View style={{ height: scaleSize(350) }} />
                    </ScrollView>

                    {/* -------------- Footer ------------------ */}
                    <View style={{
                        height: scaleSize(75), width: width, position: "absolute", bottom: 0, flexDirection: "row",
                        paddingHorizontal: scaleSize(45), justifyContent: "space-between"
                    }} >
                        <ButtonCustom
                            width={scaleSize(300)}
                            height={50}
                            backgroundColor="#F1F1F1"
                            title="CANCEL"
                            textColor="#404040"
                            onPress={this.cancelCustomer}
                            style={{ borderWidth: 1, borderColor: '#C5C5C5', borderRadius: 4 }}
                            styleText={{
                                fontSize: scaleSize(20)
                            }}
                        />

                        <ButtonCustom
                            width={scaleSize(300)}
                            height={50}
                            backgroundColor="#0764B0"
                            title="SAVE"
                            textColor="#fff"
                            onPress={this.saveCustomerInfo}
                            style={{ borderWidth: 1, borderColor: '#C5C5C5', borderRadius: 4 }}
                            styleText={{
                                fontSize: scaleSize(20)
                            }}
                        />
                    </View>
                </View>
            </View>
        );
    }
}

const SizeItem = ({ }) => {
    return (
        <View style={{ flexDirection: 'row', minHeight: scaleSize(30), marginBottom: scaleSize(8) }} >
            {/* -------------------  Default Value -------------------- */}
            <View style={{ flex: 1.5, justifyContent: "center" }} >
                <Image source={ICON.inventory_selected_radio_btn} style={{ width: scaleSize(18), height: scaleSize(18) }} />
            </View>
            <View style={{ flex: 2.4, justifyContent: "center" }} >
                <View style={{ flex: 1, paddingRight: scaleSize(20) }} >
                    <View style={{ flex: 1, borderColor: '#CCCCCC', borderWidth: 1, paddingHorizontal: scaleSize(8), justifyContent: 'center' }} >
                        <Text style={[styles.txtHeader, { fontSize: scaleSize(12) }]} >
                            {'M'}
                        </Text>
                    </View>
                </View>
            </View>
            {/* -------------------  Swatch -------------------- */}
            <View style={{ flex: 1.7, }} />

            {/* -------------------  Color Code -------------------- */}
            <View style={{ flex: 2.4, }} >
                <View style={{ flex: 1, paddingRight: scaleSize(20) }} >
                    <View style={{ flex: 1, borderColor: '#CCCCCC', borderWidth: 1, paddingHorizontal: scaleSize(8), justifyContent: 'center' }} >
                        <Text style={[styles.txtHeader, { fontSize: scaleSize(12) }]} >
                            {'0.00'}
                        </Text>
                    </View>
                </View>
            </View>
            {/* -------------------  Value added ($) -------------------- */}
            <View style={{ flex: 0.6, justifyContent: "center", alignItems: "center" }} >
                <Image source={ICON.remove_color_row} style={{ width: scaleSize(20), height: scaleSize(20) }} />
            </View>
        </View>
    );
}

const ColorItem = ({ }) => {
    return (
        <View style={{ flexDirection: 'row', minHeight: scaleSize(30), marginBottom: scaleSize(8) }} >
            {/* -------------------  Default Value -------------------- */}
            <View style={{ flex: 1.5, justifyContent: "center" }} >
                <Image source={ICON.inventory_selected_radio_btn} style={{ width: scaleSize(18), height: scaleSize(18) }} />
            </View>
            <View style={{ flex: 1.5, justifyContent: "center" }} >
                <View style={{ height: scaleSize(30), width: scaleSize(30), borderColor: '#CCCCCC', borderWidth: 1, padding: scaleSize(2) }} >
                    <View style={{ flex: 1, backgroundColor: '#0764B0' }} />
                </View>
            </View>
            {/* -------------------  Swatch -------------------- */}
            <View style={{ flex: 2.7, }} >
                <View style={{ flex: 1, paddingRight: scaleSize(20) }} >
                    <View style={{ flex: 1, borderColor: '#CCCCCC', borderWidth: 1, paddingHorizontal: scaleSize(8), justifyContent: 'center' }} >
                        <Text style={[styles.txtHeader, { fontSize: scaleSize(12) }]} >
                            {'#0764b0'}
                        </Text>
                    </View>
                </View>
            </View>
            {/* -------------------  Color Code -------------------- */}
            <View style={{ flex: 2.7, }} >
                <View style={{ flex: 1, paddingRight: scaleSize(20) }} >
                    <View style={{ flex: 1, borderColor: '#CCCCCC', borderWidth: 1, paddingHorizontal: scaleSize(8), justifyContent: 'center' }} >
                        <Text style={[styles.txtHeader, { fontSize: scaleSize(12) }]} >
                            {'-5.00'}
                        </Text>
                    </View>
                </View>
            </View>
            {/* -------------------  Value added ($) -------------------- */}
            <View style={{ flex: 0.6, justifyContent: "center", alignItems: "center" }} >
                <Image source={ICON.remove_color_row} style={{ width: scaleSize(20), height: scaleSize(20) }} />
            </View>
        </View>
    );
}

const SubTitle = ({ title }) => {
    return (
        <Text style={{ color: "#404040", fontSize: scaleSize(13), fontWeight: "600", marginBottom: scaleSize(8) }} >
            {`${title} `}
            <Text style={{ color: "#FF3B30" }} >
                {'*'}
            </Text>
        </Text>
    );
}

const TitleUnderLine = ({ title, style }) => {
    return (
        <View style={[{ borderBottomColor: "#DDDDDD", borderBottomWidth: 1, marginBottom: scaleSize(12) }, style]} >
            <Text style={{ color: "#0764B0", fontSize: scaleSize(12), fontWeight: "600", marginBottom: scaleSize(8) }} >
                {`${title}`}
            </Text>
        </View>
    );
}

const InputForm = ({ title, placeholder, isNotRequired, multiline, styles, styleInputBox }) => {


    return (
        <View style={[{ marginBottom: scaleSize(20) }, styles]} >
            <Text style={{ color: "#404040", fontSize: scaleSize(13), fontWeight: "600", marginBottom: scaleSize(8) }} >
                {`${title} `}
                {
                    !isNotRequired && <Text style={{ color: "#FF3B30" }} >
                        {'*'}
                    </Text>
                }

            </Text>

            <View style={[{ height: scaleSize(35), borderColor: '#CCCCCC', borderWidth: 1, paddingHorizontal: scaleSize(10) }, styleInputBox]} >
                <TextInput
                    style={{ flex: 1, fontSize: scaleSize(11) }}
                    placeholder={placeholder}
                    placeholderTextColor="#C5C5C5"
                    multiline={multiline}
                />
            </View>
        </View>
    );
}



export default Layout;


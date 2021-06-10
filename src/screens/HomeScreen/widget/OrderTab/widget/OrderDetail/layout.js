import React from 'react';
import {
    View,
    TextInput,
    Image,
    ScrollView,

} from 'react-native';
import _, { product } from 'ramda';
import LinearGradient from 'react-native-linear-gradient';

import { Button, ButtonCustom, Text, GradientButton } from "@components";
import styles from './style';
import ICON from "@resources";
import { scaleSize, localize, formatWithMoment } from '@utils';

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
                            {'Order  '}
                            <Text style={{ color: "#0764B0" }} >
                                {'#000040'}
                            </Text>
                        </Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "flex-end" }} >
                        <GradientButton
                            colors={["#FFFFFF", "#F1F1F1"]}
                            width={scaleSize(100)}
                            title={localize('Cancel', language)}
                            textColor="#404040"
                            height={28}
                            // onPress={this.handleNewOrder}
                            style={{ borderWidth: 1, borderColor: '#CCCCCC', borderRadius: scaleSize(2), }}
                            styleText={{ fontSize: scaleSize(12), fontWeight: '600', }}
                        />
                        <GradientButton
                            colors={["#0764B0", "#065596"]}
                            width={scaleSize(100)}
                            title={localize('Ship', language)}
                            textColor="#fff"
                            height={28}
                            // onPress={this.handleNewOrder}
                            style={{ borderWidth: 1, borderColor: '#0764B0', borderRadius: scaleSize(2), marginHorizontal: scaleSize(10) }}
                            styleText={{ fontSize: scaleSize(12), fontWeight: '600', }}
                        />

                        <Button onPress={this.props.backOrderHome} >
                            <Image source={ICON.order_detail_back} style={{ width: scaleSize(28), height: scaleSize(28) }} />
                        </Button>
                    </View>
                </View>

                {/* ------------------ Content ------------------- */}
                <View style={{ flex: 1, paddingHorizontal: scaleSize(10), }} >
                    <ScrollView
                        ref={this.scrollRef}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="always"
                    >
                        {/* ------------------- Order Status --------------- */}
                        <View style={styles.status_box} >
                            <Text style={styles.txt_status} >
                                {`${orderRetailDetail?.status}`}
                            </Text>
                        </View>

                        {/* ------------------- Order & Account Information --------------- */}
                        <TitleUnderLine
                            title={"Order & Account Information"}
                        />

                        {/* ------------------- Two Table --------------- */}
                        <TwoColumTemplate
                            leftTitle="Order Information"
                            leftContent={() => <View  >
                                <KeyValueItem
                                    title={"ID"}
                                    value={`#${orderRetailDetail?.orderId}`}
                                    style={{ marginBottom: scaleSize(10) }}
                                />
                                <KeyValueItem
                                    title={"Purchase Point"}
                                    value={`${orderRetailDetail?.purchasePoint}`}
                                    style={{ marginBottom: scaleSize(10) }}
                                />
                                <KeyValueItem
                                    title={"Order Date"}
                                    value={formatWithMoment(product?.createdDate, "MMM DD, YYYY HH:mm A")}
                                    style={{ marginBottom: scaleSize(10) }}
                                />
                                <KeyValueItem
                                    title={"Order status"}
                                    value={`${orderRetailDetail?.status}`}
                                />
                            </View>}
                            rightTitle="Account Information"
                            rightContent={() => <View  >
                                <KeyValueItem
                                    title={"Customer Name"}
                                    value={`${orderRetailDetail?.billCustomer?.firstName} ${orderRetailDetail?.billCustomer?.lastName}`}
                                    style={{ marginBottom: scaleSize(10) }}
                                    valueStyle={{ color: "#0764B0", fontWeight: "600" }}
                                />
                                <KeyValueItem
                                    title={"Phone number"}
                                    value={`${orderRetailDetail?.billCustomer?.phone}`}
                                    style={{ marginBottom: scaleSize(10) }}
                                />
                                <KeyValueItem
                                    title={"Email"}
                                    value={`${orderRetailDetail?.billCustomer?.email || ""}`}
                                    style={{ marginBottom: scaleSize(10) }}
                                />
                                <KeyValueItem
                                    title={"Address"}
                                    value={`${orderRetailDetail?.billCustomer?.address}`}
                                />
                            </View>}
                        />

                        {/* ------------------- Items ordered --------------- */}
                        <TitleUnderLine
                            title={"Items ordered"}
                            style={{ marginTop: scaleSize(28) }}
                        />

                        {/* ------------------ Header Product List ---------------------- */}
                        <View style={styles.header_product_list} >
                            <View style={{ flex: 4 }} >
                                <Text style={styles.txt_header_product_list} >
                                    {"Product"}
                                </Text>
                            </View>
                            <View style={{ flex: 1.5, }} >
                                <Text style={styles.txt_header_product_list} >
                                    {"Price"}
                                </Text>
                            </View>
                            <View style={{ flex: 1, }} >
                                <Text style={styles.txt_header_product_list} >
                                    {"Qty"}
                                </Text>
                            </View>
                            <View style={{ flex: 1.5, alignItems: "flex-end" }} >
                                <Text style={styles.txt_header_product_list} >
                                    {"Subtotal"}
                                </Text>
                            </View>
                            <View style={{ flex: 1.5, alignItems: "flex-end" }} >
                                <Text style={styles.txt_header_product_list} >
                                    {"Tax"}
                                </Text>
                            </View>
                            <View style={{ flex: 1.5, alignItems: "flex-end", }} >
                                <Text style={styles.txt_header_product_list} >
                                    {"Discount "}
                                </Text>
                            </View>
                            <View style={{ flex: 1.5, alignItems: "flex-end" }} >
                                <Text style={styles.txt_header_product_list} >
                                    {"Total"}
                                </Text>
                            </View>
                        </View>

                        {/* ------------------ Item Product List ---------------------- */}
                        {
                            products.map((product, index) => <View key={`${product?.orderId}_${index}`} style={styles.item_row_product_list} >
                                <View style={{ flex: 4, flexDirection: "row", }} >
                                    {/* ------------------ Product's Image ---------------------- */}
                                    <View style={{ width: scaleSize(38), justifyContent: "center" }} >
                                        <Image
                                            source={{ uri: product?.fileURL }}
                                            style={{ width: scaleSize(38), height: scaleSize(38) }}
                                        />
                                    </View>
                                    {/* ------------------ Product's Name ---------------------- */}
                                    <View style={{ flex: 1, justifyContent: "center", marginLeft: scaleSize(10) }} >
                                        <Text style={styles.txt_product_name} >
                                            {`${product?.productName}`}
                                        </Text>
                                        {/* <Text style={styles.txt_product_name} >
                                            {"SKU: WS08-XS-Blue"}
                                        </Text> */}
                                    </View>
                                </View>
                                <View style={{ flex: 1.5, justifyContent: "center" }} >
                                    <Text style={styles.txt_row_product_list} >
                                        {`$ ${product?.price || '0.00'}`}
                                    </Text>
                                </View>
                                <View style={{ flex: 1, justifyContent: "center" }} >
                                    <Text style={styles.txt_row_product_list} >
                                        {product?.quantity}
                                    </Text>
                                </View>
                                <View style={{ flex: 1.5, alignItems: "flex-end", justifyContent: "center" }} >
                                    <Text style={styles.txt_row_product_list} >
                                        {`$ ${product?.subTotal || '0.00'}`}
                                    </Text>
                                </View>
                                <View style={{ flex: 1.5, alignItems: "flex-end", justifyContent: "center" }} >
                                    <Text style={styles.txt_row_product_list} >
                                        {`$ ${product?.tax || '0.00'}`}
                                    </Text>
                                </View>
                                <View style={{ flex: 1.5, alignItems: "flex-end", justifyContent: "center" }} >
                                    <Text style={styles.txt_row_product_list} >
                                        {`$ ${product?.discount || '0.00'}`}
                                    </Text>
                                </View>
                                <View style={{ flex: 1.5, alignItems: "flex-end", justifyContent: "center" }} >
                                    <Text style={[styles.txt_row_product_list, { color: "#0764B0", fontWeight: "600" }]} >
                                        {`$ ${product?.total || '0.00'}`}
                                    </Text>
                                </View>
                            </View>)
                        }


                        {/* ------------------- Address Information --------------- */}
                        <TitleUnderLine
                            title={"Address Information"}
                            style={{ marginTop: scaleSize(28) }}
                        />
                        {/* ------------------- Two Table --------------- */}
                        <TwoColumTemplate
                            leftTitle="Billing Address"
                            leftContent={() => <View  >
                                <Text style={[styles.txt_key_value_item, { marginBottom: 4 }]} >
                                    {`${orderRetailDetail?.billCustomer?.firstName || ""} ${orderRetailDetail?.billCustomer?.lastName || ""}`}
                                </Text>
                                <Text style={[styles.txt_key_value_item, { marginBottom: 4 }]} >
                                    {`${orderRetailDetail?.billCustomer?.address || ""}`}
                                </Text>
                                <Text style={styles.txt_key_value_item} >
                                    {`T: ${orderRetailDetail?.billCustomer?.phone || ""}`}
                                </Text>
                            </View>}
                            icon={ICON.edit_order_dettail}
                            rightTitle="Shipping Address"
                            rightContent={() => <View  >
                                <Text style={[styles.txt_key_value_item, { marginBottom: 4 }]} >
                                    {`${orderRetailDetail?.shipCustomer?.firstName || ""} ${orderRetailDetail?.shipCustomer?.lastName || ""}`}
                                </Text>
                                <Text style={[styles.txt_key_value_item, { marginBottom: 4 }]} >
                                    {`${orderRetailDetail?.shipCustomer?.address || ""}`}
                                </Text>
                                <Text style={styles.txt_key_value_item} >
                                    {`T: ${orderRetailDetail?.shipCustomer?.phone || ""}`}
                                </Text>
                            </View>}
                        />

                        {/* ------------------- Payment & Shipping Method --------------- */}
                        <TitleUnderLine
                            title={"Payment & Shipping Method"}
                            style={{ marginTop: scaleSize(28) }}
                        />
                        {/* ------------------- Two Table --------------- */}
                        <TwoColumTemplate
                            leftTitle="Payment Information"
                            leftContent={() => <View  >
                                <Text style={[styles.txt_key_value_item,]} >
                                    {"Check / Money order"}
                                </Text>
                            </View>}
                            rightTitle="Shipping & Handling Information"
                            rightContent={() => <View  >
                                <Text style={[styles.txt_key_value_item, { fontWeight: "bold" }]} >
                                    {"Flat Rate - Fixed "}
                                    <Text style={{ fontWeight: "500" }} >
                                        {"$5.00"}
                                    </Text>
                                </Text>
                            </View>}
                        />
                        {/* ------------------- Order Total --------------- */}
                        <TitleUnderLine
                            title={"Order Total"}
                            style={{ marginTop: scaleSize(28) }}
                        />

                        {/* ------------------- Two Table --------------- */}
                        <TwoColumTemplate
                            leftTitle="Order Total"
                            leftContentStyle={{ padding: 0 }}
                            leftContent={() => <View   >
                                {/* -------------- Brown Box -------------- */}
                                <View style={{ padding: scaleSize(10), }} >
                                    <KeyValueItem
                                        title={"Subtotal"}
                                        value={`$${orderRetailDetail?.subTotal || "0.00"}`}
                                        style={{ marginBottom: scaleSize(10) }}
                                    />
                                    <KeyValueItem
                                        title={"Shipping & Handling	"}
                                        value={`$${orderRetailDetail?.subTotal || "0.00"}`}
                                        style={{ marginBottom: scaleSize(10) }}
                                    />
                                    <KeyValueItem
                                        title={"Tax"}
                                        value={`$${orderRetailDetail?.tax || "0.00"}`}
                                        style={{ marginBottom: scaleSize(10) }}
                                    />
                                    <KeyValueItem
                                        title={"Discount"}
                                        value={`$${orderRetailDetail?.discount || "0.00"}`}
                                    />
                                </View>
                                {/* -------------- White Box -------------- */}
                                <View style={{ backgroundColor: "#fff", padding: scaleSize(10) }} >
                                    <KeyValueItem
                                        title={"Grand Total	"}
                                        value={"#000040"}
                                        style={{ marginBottom: scaleSize(10) }}
                                        titleStyle={styles.txt_total}
                                        valueStyle={styles.txt_total}
                                    />
                                    <KeyValueItem
                                        title={"Total Paid"}
                                        value={"$ 110.00"}
                                        style={{ marginBottom: scaleSize(10) }}
                                        titleStyle={styles.txt_total}
                                        valueStyle={styles.txt_total}
                                    />
                                    <KeyValueItem
                                        title={"Total Returned"}
                                        value={"$ 0.00"}
                                        style={{ marginBottom: scaleSize(10) }}
                                        titleStyle={styles.txt_total}
                                        valueStyle={styles.txt_total}
                                    />
                                    <KeyValueItem
                                        title={"Total Due	"}
                                        value={"$ 110.00"}
                                        style={{ marginBottom: scaleSize(10) }}
                                        titleStyle={styles.txt_total}
                                        valueStyle={styles.txt_total}
                                    />
                                </View>

                            </View>}
                            rightTitle="Invoice"
                            rightContentStyle={{ padding: 0, backgroundColor: "#fff" }}
                            rightContent={() => <View  >
                                <View style={{ padding: scaleSize(10), backgroundColor: "#F6F6F6", }} >
                                    <KeyValueItem
                                        title={"Invoice ID"}
                                        value={"#IN00012"}
                                        style={{ marginBottom: scaleSize(10) }}
                                        valueStyle={{ color: "#0764B0", fontWeight: "600" }}
                                    />
                                    <KeyValueItem
                                        title={"Invoice Date"}
                                        value={"Aug 6, 2020 11:07:11 AM"}
                                        style={{ marginBottom: scaleSize(10) }}
                                    />
                                    <KeyValueItem
                                        title={"Status"}
                                        value={"Paid"}
                                    />
                                </View>
                                {/* -------------- Note TXT ------------ */}
                                <View style={{ backgroundColor: "#fff", marginTop: scaleSize(12) }} >
                                    <Text style={{ color: "#404040", fontSize: scaleSize(16), fontWeight: "600" }} >
                                        {"Notes for this Order"}
                                    </Text>
                                    <Text style={{ color: "#404040", fontSize: scaleSize(14), fontWeight: "400", marginTop: scaleSize(10) }} >
                                        {"Comment text"}
                                    </Text>
                                </View>

                                {/* -------------- Note BOX ------------ */}
                                <View style={{ minHeight: scaleSize(60), paddingRight: 2, marginTop: scaleSize(8) }}  >
                                    <View style={{ flex: 1, borderColor: "#DDDDDD", borderWidth: 1, borderRadius: 2, padding: scaleSize(10) }} >
                                        <TextInput
                                            style={{ flex: 1, fontSize: scaleSize(12), color: "#404040", textAlign: "left" }}
                                            multiline={true}
                                            onFocus={this.handleScrollToNum(5000)}
                                            value={orderRetailDetail?.note}
                                        />
                                    </View>
                                </View>

                                {/* --------------Submit Note ------------ */}
                                <GradientButton
                                    colors={["#0764B0", "#065596"]}
                                    width={scaleSize(120)}
                                    title={localize('Submit Note', language)}
                                    textColor="#fff"
                                    height={32}
                                    // onPress={this.handleNewOrder}
                                    style={{
                                        borderWidth: 1, borderColor: '#0764B0', borderRadius: scaleSize(2),
                                        marginHorizontal: scaleSize(10), marginTop: scaleSize(14),
                                        alignSelf: "flex-end"
                                    }}
                                    styleText={{ fontSize: scaleSize(12), fontWeight: '600', }}
                                />


                            </View>}
                        />

                        <View style={{ height: scaleSize(350) }} />
                    </ScrollView>
                </View>
            </View>
        );
    }
}

const TitleUnderLine = ({ title, style }) => {
    return (
        <View style={[{ borderBottomColor: "#DDDDDD", borderBottomWidth: 1, marginBottom: scaleSize(12) }, style]} >
            <Text style={{ color: "#0764B0", fontSize: scaleSize(14), fontWeight: "600", marginBottom: scaleSize(8) }} >
                {`${title}`}
            </Text>
        </View>
    );
}

const TwoColumTemplate = ({ leftTitle, leftContent, rightTitle, rightContent, icon, leftContentStyle, rightContentStyle }) => {

    return (
        <View style={{ flexDirection: "row", }} >
            <View style={{ flex: 1 }} >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={styles.txt_title_two_colum} >
                        {`${leftTitle}`}
                    </Text>
                    {icon && <Image source={icon} style={{ width: scaleSize(16), height: scaleSize(16), marginLeft: scaleSize(8) }} />}
                </View>
                <View style={[styles.content_two_colum, leftContentStyle]} >
                    {leftContent()}
                </View>
            </View>
            <View style={{ width: scaleSize(35) }} />
            <View style={{ flex: 1 }} >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={styles.txt_title_two_colum} >
                        {`${rightTitle}`}
                    </Text>
                    {icon && <Image source={icon} style={{ width: scaleSize(16), height: scaleSize(16), marginLeft: scaleSize(8) }} />}
                </View>
                <View style={[styles.content_two_colum, rightContentStyle]} >
                    {rightContent()}
                </View>
            </View>
        </View>
    );
}

const KeyValueItem = ({ title, value, style, titleStyle, valueStyle }) => {
    return (
        <View style={[{ flexDirection: "row", justifyContent: "space-between" }, style]} >
            <Text style={[styles.txt_key_value_item, titleStyle]} >
                {title}
            </Text>
            <Text style={[styles.txt_key_value_item, valueStyle]} >
                {value}
            </Text>
        </View>
    );
}

export default Layout;


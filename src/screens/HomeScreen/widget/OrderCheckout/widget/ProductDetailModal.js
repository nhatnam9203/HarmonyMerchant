import React, { useState, forwardRef, useImperativeHandle } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity
} from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import _ from 'ramda';

import { Button, PopupParent, GradientButton, Loading } from '@components';
import connectRedux from '@redux/ConnectRedux';
import { scaleSize, } from '@utils';


function ProductDetailModal({ onRequestClose, addProductInfoToBasket,visibleProductDetailModalRetail }, ref) {

    const [selectedColor, setSelectedColor] = useState("#EADED5");
    const [selectedSize, setSelectedSize] = useState("S");
    const [amount, setAmount] = useState(1);
    const [productInfo, setProductInfo] = useState({});


    handleSelectedColor = (color) => () => {
        setSelectedColor(color);
    }

    handleSelectedSize = (size) => () => {
        setSelectedSize(size);
    }

    handleAmountDescending = () => {
        if (amount > 1) {
            setAmount(prevAmount => prevAmount - 1);
        }

    }

    handleAmountAscending = () => {
        setAmount(prevAmount => prevAmount + 1);
    }

    handleAddToBasket = () => {
        addProductInfoToBasket(productInfo,selectedColor, selectedSize, amount);
    }

    useImperativeHandle(ref, () => ({
        setStateFromParent: (productInfo) => {
            setProductInfo(productInfo)
        }
    }))

    return (
        <PopupParent
            title={"Product Detail"}
            visible={visibleProductDetailModalRetail}
            onRequestClose={onRequestClose}
            width={520}
            height={45}
            styleTitle={{ fontSize: scaleSize(17), fontWeight: "600" }}
            iconCloseStyle={{ width: scaleSize(10), height: scaleSize(10) }}
            btnCloseStyle={{ width: scaleSize(24), height: scaleSize(24), borderRadius: scaleSize(12) }}
        >
            <View style={{
                height: scaleSize(400), backgroundColor: '#fff',
                borderBottomLeftRadius: scaleSize(15), borderBottomRightRadius: scaleSize(15),
            }} >
                {/* -------------- Content ------------- */}
                <View style={{ flex: 1, flexDirection: "row", padding: scaleSize(12) }} >
                    {/* -------------- Product Image ------------- */}
                    <View style={{ width: scaleSize(160) }} >
                        <View style={{ height: scaleSize(160), backgroundColor: "rgba(0,0,0,0.02)", justifyContent: "center", alignItems: "center" }} >
                            <Image
                                // source={{ uri: "https://cdn.shopify.com/s/files/1/0210/9734/products/nayked-apparel-men-men-s-ridiculously-soft-long-sleeve-100-cotton-t-shirt-small-heather-grey-na0136-30589738375_1178x1390_crop_center.jpg?v=1607373961" }}
                                source={{ uri: productInfo?.imageUrl }}
                                style={{
                                    width: scaleSize(150), height: scaleSize(150)
                                }}
                            />
                        </View>
                    </View>

                    {/* -------------- Product Information ------------- */}
                    <View style={{ flex: 1, marginLeft: scaleSize(16) }} >
                        {/* ----------- Title & Price -----------*/}
                        <View style={{
                            height: scaleSize(75), paddingBottom: scaleSize(10),
                            borderBottomColor: "#DDDDDD", borderBottomWidth: 1,
                            justifyContent: "space-between"
                        }} >
                            <Text numberOfLines={2} style={{ color: "#0764B0", fontSize: scaleSize(16), fontWeight: "600" }} >
                                {`${productInfo?.name}`}
                            </Text>

                            <Text style={{ color: "#404040", fontSize: scaleSize(15), fontWeight: "600" }} >
                                {`$${productInfo?.price}`}
                            </Text>
                        </View>

                        {/* ----------- Select Color -----------*/}
                        <Text numberOfLines={2} style={{ color: "#404040", fontSize: scaleSize(13), fontWeight: "400", marginTop: scaleSize(14) }} >
                            {`Select Color`}
                        </Text>

                        {/* ---------- Color Boxs ------------- */}
                        <View style={{ flexDirection: "row", marginTop: scaleSize(12) }} >
                            {
                                ["#EADED5", "#CCE2EF", "#E0C0E4"].map((color, index) => <ColorBox
                                    key={`${color}_${index}`}
                                    backgroundColor={color}
                                    onPress={handleSelectedColor(color)}
                                    selectedColor={selectedColor}
                                />)
                            }
                        </View>

                        {/* ----------- Select Size -----------*/}
                        <Text numberOfLines={2} style={{ color: "#404040", fontSize: scaleSize(13), fontWeight: "400", marginTop: scaleSize(14) }} >
                            {`Select Size`}
                        </Text>

                        {/* ---------- Size Boxs ------------- */}
                        <View style={{ flexDirection: "row", marginTop: scaleSize(12) }} >
                            {
                                ["S", "M", "L", "XL", "XXl", "3XL"].map((size, index) => <SizeBox
                                    key={`${size}_${index}`}
                                    size={size}
                                    onPress={handleSelectedSize(size)}
                                    selectedSize={selectedSize}
                                />)
                            }
                        </View>

                        {/* ----------- Amount -----------*/}
                        <Text numberOfLines={2} style={{ color: "#404040", fontSize: scaleSize(13), fontWeight: "400", marginTop: scaleSize(14) }} >
                            {`Amount`}
                        </Text>
                        <View style={{ flexDirection: "row", marginTop: scaleSize(12) }} >
                            <OperatorBox
                                operator={"-"}
                                onPress={handleAmountDescending}
                            />
                            <View style={[{
                                width: scaleSize(48), height: scaleSize(32), borderWidth: 2, borderColor: "#CCCCCC",
                                justifyContent: "center", alignItems: "center", marginRight: scaleSize(8), backgroundColor: "#FAFAFA"
                            },]} >
                                <Text style={{ color: "#404040", fontSize: scaleSize(14) }} >
                                    {`${amount}`}
                                </Text>
                            </View>
                            <OperatorBox
                                operator={"+"}
                                onPress={handleAmountAscending}
                            />
                        </View>

                    </View>
                </View>
                {/* -------------- Footer ------------- */}
                <View style={{
                    height: scaleSize(65), borderTopColor: "#EEEEEE", borderTopWidth: 2,
                    justifyContent: "center", alignItems: "center"
                }} >
                    <GradientButton
                        colors={["#0764B0", "#065596"]}
                        width={scaleSize(110)}
                        title={'Add To Basket'}
                        textColor="#fff"
                        height={34}
                        onPress={handleAddToBasket}
                        style={{ borderWidth: 1, borderColor: '#0764B0', borderRadius: scaleSize(3) }}
                        styleText={{ fontSize: scaleSize(12), fontWeight: '500', }}
                    />
                </View>
            </View>
            <Loading />
        </PopupParent>
    );
}

const ColorBox = ({ backgroundColor, onPress, selectedColor }) => {
    const tempBorder = backgroundColor === selectedColor ? { borderColor: "#0764B0", borderWidth: scaleSize(3) } : {};

    return (
        <Button onPress={onPress} style={[{ width: scaleSize(36), height: scaleSize(36), backgroundColor, marginRight: scaleSize(8) }, tempBorder]} />
    );
}

const SizeBox = ({ size, onPress, selectedSize }) => {
    const tempBorder = size === selectedSize ? { borderColor: "#0764B0", borderWidth: scaleSize(3) } : {};

    return (
        <Button onPress={onPress} style={[{
            width: scaleSize(42), height: scaleSize(30), marginRight: scaleSize(8),
            justifyContent: "center", alignItems: "center", borderColor: "#CCCCCC", borderWidth: 2
        }, tempBorder]} >
            <Text style={{ color: "#404040", fontSize: scaleSize(13), fontWeight: "400", }} >
                {size}
            </Text>
        </Button>
    );
}

const OperatorBox = ({ operator, onPress }) => {

    return (
        <TouchableOpacity onPress={onPress} style={[{
            width: scaleSize(32), height: scaleSize(32), borderWidth: 2, borderColor: "#0764B0",
            justifyContent: "center", alignItems: "center", marginRight: scaleSize(8)
        },]} >
            <Text style={{ color: "#404040", fontSize: scaleSize(12) }} >
                {`${operator}`}
            </Text>
        </TouchableOpacity>
    );
}

export default ProductDetailModal = forwardRef(ProductDetailModal);


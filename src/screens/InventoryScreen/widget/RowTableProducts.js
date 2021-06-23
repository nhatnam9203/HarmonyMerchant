import React from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import FastImage from 'react-native-fast-image';

import { Button, } from '@components';
import { ScaleSzie } from '@utils';
import IMAGE from '@resources';

class RowTableProducts extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isArchive: true,
            isCheck: false
        }
    }

    handleArchirveStaff = () => {
        this.setState({
            isArchive: false
        })
    }

    handleRestoreStaff = () => {
        this.setState({
            isArchive: true
        })
    }

    selectCheckBox = () => {
        this.setState(prevState => ({ isCheck: !prevState.isCheck }), () => {
            if (!this.state.isCheck) {
                this.props.unSelectAll();
            }
        })
    }

    setCheckBoxFromParent = (isSelect) => {
        this.setState({ isCheck: isSelect })
    }

    render() {
        const { product, nameCategory, showDetailProduct, move, moveEnd } = this.props;
        const { isCheck } = this.state;
        const temptIconCheckbox = isCheck ? IMAGE.checkBox : IMAGE.checkBoxEmpty;
        const { minThreshold, quantity, needToorDer } = product;
        const temptTextColor = quantity < needToorDer || quantity < minThreshold ? { color: '#FF3B30' } : { color: '#6A6A6A' };
        return (
            <TouchableOpacity
                onLongPress={move}
                onPressOut={moveEnd}
                onPress={() => showDetailProduct(product)} style={styles.tableHeader} >
                {/* ----- 1 ------ */}
                <View style={{
                    flex: 1, flexDirection: 'row',
                }} >
                    <View style={[{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingLeft: ScaleSzie(12)
                    }]} >
                        <Button onPress={this.selectCheckBox} style={{ marginRight: ScaleSzie(12) }} >
                            <Image source={temptIconCheckbox}
                            />
                        </Button>
                        <View style={{ justifyContent: 'center', marginRight: ScaleSzie(8) }} >
                            {
                                product.imageUrl ? <FastImage
                                    style={{ width: ScaleSzie(30), height: ScaleSzie(30) }}
                                    source={{
                                        uri: product.imageUrl,
                                        priority: FastImage.priority.low,
                                        cache: FastImage.cacheControl.immutable
                                    }}
                                /> : <Image source={IMAGE.product_holder} style={{ width: ScaleSzie(30), height: ScaleSzie(30) }} />
                            }
                        </View>
                        <View style={{ flex: 1, paddingRight: ScaleSzie(6) }} >
                            <Text numberOfLines={3} style={[styles.textTableHeader, temptTextColor]} >
                                {product.name}
                            </Text>
                        </View>

                    </View>
                    <View style={{ width: 1, paddingVertical: ScaleSzie(3) }} >
                        <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                    </View>
                </View>
                {/* ----- 2 ----- */}
                <View style={{
                    width: ScaleSzie(140), flexDirection: 'row',
                }} >

                    <View style={{ flex: 1, justifyContent: 'center', paddingLeft: ScaleSzie(10) }} >
                        <Text style={[styles.textTableHeader, temptTextColor]} >
                            {product.sku}
                        </Text>
                    </View>
                    <View style={{ width: 1, paddingVertical: ScaleSzie(3) }} >
                        <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                    </View>
                </View>
                {/* ----- 3 ----- */}
                <View style={{
                    width: ScaleSzie(140), flexDirection: 'row',
                }} >
                    <View style={{ flex: 1, justifyContent: 'center', paddingLeft: ScaleSzie(10) }} >
                        <Text style={[styles.textTableHeader, temptTextColor]} >
                            {nameCategory}
                        </Text>
                    </View>
                    <View style={{ width: 1, paddingVertical: ScaleSzie(3) }} >
                        <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                    </View>
                </View>
                {/* ----- 3 ----- */}
                <View style={{
                    width: ScaleSzie(140), flexDirection: 'row',
                }} >
                    <View style={{ flex: 1, justifyContent: 'center', paddingLeft: ScaleSzie(10) }} >
                        <Text style={[styles.textTableHeader, temptTextColor]} >
                            {product.quantity}
                        </Text>
                    </View>
                    <View style={{ width: 1, paddingVertical: ScaleSzie(3) }} >
                        <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                    </View>
                </View>
                {/* ----- 4 ------ */}

                {/* ----- 3 ----- */}
                <View style={{
                    width: ScaleSzie(140), flexDirection: 'row',
                }} >
                    <View style={{ flex: 1, justifyContent: 'center', paddingLeft: ScaleSzie(10) }} >
                        <Text style={[styles.textTableHeader, temptTextColor]} >
                            {product.needToorDer}
                        </Text>
                    </View>
                    <View style={{ width: 1, paddingVertical: ScaleSzie(3) }} >
                        <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                    </View>
                </View>
            </TouchableOpacity>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tableHeader: {
        height: ScaleSzie(60),
        backgroundColor: '#FAFAFA',
        borderBottomWidth: 0.5,
        borderBottomColor: '#C5C5C5',
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

export default RowTableProducts;


import React from 'react';
import {
    View,
    Text,
    TextInput,
    Alert,
    Dimensions,
    ScrollView,
    StyleSheet,
    TouchableOpacity
} from 'react-native';

import { ButtonCustom, PopupParent } from '@components';
import { scaleSzie, localize, getCategoryName } from '@utils';

const { width } = Dimensions.get('window');

class PopupDetailProduct extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            productInfo: {
                productId: '',
                categoryId: '',
                name: "",
                description: "",
                sku: '',
                quantity: '',
                minThreshold: '',
                maxThreshold: '',
                price: '',
                isDisabled: 'Active',
                needToorDer: 0
            }
        }
    }

    setProductInfoFromParent = (productInfo) => {
        // console.log('productInfo : ', productInfo);
        const { categoriesByMerchant } = this.props;
        this.setState({
            productInfo: {
                ...productInfo,
                categoryId: getCategoryName(categoriesByMerchant, productInfo.categoryId),
                isDisabled: productInfo.isDisabled === 0 ? 'Active' : 'Disable',
            }
        })
    }

    render() {
        const { title, visible, onRequestClose, language } = this.props;
        const temptHeight = width - scaleSzie(500);
        const { categoryId, name, description, sku,
            quantity, minThreshold, maxThreshold, price, isDisabled, needToorDer
        } = this.state.productInfo;
        return (
            <PopupParent
                title={title}
                visible={visible}
                onRequestClose={() => onRequestClose()}
                style={{ justifyContent: 'flex-start', paddingTop: scaleSzie(20) }}
            >
                <View style={{
                    height: scaleSzie(temptHeight), backgroundColor: '#fff',
                    borderBottomLeftRadius: scaleSzie(15),
                    borderBottomRightRadius: scaleSzie(15),
                    paddingHorizontal: scaleSzie(30)
                }} >
                    <View style={{ flex: 1 }} >
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                        >
                            <View style={{ height: scaleSzie(13) }} />
                            {/* ---- start ---- */}
                            <TouchableOpacity activeOpacity={1}>
                                <ItemDetail
                                    title={localize('Product', language)}
                                    value={name}
                                />
                                <ItemDetail
                                    title={localize('SKU number', language)}
                                    value={sku}
                                />
                                <ItemDetail
                                    title={localize('Category', language)}
                                    value={categoryId}
                                />
                                <ItemDetail
                                    title={localize('Quantity', language)}
                                    value={quantity}
                                />
                                <ItemDetail
                                    title={localize('Need to order', language)}
                                    value={needToorDer}
                                />
                                <ItemDetail
                                    title={localize('Low theshold', language)}
                                    value={minThreshold}
                                />
                                <ItemDetail
                                    title={localize('Max theshold', language)}
                                    value={maxThreshold}
                                />
                                <ItemDetail
                                    title={`${localize('Price', language)} ($)`}
                                    value={price}
                                />
                                <ItemDetail
                                    title={localize('Status', language)}
                                    value={isDisabled}
                                />
                                <ItemDetail
                                    title={localize('Description', language)}
                                    value={''}
                                />
                                <View style={{
                                    height: scaleSzie(70), borderWidth: 1, borderColor: '#C5C5C5',
                                    paddingLeft: scaleSzie(10), backgroundColor: '#FAFAFA', paddingTop: scaleSzie(5)
                                }} >
                                    <TextInput
                                        placeholder=""
                                        style={{ flex: 1, fontSize: scaleSzie(16) }}
                                        multiline={true}
                                    value={description}
                                    editable={false}
                                    // onChangeText={value => this.updateProductInfo('description', value)}
                                    />
                                </View>
                            </TouchableOpacity>

                            {/* -----  */}
                            <TouchableOpacity activeOpacity={1} style={{ height: scaleSzie(250), }} />
                        </ScrollView>
                    </View>
                    {/* ---- Footer ---- */}
                    <View style={{ height: scaleSzie(70), flexDirection: 'row', justifyContent: 'space-evenly' }} >
                        <ButtonCustom
                            width={200}
                            height={45}
                            backgroundColor="#F1F1F1"
                            title={localize('Edit', language)}
                            textColor="#6A6A6A"
                            onPress={this.doneAddProduct}
                            style={{
                                borderRadius: scaleSzie(2),
                                borderColor: '#C5C5C5',
                                borderWidth: 1,
                            }}
                            styleText={{
                                fontSize: scaleSzie(16),
                                fontWeight: '500'
                            }}
                        />
                        <ButtonCustom
                            width={200}
                            height={45}
                            backgroundColor="#F1F1F1"
                            title={localize('Archive', language)}
                            textColor="#6A6A6A"
                            onPress={this.doneAddProduct}
                            style={{
                                borderRadius: scaleSzie(2),
                                borderColor: '#C5C5C5',
                                borderWidth: 1,
                            }}
                            styleText={{
                                fontSize: scaleSzie(16),
                                fontWeight: '500'
                            }}
                        />
                    </View>
                </View>
            </PopupParent>
        );
    }
}

const ItemDetail = ({ title, value }) => {
    return (
        <View style={{ height: scaleSzie(40), flexDirection: 'row' }} >
            <View style={{ flex: 1, justifyContent: 'center' }} >
                <Text style={styles.textCommon} >
                    {title}
                </Text>
            </View>
            <View style={{ flex: 1, justifyContent: 'center' }} >
                <Text style={styles.textValue} >
                    {value}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    textCommon: {
        color: '#707070',
        fontSize: scaleSzie(16)
    },
    textValue: {
        color: '#404040',
        fontSize: scaleSzie(18)
    }
})

export default PopupDetailProduct;



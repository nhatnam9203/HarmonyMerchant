import React from 'react';
import {
    View,
    Text,
    TextInput,
    Alert,
    Dimensions,
    ScrollView
} from 'react-native';
import { TextInputMask } from 'react-native-masked-text';

import ButtonCustom from './ButtonCustom';
import PopupParent from './PopupParent';
import {Dropdown} from './react-native-material-dropdown';
import { scaleSzie, getCategoryName,getArrayNameCategories,getCategoryIdByName } from '@utils';

const { width } = Dimensions.get('window');

class PopupAddEditProduct extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            productInfo: {
                categoryId: '',
                name: "",
                description: "",
                sku: '',
                quantity: '',
                minThreshold: '',
                maxThreshold: '',
                price: '',
                isDisabled: 'Active',
            }
        }
    }

    updateProductInfo(key, value, keyParent = '') {
        const { productInfo } = this.state;
        if (keyParent !== '') {
            const temptParent = productInfo[keyParent];
            const temptChild = { ...temptParent, [key]: value };
            const temptUpdate = { ...productInfo, [keyParent]: temptChild };
            this.setState({
                productInfo: temptUpdate
            })
        } else {
            const temptUpdate = { ...productInfo, [key]: value };
            this.setState({
                productInfo: temptUpdate
            })
        }
    }

    setProductInfoFromParent = (productInfo) => {
        const {categoriesByMerchant} = this.props;
        this.setState({
            productInfo: {
                productId: productInfo.productId,
                categoryId: getCategoryName(categoriesByMerchant,productInfo.categoryId),
                name: productInfo.name,
                description: productInfo.description,
                sku: productInfo.sku ? productInfo.sku : '',
                quantity: productInfo.quantity ? productInfo.quantity : '',
                minThreshold: productInfo.minThreshold ? productInfo.minThreshold : '',
                maxThreshold: productInfo.maxThreshold ? productInfo.maxThreshold : '',
                price: productInfo.price ? productInfo.price : '',
                isDisabled: productInfo.isDisabled === 0 ? 'Active' : 'Disable'
            }
        })
    }

    setDefaultStateFromParent = () => {
        this.setState({
            productInfo: {
                categoryId: '',
                name: "",
                description: "",
                sku: '',
                quantity: '',
                minThreshold: '',
                maxThreshold: '',
                price: '',
                isDisabled: 'Active',
            }
        })
    }

    doneAddProduct = () => {
        const { productInfo } = this.state;
        const temptProductInfo = {
            ...productInfo,
            categoryId: productInfo.categoryId !== '' ? getCategoryIdByName(this.props.categoriesByMerchant,serviceInfo.categoryId,'Service') : ''
        }
        const arrayKey = Object.keys(temptProductInfo);
        let keyError = "";
        for (let i = 0; i <= arrayKey.length -1; i++) {
            if (temptProductInfo[arrayKey[i]] == "") {
                keyError = arrayKey[i];
                break;
            }
        }
        if (keyError != '') {
            Alert.alert(`${strings[keyError]}`);
        } else {
            if (this.props.isSave) {
                this.props.editProduct({...temptProductInfo,isDisabled:productInfo.isDisabled === 'Active' ? 0 : 1, });
            } else {
                this.props.confimYes(temptProductInfo);
            }

        }
    }


    render() {
        const { title, visible, onRequestClose, isSave,
            categoriesByMerchant
        } = this.props;
        const temptHeight = width - scaleSzie(500);
        const temptTitleButton = isSave ? 'Save' : 'Done';
        const { categoryId, name, description, sku, quantity, minThreshold,
            maxThreshold, price, isDisabled
        } = this.state.productInfo
        return (
            <PopupParent
                title={title}
                visible={visible}
                onRequestClose={() => onRequestClose()}
                style={{ justifyContent: 'flex-start', paddingTop: scaleSzie(20) }}
            >
                <View style={{
                    height: scaleSzie(temptHeight), backgroundColor: '#fff',
                    borderBottomLeftRadius: scaleSzie(15), borderBottomRightRadius: scaleSzie(15),
                    paddingHorizontal: scaleSzie(30)
                }} >
                    <View style={{ flex: 1, }} >
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                        >
                            <Text style={{ color: '#404040', fontSize: scaleSzie(12), marginTop: scaleSzie(10), marginBottom: scaleSzie(10) }} >
                                Category
                            </Text>
                            <View style={{ width: scaleSzie(200), height: scaleSzie(30), }} >
                                <Dropdown
                                    label='Facial'
                                    data={getArrayNameCategories(categoriesByMerchant,'Product')}
                                    value={categoryId}
                                    onChangeText={(value) => this.updateProductInfo('categoryId', value)}
                                    containerStyle={{
                                        backgroundColor: '#F1F1F1',
                                        borderWidth: 1,
                                        borderColor: '#6A6A6A',
                                        flex: 1
                                    }}
                                />
                            </View>
                            <Text style={{ color: '#404040', fontSize: scaleSzie(12), marginBottom: scaleSzie(10), marginTop: scaleSzie(7) }} >
                                Product
                            </Text>
                            <View style={{
                                height: scaleSzie(30), borderWidth: 1, borderColor: '#6A6A6A',
                                paddingLeft: scaleSzie(10),
                            }} >
                                <TextInput
                                    placeholder="Product 1"
                                    style={{ flex: 1, fontSize: scaleSzie(16) }}
                                    value={name}
                                    onChangeText={(value) => this.updateProductInfo('name', value)}
                                />
                            </View>
                            <Text style={{ color: '#404040', fontSize: scaleSzie(12), marginBottom: scaleSzie(10), marginTop: scaleSzie(7) }} >
                                Description
                            </Text>
                            <View style={{
                                height: scaleSzie(60), borderWidth: 1, borderColor: '#6A6A6A',
                                paddingLeft: scaleSzie(10), backgroundColor: '#FAFAFA', paddingTop: scaleSzie(5)
                            }} >
                                <TextInput
                                    placeholder=""
                                    style={{ flex: 1, fontSize: scaleSzie(16) }}
                                    multiline={true}
                                    value={description}
                                    onChangeText={value => this.updateProductInfo('description', value)}
                                />
                            </View>
                            {/* -----  */}
                            <View style={{ flexDirection: 'row', marginTop: scaleSzie(10) }} >
                                <View style={{ flex: 1 }} >
                                    <Text style={{ color: '#404040', fontSize: scaleSzie(12), marginBottom: scaleSzie(10) }} >
                                        SKU number
                                    </Text>
                                    <View style={{ height: scaleSzie(30), paddingRight: scaleSzie(20) }} >
                                        <View style={{ flex: 1, borderWidth: 1, borderColor: '#6A6A6A', paddingHorizontal: scaleSzie(5) }} >
                                            <TextInput
                                                placeholder="sku12345678"
                                                style={{ flex: 1, fontSize: scaleSzie(16) }}
                                                value={sku}
                                                onChangeText={value => this.updateProductInfo('sku', value)}
                                            />
                                        </View>
                                    </View>
                                </View>
                                <View style={{
                                    width: scaleSzie(100), justifyContent: 'flex-end',
                                }} >
                                    <ButtonCustom
                                        width={scaleSzie(100)}
                                        height={30}
                                        backgroundColor="#0764B0"
                                        title={'Scan'}
                                        textColor="#fff"
                                        onPress={() => alert('scan')}
                                        style={{ borderRadius: scaleSzie(2) }}
                                        styleText={{
                                            fontSize: scaleSzie(14)
                                        }}
                                    />
                                </View>
                            </View>
                            {/* -----  */}
                            <View style={{ flexDirection: 'row', marginTop: scaleSzie(10) }} >
                                <View style={{ flex: 1 }} >
                                    <Text style={{ color: '#404040', fontSize: scaleSzie(12), marginBottom: scaleSzie(10) }} >
                                        Items in stock
                                    </Text>
                                    <View style={{ height: scaleSzie(30), paddingRight: scaleSzie(20) }} >
                                        <View style={{ flex: 1, borderWidth: 1, borderColor: '#6A6A6A', paddingHorizontal: scaleSzie(5) }} >
                                            <TextInputMask
                                                type="only-numbers"
                                                placeholder="100"
                                                style={{ flex: 1, fontSize: scaleSzie(16) }}
                                                value={quantity}
                                                onChangeText={value => this.updateProductInfo('quantity', value)}
                                            />
                                        </View>
                                    </View>
                                </View>
                                <View style={{ flex: 1 }} >

                                </View>
                            </View>
                            {/* ----- */}
                            <View style={{ flexDirection: 'row', marginTop: scaleSzie(10) }} >
                                <View style={{ flex: 1 }} >
                                    <Text style={{ color: '#404040', fontSize: scaleSzie(12), marginBottom: scaleSzie(10) }} >
                                        Low theshold
                                    </Text>
                                    <View style={{ height: scaleSzie(30), paddingRight: scaleSzie(20) }} >
                                        <View style={{ flex: 1, borderWidth: 1, borderColor: '#6A6A6A', paddingHorizontal: scaleSzie(5) }} >
                                            <TextInputMask
                                                type="only-numbers"
                                                placeholder="10"
                                                style={{ flex: 1, fontSize: scaleSzie(16) }}
                                                value={minThreshold}
                                                onChangeText={value => this.updateProductInfo('minThreshold', value)}
                                            />
                                        </View>
                                    </View>
                                </View>
                                <View style={{ flex: 1 }} >
                                    <Text style={{ color: '#404040', fontSize: scaleSzie(12), marginBottom: scaleSzie(10) }} >
                                        Max theshold
                                    </Text>
                                    <View style={{ height: scaleSzie(30), paddingRight: scaleSzie(20) }} >
                                        <View style={{ flex: 1, borderWidth: 1, borderColor: '#6A6A6A', paddingHorizontal: scaleSzie(5) }} >
                                            <TextInputMask
                                                type="only-numbers"
                                                placeholder="20"
                                                style={{ flex: 1, fontSize: scaleSzie(16) }}
                                                value={maxThreshold}
                                                onChangeText={value => this.updateProductInfo('maxThreshold', value)}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>
                            {/* ----- */}
                            <View style={{ flexDirection: 'row', marginTop: scaleSzie(10) }} >
                                <View style={{ flex: 1 }} >
                                    <Text style={{ color: '#404040', fontSize: scaleSzie(12), marginBottom: scaleSzie(10) }} >
                                        Price
                                    </Text>
                                    <View style={{ height: scaleSzie(30), paddingRight: scaleSzie(20) }} >
                                        <View style={{ flex: 1, borderWidth: 1, borderColor: '#6A6A6A', paddingHorizontal: scaleSzie(5) }} >
                                            <TextInputMask
                                                type="only-numbers"
                                                placeholder="10$"
                                                style={{ flex: 1, fontSize: scaleSzie(16) }}
                                                value={price}
                                                onChangeText={value => this.updateProductInfo('price', value)}
                                            />
                                        </View>
                                    </View>
                                </View>
                                <View style={{ flex: 1 }} >
                                    <Text style={{ color: '#404040', fontSize: scaleSzie(12), marginBottom: scaleSzie(10) }} >
                                        Status
                                    </Text>
                                    <View style={{ height: scaleSzie(30), paddingRight: scaleSzie(20) }} >
                                        <View style={{ width: scaleSzie(100), height: scaleSzie(30) }} >
                                            <Dropdown
                                                label='Active'
                                                data={[{ value: 'Active' }, { value: 'Disable' }]}
                                                value={isDisabled}
                                                onChangeText={(value) => this.updateProductInfo('isDisabled', value)}
                                                containerStyle={{
                                                    backgroundColor: '#F1F1F1',
                                                    borderWidth: 1,
                                                    borderColor: '#6A6A6A',
                                                    flex: 1
                                                }}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>
                            {/* -----  */}
                            <View style={{ height: scaleSzie(250) }} />
                        </ScrollView>
                    </View>
                    {/* ---- Footer ---- */}
                    <View style={{ height: scaleSzie(50), alignItems: 'center' }} >
                        <ButtonCustom
                            width={150}
                            height={35}
                            backgroundColor="#0764B0"
                            title={temptTitleButton}
                            textColor="#fff"
                            onPress={this.doneAddProduct}
                            style={{ borderRadius: scaleSzie(2) }}
                            styleText={{
                                fontSize: scaleSzie(14)
                            }}
                        />
                    </View>
                </View>
            </PopupParent>
        );
    }

}


const strings = {
    categoryId: 'Mising info : Category',
    name: 'Mising info : Name Product',
    description: 'Mising info : Description',
    sku: 'Mising info : SKU Number',
    quantity: 'Mising info : Item In Stock',
    minThreshold: 'Mising info : Low Theshold',
    maxThreshold: 'Mising info : Max Theshold',
    price: 'Mising info : Price',
    status: 'Active',
}

export default PopupAddEditProduct;



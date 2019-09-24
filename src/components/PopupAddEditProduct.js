import React from 'react';
import {
    View,
    Text,
    TextInput,
    Alert,
    Dimensions,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import { TextInputMask } from 'react-native-masked-text';

import ButtonCustom from './ButtonCustom';
import PopupParent from './PopupParent';
import BrowserFile from './BrowserFile';
import { Dropdown } from './react-native-material-dropdown';
import { scaleSzie, getCategoryName, getArrayNameCategories, getCategoryIdByName } from '@utils';

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
            },
            fileId: 0,
            imageUrl: '',
            isSubmitButton: true
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

    setProductInfoFromParent = async (productInfo) => {
        const { categoriesByMerchant } = this.props;
        await this.setState({
            productInfo: {
                productId: productInfo.productId,
                categoryId: getCategoryName(categoriesByMerchant, productInfo.categoryId),
                name: productInfo.name,
                description: productInfo.description,
                sku: productInfo.sku ? productInfo.sku : '',
                quantity: productInfo.quantity ? productInfo.quantity : '',
                minThreshold: productInfo.minThreshold ? productInfo.minThreshold : '',
                maxThreshold: productInfo.maxThreshold ? productInfo.maxThreshold : '',
                price: productInfo.price ? productInfo.price : '',
                isDisabled: productInfo.isDisabled === 0 ? 'Active' : 'Disable'
            },
            imageUrl: productInfo.imageUrl
        })
    }

    setDefaultStateFromParent = async () => {
        await this.setState({
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
            },
            fileId: 0,
            imageUrl: ''
        })
    }

    doneAddProduct = () => {
        const { productInfo } = this.state;
        const temptProductInfo = {
            ...productInfo,
            categoryId: productInfo.categoryId !== '' ? getCategoryIdByName(this.props.categoriesByMerchant, productInfo.categoryId, 'Product') : ''
        }
        const arrayKey = Object.keys(temptProductInfo);
        let keyError = "";
        for (let i = 0; i <= arrayKey.length - 1; i++) {
            if (arrayKey[i] === 'description') {
                continue;
            } else if (temptProductInfo[arrayKey[i]] == "") {
                keyError = arrayKey[i];
                break;
            }
        }
        if (keyError != '') {
            Alert.alert(`${strings[keyError]}`);
        } else {
            if (this.props.isSave) {
                this.props.editProduct({
                    ...temptProductInfo, isDisabled: productInfo.isDisabled === 'Active' ? 0 : 1,
                    fileId: this.state.fileId
                });
            } else {
                this.props.confimYes({
                    ...temptProductInfo, isDisabled: productInfo.isDisabled === 'Active' ? 0 : 1,
                    fileId: this.state.fileId
                });
            }

        }
    }

    updateFileId = async (fileId) => {
        await this.setState({
            fileId
        })
    }

    onRequestClose = async () => {
        await this.setState({
            fileId: 0
        });
        this.props.onRequestClose();
    }

    editButtonSubmit = async (isSubmit) => {
        await this.setState({
            isSubmitButton: isSubmit
        })
    }


    // --------- Render -----

    renderButtonSubmit() {
        const { isSave } = this.props;
        const { isSubmitButton } = this.state;
        const temptTitleButton = isSave ? 'Save' : 'Done';
        if (isSubmitButton) {
            return (
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
            );
        } else {
            return (
                <View style={{
                    width: 150, height: scaleSzie(35), backgroundColor: '#0764B0',
                    borderRadius: scaleSzie(2), justifyContent: 'center', alignItems: 'center'
                }} >
                    < ActivityIndicator
                        size="large"
                        color="#fff"
                    />
                </View>
            );
        }
    }

    render() {
        const { title, visible,
            categoriesByMerchant
        } = this.props;
        const { categoryId, name, description, sku, quantity, minThreshold,
            maxThreshold, price, isDisabled
        } = this.state.productInfo
        return (
            <PopupParent
                title={title}
                visible={visible}
                onRequestClose={this.onRequestClose}
                style={{ justifyContent: 'flex-start', paddingTop: scaleSzie(20) }}
            >
                <View style={{
                    height: scaleSzie(480), backgroundColor: '#fff',
                    borderBottomLeftRadius: scaleSzie(15), borderBottomRightRadius: scaleSzie(15),
                    paddingHorizontal: scaleSzie(30)
                }} >
                    <View style={{ flex: 1, }} >
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                        >
                            <TouchableOpacity activeOpacity={1}>
                                <Text style={{ color: '#404040', fontSize: scaleSzie(12), marginTop: scaleSzie(10), marginBottom: scaleSzie(10) }} >
                                    Category *
                            </Text>
                                <View style={{ width: scaleSzie(200), height: scaleSzie(30), }} >
                                    <Dropdown
                                        label='Facial'
                                        data={getArrayNameCategories(categoriesByMerchant, 'Product')}
                                        value={categoryId}
                                        onChangeText={(value) => this.updateProductInfo('categoryId', value)}
                                        containerStyle={{
                                            backgroundColor: '#F1F1F1',
                                            borderWidth: 1,
                                            borderColor: '#C5C5C5',
                                            flex: 1
                                        }}
                                    />
                                </View>
                                <Text style={{ color: '#404040', fontSize: scaleSzie(12), marginBottom: scaleSzie(10), marginTop: scaleSzie(7) }} >
                                    Product *
                            </Text>
                                <View style={{
                                    height: scaleSzie(30), borderWidth: 1, borderColor: '#C5C5C5',
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
                                    height: scaleSzie(70), borderWidth: 1, borderColor: '#C5C5C5',
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
                                {/* ------- Upload Image ----- */}
                                <BrowserFile
                                    updateFileId={this.updateFileId}
                                    imageUrl={this.state.imageUrl}
                                    editButtonSubmit={this.editButtonSubmit}
                                />
                                {/* -------------------------- */}
                                <View style={{ flexDirection: 'row', marginTop: scaleSzie(10) }} >
                                    <View style={{ flex: 1 }} >
                                        <Text style={{ color: '#404040', fontSize: scaleSzie(12), marginBottom: scaleSzie(10) }} >
                                            SKU number *
                                    </Text>
                                        <View style={{ height: scaleSzie(30), paddingRight: scaleSzie(20) }} >
                                            <View style={{ flex: 1, borderWidth: 1, borderColor: '#C5C5C5', paddingHorizontal: scaleSzie(5) }} >
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
                                            Items in stock *
                                    </Text>
                                        <View style={{ height: scaleSzie(30), paddingRight: scaleSzie(20) }} >
                                            <View style={{ flex: 1, borderWidth: 1, borderColor: '#C5C5C5', paddingHorizontal: scaleSzie(5) }} >
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
                                            Low theshold *
                                    </Text>
                                        <View style={{ height: scaleSzie(30), paddingRight: scaleSzie(20) }} >
                                            <View style={{ flex: 1, borderWidth: 1, borderColor: '#C5C5C5', paddingHorizontal: scaleSzie(5) }} >
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
                                            Max theshold *
                                    </Text>
                                        <View style={{ height: scaleSzie(30), paddingRight: scaleSzie(20) }} >
                                            <View style={{ flex: 1, borderWidth: 1, borderColor: '#C5C5C5', paddingHorizontal: scaleSzie(5) }} >
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
                                            Price *
                                    </Text>
                                        <View style={{ height: scaleSzie(30), paddingRight: scaleSzie(20) }} >
                                            <View style={{ flex: 1, borderWidth: 1, borderColor: '#C5C5C5', paddingHorizontal: scaleSzie(5) }} >
                                            <TextInputMask
                                                // type="only-numbers"
                                                type={'money'}
                                                options={{
                                                    precision: 2,
                                                    separator: '.',
                                                    delimiter: ',',
                                                    unit: '',
                                                    suffixUnit: ''
                                                }}
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
                                            Status *
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
                                                        borderColor: '#C5C5C5',
                                                        flex: 1
                                                    }}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                {/* -----  */}
                                <View style={{ height: scaleSzie(250) }} />
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                    {/* ---- Footer ---- */}
                    <View style={{ height: scaleSzie(50), alignItems: 'center' }} >
                        {this.renderButtonSubmit()}
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



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
import { scaleSzie, getCategoryName, getArrayNameCategories, getCategoryIdByName, requestAPI, localize } from '@utils';
import connectRedux from '@redux/ConnectRedux';
import apiConfigs from '@configs/api';


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
            isSubmitButton: true,
            isLoadingCheckSKU: false,
        };
        this.scrollProductRef = React.createRef();
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
            imageUrl: productInfo.imageUrl,
            isLoadingCheckSKU: false,
        });
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
            imageUrl: '',
            isLoadingCheckSKU: false
        })
    }

    doneAddProduct = async () => {
        const { versionApp, profileStaffLogin } = this.props;
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
                await this.setState({
                    isLoadingCheckSKU: true
                })
                try {
                    const checkSKUIsExist = await requestAPI({
                        type: 'CHECK_SKU_IS_EXIST1',
                        method: 'GET',
                        token: profileStaffLogin.token,
                        api: `${apiConfigs.BASE_API}product/checksku?sku=${temptProductInfo.sku}`,
                        versionApp: versionApp
                    });
                    if (checkSKUIsExist.codeNumber === 200) {
                        this.props.confimYes({
                            ...temptProductInfo, isDisabled: productInfo.isDisabled === 'Active' ? 0 : 1,
                            fileId: this.state.fileId
                        });
                    } else {
                        await this.setState({
                            isLoadingCheckSKU: false
                        })
                        alert('This product SKU is existing!');
                    }
                } catch (error) {
                    await this.setState({
                        isLoadingCheckSKU: false
                    })
                    this.props.actions.app.catchError(error)
                }
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

    scrollProductTo(position) {
        this.scrollProductRef.current.scrollTo({ x: 0, y: scaleSzie(position), animated: true })
    }


    // --------- Render -----

    renderButtonSubmit() {
        const { isSave, loading } = this.props;
        const { isLoadingCheckSKU } = this.state;
        const temptTitleButton = isSave ? 'Save' : 'Done';
        if (!isLoadingCheckSKU) {
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
        const { title, visible, categoriesByMerchant, language } = this.props;
        const { categoryId, name, description, sku, quantity, minThreshold,
            maxThreshold, price, isDisabled
        } = this.state.productInfo;

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
                            ref={this.scrollProductRef}
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="always"
                        >
                            <TouchableOpacity activeOpacity={1}>
                                <Text style={{ color: '#404040', fontSize: scaleSzie(12), marginTop: scaleSzie(10), marginBottom: scaleSzie(10) }} >
                                    {`${localize('Category', language)}*`}
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
                                    {`${localize('Product', language)}*`}
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
                                        onFocus={() => this.scrollProductTo(70)}
                                    />
                                </View>
                                <Text style={{ color: '#404040', fontSize: scaleSzie(12), marginBottom: scaleSzie(10), marginTop: scaleSzie(7) }} >

                                    {`${localize('Description', language)}`}
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
                                        onFocus={() => this.scrollProductTo(130)}
                                    />
                                </View>
                                {/* -------------------------- */}
                                <View style={{ flexDirection: 'row', marginTop: scaleSzie(10) }} >
                                    <View style={{ flex: 1 }} >
                                        <Text style={{ color: '#404040', fontSize: scaleSzie(12), marginBottom: scaleSzie(10) }} >
                                            {`${localize('SKU Number', language)}*`}
                                        </Text>
                                        <View style={{
                                            height: scaleSzie(30),
                                        }} >
                                            <View style={{ flex: 1, borderWidth: 1, borderColor: '#C5C5C5', paddingHorizontal: scaleSzie(5) }} >
                                                <TextInput
                                                    placeholder="sku12345678"
                                                    style={{ flex: 1, fontSize: scaleSzie(16) }}
                                                    value={sku}
                                                    onChangeText={value => this.updateProductInfo('sku', value)}
                                                    onFocus={() => this.scrollProductTo(230)}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                {/* -----  */}
                                <View style={{ flexDirection: 'row', marginTop: scaleSzie(10) }} >
                                    <View style={{ flex: 1 }} >
                                        <Text style={{ color: '#404040', fontSize: scaleSzie(12), marginBottom: scaleSzie(10) }} >
                                            {`${localize('Items In Stock', language)}*`}
                                        </Text>
                                        <View style={{ height: scaleSzie(30), paddingRight: scaleSzie(20) }} >
                                            <View style={{ flex: 1, borderWidth: 1, borderColor: '#C5C5C5', paddingHorizontal: scaleSzie(5) }} >
                                                <TextInputMask
                                                    type="only-numbers"
                                                    placeholder="100"
                                                    style={{ flex: 1, fontSize: scaleSzie(16) }}
                                                    value={quantity}
                                                    onChangeText={value => this.updateProductInfo('quantity', value)}
                                                    onFocus={() => this.scrollProductTo(300)}
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
                                            {`${localize('Low Threshold', language)}*`}
                                        </Text>
                                        <View style={{ height: scaleSzie(30), paddingRight: scaleSzie(20) }} >
                                            <View style={{ flex: 1, borderWidth: 1, borderColor: '#C5C5C5', paddingHorizontal: scaleSzie(5) }} >
                                                <TextInputMask
                                                    type="only-numbers"
                                                    placeholder="10"
                                                    style={{ flex: 1, fontSize: scaleSzie(16) }}
                                                    value={minThreshold}
                                                    onChangeText={value => this.updateProductInfo('minThreshold', value)}
                                                    onFocus={() => this.scrollProductTo(360)}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                    <View style={{ flex: 1 }} >
                                        <Text style={{ color: '#404040', fontSize: scaleSzie(12), marginBottom: scaleSzie(10) }} >
                                            {`${localize('High Threshold', language)}*`}
                                        </Text>
                                        <View style={{ height: scaleSzie(30), paddingRight: scaleSzie(20) }} >
                                            <View style={{ flex: 1, borderWidth: 1, borderColor: '#C5C5C5', paddingHorizontal: scaleSzie(5) }} >
                                                <TextInputMask
                                                    type="only-numbers"
                                                    placeholder="20"
                                                    style={{ flex: 1, fontSize: scaleSzie(16) }}
                                                    value={maxThreshold}
                                                    onChangeText={value => this.updateProductInfo('maxThreshold', value)}
                                                    onFocus={() => this.scrollProductTo(360)}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                {/* ----- */}
                                <View style={{ flexDirection: 'row', marginTop: scaleSzie(10) }} >
                                    <View style={{ flex: 1 }} >
                                        <Text style={{ color: '#404040', fontSize: scaleSzie(12), marginBottom: scaleSzie(10) }} >
                                            {`${localize('Price', language)}*`}
                                        </Text>
                                        <View style={{ height: scaleSzie(30), paddingRight: scaleSzie(20) }} >
                                            <View style={{ flex: 1, borderWidth: 1, borderColor: '#C5C5C5', paddingHorizontal: scaleSzie(5) }} >
                                                <TextInputMask
                                                    type={'money'}
                                                    options={{
                                                        precision: 2,
                                                        separator: '.',
                                                        delimiter: ',',
                                                        unit: '',
                                                        suffixUnit: ''
                                                    }}
                                                    placeholder="$ 0.00"
                                                    style={{ flex: 1, fontSize: scaleSzie(16) }}
                                                    value={price}
                                                    onChangeText={value => this.updateProductInfo('price', value)}
                                                    onFocus={() => this.scrollProductTo(450)}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                    <View style={{ flex: 1 }} >
                                        <Text style={{ color: '#404040', fontSize: scaleSzie(12), marginBottom: scaleSzie(10) }} >
                                            {`${localize('Status', language)}*`}
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
                                {/* ------- Upload Image ----- */}
                                <BrowserFile
                                    updateFileId={this.updateFileId}
                                    imageUrl={this.state.imageUrl}
                                    editButtonSubmit={this.editButtonSubmit}
                                />
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
    categoryId: 'Missing Info: Category',
    name: 'Missing Info: Product Name',
    description: 'Missing Info: Description',
    sku: 'Missing Info: SKU Number',
    quantity: 'Missing Info: Items In Stock',
    minThreshold: 'Missing Info: Low Threshold',
    maxThreshold: 'Missing Info: High Threshold',
    price: 'Missing Info: Price',
    status: 'Active',
}


const mapStateToProps = state => ({
    loading: state.app.loading,
    token: state.dataLocal.token,
    language: state.dataLocal.language,
    versionApp: state.dataLocal.versionApp,
    profileStaffLogin: state.dataLocal.profileStaffLogin
})


export default connectRedux(mapStateToProps, PopupAddEditProduct);


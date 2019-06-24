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

import { ButtonCustom, PopupParent, Dropdown } from '@components';
import { scaleSzie } from '@utils';
import connectRedux from '@redux/ConnectRedux';

const { width } = Dimensions.get('window');

class PopupAddEditProduct extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            productInfo: {
                categoryId: '',
                name: "",
                description: "",
                skuNumber: '',
                itemsInStock: '',
                lowTheshold: '',
                maxTheshold: '',
                price: '',
                status: 'Active',
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

    doneAddService = () => {
        const { productInfo } = this.state;
        const temptProductInfo = {
            ...productInfo,
            status: productInfo.status === 'Active' ? 1 : 0,
            categoryId: productInfo.categoryId !== '' ? this.getCateroryId(productInfo.categoryId) : ''
        }
        const arrayKey = Object.keys(temptProductInfo);
        let keyError = "";
        for (let i = 0; i <= arrayKey.length; i++) {
            if (temptProductInfo[arrayKey[i]] == "") {
                keyError = arrayKey[i];
                break;
            }
        }
        if (keyError != '') {
            Alert.alert(`${strings[keyError]}`);
        } else {
            console.log('productInfo: ' + JSON.stringify(temptProductInfo));
            this.props.actions.product.addProductByMerchant(temptProductInfo)
            this.props.confimYes();
        }
    }

    getCateroryId(name) {
        const { categoriesByMerchant } = this.props;
        let categoryId = -1;
        for (let i = 0; i < categoriesByMerchant.length - 1; i++) {
            if (categoriesByMerchant[i].name == name) {
                categoryId = categoriesByMerchant[i].categoryId;
                break;
            }
        }
        return categoryId;
    }

    filterCategories(categories) {
        return categories.map(category => ({ value: category.name, id: category.categoryId }));
    }

    render() {
        const { title, visible, onRequestClose, doneAddService, isSave,
            categoriesByMerchant
        } = this.props;
        const temptHeight = width - scaleSzie(500);
        const temptTitleButton = isSave ? 'Save' : 'Done';
        const { categoryId, name, description, skuNumber, itemsInStock, lowTheshold,
            maxTheshold, price, status
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
                                    data={this.filterCategories(categoriesByMerchant)}
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
                                                value={skuNumber}
                                                onChangeText={value => this.updateProductInfo('skuNumber', value)}
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
                                                value={itemsInStock}
                                                onChangeText={value => this.updateProductInfo('itemsInStock', value)}
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
                                                value={lowTheshold}
                                                onChangeText={value => this.updateProductInfo('lowTheshold', value)}
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
                                                value={maxTheshold}
                                                onChangeText={value => this.updateProductInfo('maxTheshold', value)}
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
                                                value={status}
                                                onChangeText={(value) => this.updateProductInfo('status', value)}
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
                            onPress={this.doneAddService}
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

const ItemTime = (props) => {
    const { title } = props;
    return (
        <View>
            <Text style={{ color: '#404040', fontSize: scaleSzie(12), marginBottom: scaleSzie(10), marginTop: scaleSzie(7) }} >
                {title}
            </Text>
            <View style={{
                height: scaleSzie(30), width: scaleSzie(90),
                borderWidth: 1, borderColor: '#6A6A6A', flexDirection: 'row'
            }} >
                <View style={{ flex: 1, paddingLeft: scaleSzie(5) }} >
                    <TextInput
                        style={{ flex: 1, fontSize: scaleSzie(16) }}
                    />
                </View>
                <View style={{ justifyContent: 'flex-end', paddingRight: 4 }} >
                    <Text style={{ color: '#6A6A6A', fontSize: scaleSzie(14) }} >
                        min
                </Text>
                </View>

            </View>
        </View>
    );
}

const strings = {
    categoryId: 'Mising info : Category',
    name: 'Mising info : Name Product',
    description: 'Mising info : Description',
    skuNumber: 'Mising info : SKU Number',
    itemsInStock: 'Mising info : Item In Stock',
    lowTheshold: 'Mising info : Low Theshold',
    maxTheshold: 'Mising info : Max Theshold',
    price: 'Mising info : Price',
    status: 'Active',
}

const mapStateToProps = state => ({
    categoriesByMerchant: state.category.categoriesByMerchant
});
export default connectRedux(mapStateToProps, PopupAddEditProduct);



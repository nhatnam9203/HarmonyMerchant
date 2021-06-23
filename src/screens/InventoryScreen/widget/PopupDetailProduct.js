import React from 'react';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    StyleSheet,
    TouchableOpacity
} from 'react-native';

import { ButtonCustom, PopupParent, PopupConfirm } from '@components';
import { ScaleSzie, localize, getCategoryName, checkIsTablet } from '@utils';


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
            },
            visibleArchive: false,
            visibleRestore: false
        }
    }

    setProductInfoFromParent = (productInfo) => {
        const { categoriesByMerchant } = this.props;
        this.setState({
            productInfo: {
                ...productInfo,
                categoryId: getCategoryName(categoriesByMerchant, productInfo.categoryId),
                isDisabled: productInfo.isDisabled === 0 ? 'Active' : 'Disable',
            }
        })
    }

    showModalEditProduct = async () => {
        const { productInfo } = this.state;
        this.props.showModalEditProduct(productInfo.productId);
    }

    showModalArchive = () => {
        this.setState({
            visibleArchive: true
        });
    }

    showModalRestore = () => {
        this.setState({
            visibleRestore: true
        })
    }

    submitArchiveYess = async () => {
        await this.setState({
            visibleArchive: false,
        });
        const { productInfo } = this.state;
        this.props.submitArchiveYess(productInfo.productId);

    }

    submitRestoreYess = async () => {
        await this.setState({
            visibleRestore: false,
        });
        const { productInfo } = this.state;
        this.props.submitRestoreYess(productInfo.productId);
    }

    // ---------- Render --------

    render() {
        const { title, visible, onRequestClose, language } = this.props;
        const { categoryId, name, description, sku,
            quantity, minThreshold, maxThreshold, price, isDisabled, needToorDer
        } = this.state.productInfo;
        const tempHeight = checkIsTablet() ? ScaleSzie(390) : ScaleSzie(480);
        const tempBtnHieght = checkIsTablet() ? 35 : 45;
        const tempBtnWidth = checkIsTablet() ? 150 : 200;
        const tempFooterHieght = checkIsTablet() ? ScaleSzie(55) : ScaleSzie(70);

        return (
            <PopupParent
                title={title}
                visible={visible}
                onRequestClose={() => onRequestClose()}
            >
                <View style={{
                    height: tempHeight, backgroundColor: '#fff',
                    borderBottomLeftRadius: ScaleSzie(15),
                    borderBottomRightRadius: ScaleSzie(15),
                    paddingHorizontal: ScaleSzie(30)
                }} >
                    <View style={{ flex: 1 }} >
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="always"
                        >
                            <View style={{ height: ScaleSzie(13) }} />
                            {/* ---- start ---- */}
                            <TouchableOpacity activeOpacity={1}>
                                <ItemDetail
                                    title={localize('Product', language)}
                                    value={name}
                                />
                                <ItemDetail
                                    title={localize('SKU Number', language)}
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
                                    title={localize('Need To Order', language)}
                                    value={needToorDer}
                                />
                                <ItemDetail
                                    title={localize('Low Threshold', language)}
                                    value={minThreshold}
                                />
                                <ItemDetail
                                    title={localize('High Threshold', language)}
                                    value={maxThreshold}
                                />
                                <ItemDetail
                                    title={`${localize('Price', language)} ($)`}
                                    value={`$ ${price}`}
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
                                    height: ScaleSzie(70), borderWidth: 1, borderColor: '#C5C5C5',
                                    paddingLeft: ScaleSzie(10), backgroundColor: '#FAFAFA', paddingTop: ScaleSzie(5)
                                }} >
                                    <TextInput
                                        placeholder=""
                                        style={{
                                            flex: 1, fontSize: ScaleSzie(16), color: "#000",
                                            padding: 0,
                                            textAlignVertical: "top"
                                        }}
                                        multiline={true}
                                        value={description}
                                        editable={false}
                                    />
                                </View>
                            </TouchableOpacity>

                            {/* -----  */}
                            <TouchableOpacity activeOpacity={1} style={{ height: ScaleSzie(250), }} />
                        </ScrollView>
                    </View>
                    {/* ---- Footer ---- */}
                    <View style={{ height: tempFooterHieght, flexDirection: 'row', justifyContent: 'space-evenly' }} >
                        <ButtonCustom
                            width={tempBtnWidth}
                            height={tempBtnHieght}
                            backgroundColor="#F1F1F1"
                            title={localize('Edit', language)}
                            textColor="#6A6A6A"
                            onPress={this.showModalEditProduct}
                            style={{
                                borderRadius: ScaleSzie(2),
                                borderColor: '#C5C5C5',
                                borderWidth: 1,
                            }}
                            styleText={{
                                fontSize: ScaleSzie(16),
                                fontWeight: '500'
                            }}
                        />
                        {
                            isDisabled === 0 || isDisabled === 'Active' ?
                                <ButtonCustom
                                    width={tempBtnWidth}
                                    height={tempBtnHieght}
                                    backgroundColor="#F1F1F1"
                                    title={localize('Archive', language)}
                                    textColor="#6A6A6A"
                                    onPress={this.showModalArchive}
                                    style={{
                                        borderRadius: ScaleSzie(2),
                                        borderColor: '#C5C5C5',
                                        borderWidth: 1,
                                    }}
                                    styleText={{
                                        fontSize: ScaleSzie(16),
                                        fontWeight: '500'
                                    }}
                                /> : <ButtonCustom
                                    width={tempBtnWidth}
                                    height={tempBtnHieght}
                                    backgroundColor="#F1F1F1"
                                    title={localize('Restore', language)}
                                    textColor="#6A6A6A"
                                    onPress={this.showModalRestore}
                                    style={{
                                        borderRadius: ScaleSzie(2),
                                        borderColor: '#C5C5C5',
                                        borderWidth: 1,
                                    }}
                                    styleText={{
                                        fontSize: ScaleSzie(16),
                                        fontWeight: '500'
                                    }}
                                />
                        }

                    </View>
                </View>
                <PopupConfirm
                    visible={this.state.visibleArchive}
                    title={localize('Confirmation', language)}
                    message={`${localize('Do you want to Archive this Product', language)}?`}
                    onRequestClose={() => this.setState({ visibleArchive: false })}
                    confimYes={this.submitArchiveYess}
                />
                <PopupConfirm
                    visible={this.state.visibleRestore}
                    title={localize('Confirmation', language)}
                    message={`${localize('Do you want to Restore this Product', language)}?`}
                    onRequestClose={() => this.setState({ visibleRestore: false })}
                    confimYes={this.submitRestoreYess}
                />
            </PopupParent>
        );
    }
}

const ItemDetail = ({ title, value }) => {
    return (
        <View style={{ minHeight: ScaleSzie(30), flexDirection: 'row', marginBottom: ScaleSzie(10) }} >
            <View style={{ flex: 1, }} >
                <Text style={styles.textCommon} >
                    {title}
                </Text>
            </View>
            <View style={{ flex: 1, }} >
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
        fontSize: ScaleSzie(16)
    },
    textValue: {
        color: '#404040',
        fontSize: ScaleSzie(18)
    }
})

export default PopupDetailProduct;



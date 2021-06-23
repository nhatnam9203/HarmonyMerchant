import React from 'react';
import {
    View,
    Text,
    TextInput,
    Alert,
    Keyboard,
    Switch
} from 'react-native';

import ButtonCustom from './ButtonCustom';
import PopupParent from './PopupParent';
import { Dropdown } from './react-native-material-dropdown';
import { ScaleSzie, localize } from '@utils';
import connectRedux from '@redux/ConnectRedux';

class PopupEditAddCategories extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            category: {
                categoryType: '',
                name: '',
                isShowSignInApp: true
            },
            customStyle: {},
        }
    }

    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardWillShow', this.keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardWillHide', this.keyboardDidHide);
    }

    keyboardDidShow = async () => {
        await this.setState({
            customStyle: {
                justifyContent: 'flex-start',
                paddingTop: ScaleSzie(50)
            }
        });
    }

    keyboardDidHide = async () => {
        await this.setState({
            customStyle: {}
        });
    }

    setStateDefaultFromParent = async () => {
        await this.setState({
            category: {
                categoryType: '',
                name: '',
                isShowSignInApp: true
            }
        })
    }

    setCategoryFromParent = async (category) => {
        await this.setState({
            category
        })
    }

    updateCategoryInfo(key, value, keyParent = '') {
        const { category } = this.state;
        if (keyParent !== '') {
            const temptParent = category[keyParent];
            const temptChild = { ...temptParent, [key]: value };
            const temptUpdate = { ...category, [keyParent]: temptChild };
            this.setState({
                category: temptUpdate
            })
        } else {
            const temptUpdate = { ...category, [key]: value };
            this.setState({
                category: temptUpdate
            })
        }
    }


    checkInputCategory = () => {
        const { categoryType, name } = this.state.category;
        if (categoryType === '') {
            Alert.alert(` Please select Category Type.`);
            return;
        }
        if (name === '') {
            Alert.alert(`Please enter Category Name.`);
            return;
        } else {
            this.props.confimYes(this.state.category);
        }
    }

    render() {
        const { title, visible, titleButton, onRequestClose, language } = this.props;
        const { categoryType, name } = this.state.category;

        const tempHeight = categoryType === "Service" ? ScaleSzie(250) : ScaleSzie(200);

        return (
            <PopupParent
                title={title}
                visible={visible}
                onRequestClose={() => onRequestClose()}
                style={this.state.customStyle}
            >
                <View style={{
                    height: tempHeight, backgroundColor: '#fff',
                    borderBottomLeftRadius: ScaleSzie(15), borderBottomRightRadius: ScaleSzie(15)
                }} >
                    <View style={{
                        flex: 1, paddingHorizontal: ScaleSzie(20),
                        paddingVertical: ScaleSzie(12)
                    }} >
                        <View style={{ flex: 1 }} >
                            <Text style={{ color: '#404040', fontSize: ScaleSzie(12), marginBottom: ScaleSzie(10) }} >
                                {`${localize('Category Type', language)}*`}
                            </Text>
                            <View style={{ width: ScaleSzie(200), height: ScaleSzie(35), }} >
                                <Dropdown
                                    label='Type'
                                    data={[{ value: 'Product' }, { value: 'Service' }]}
                                    value={categoryType}
                                    onChangeText={(value) => this.updateCategoryInfo('categoryType', value)}
                                    containerStyle={{
                                        backgroundColor: '#F1F1F1',
                                        borderWidth: 1,
                                        borderColor: '#C5C5C5',
                                        flex: 1
                                    }}
                                />
                            </View>
                            <Text style={{ color: '#404040', fontSize: ScaleSzie(12), marginBottom: ScaleSzie(10), marginTop: ScaleSzie(7) }} >
                                {`${localize('Category Name', language)}*`}
                            </Text>
                            <View style={{
                                height: ScaleSzie(35), borderWidth: 1, borderColor: '#C5C5C5',
                                paddingLeft: ScaleSzie(10)
                            }} >
                                <TextInput
                                    placeholder={localize('Gel Nails', language)}
                                    style={{ flex: 1, fontSize: ScaleSzie(16), padding: 0, }}
                                    value={name}
                                    onChangeText={(value) => this.updateCategoryInfo('name', value)}
                                />
                            </View>
                            {/* ------------------ Display on Sign In App ---------------  */}
                            {categoryType === "Service" ?
                                <>
                                    <Text style={{ color: '#404040', fontSize: ScaleSzie(12), marginBottom: ScaleSzie(10), marginTop: ScaleSzie(7) }} >
                                        {localize('Display on Sign In App', language)}
                                    </Text>
                                    <Switch
                                        trackColor={{ false: "#767577", true: "#0764B0" }}
                                        ios_backgroundColor="#E5E5E5"
                                        onValueChange={(value) => this.updateCategoryInfo('isShowSignInApp', value)}
                                        value={this.state?.category?.isShowSignInApp}
                                    />
                                </> : <View />
                            }

                        </View>
                    </View>
                    <View style={{
                        height: ScaleSzie(45), alignItems: 'center'
                    }} >

                        <ButtonCustom
                            width={150}
                            height={35}
                            backgroundColor="#0764B0"
                            title={titleButton}
                            textColor="#fff"
                            onPress={this.checkInputCategory}
                            style={{ borderRadius: ScaleSzie(2) }}
                            styleText={{
                                fontSize: ScaleSzie(14)
                            }}
                        />

                    </View>
                </View>
            </PopupParent>
        );
    }

    componentWillUnmount() {
        this.keyboardDidShowListener?.remove();
        this.keyboardDidHideListener?.remove();
    }

}

const mapStateToProps = state => ({
    language: state.dataLocal.language,
})

export default connectRedux(mapStateToProps, PopupEditAddCategories);




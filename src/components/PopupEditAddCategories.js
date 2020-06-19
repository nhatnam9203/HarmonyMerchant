import React from 'react';
import {
    View,
    Text,
    TextInput,
    Alert
} from 'react-native';

import ButtonCustom from './ButtonCustom';
import PopupParent from './PopupParent';
import { Dropdown } from './react-native-material-dropdown';
import { scaleSzie,localize } from '@utils';
import connectRedux from '@redux/ConnectRedux';

class PopupEditAddCategories extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            category: {
                categoryType: '',
                name: ''
            }
        }
    }

    setStateDefaultFromParent =async () => {
       await this.setState({
            category: {
                categoryType: '',
                name: ''
            }
        })
    }

    setCategoryFromParent =async (category) => {
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
        if (categoryType === ''){
            Alert.alert(` Please select Category Type.`);
            return;
        }
        if (name === '') {
            Alert.alert(`Please enter Category Name!`);
            return;
        } else {
            this.props.confimYes(this.state.category);
        }
    }

    render() {
        const { title, visible, titleButton, onRequestClose ,language} = this.props;
        const { categoryType, name } = this.state.category;

        return (
            <PopupParent
                title={title}
                visible={visible}
                onRequestClose={() => onRequestClose()}
                style={{ justifyContent: 'flex-start', paddingTop: scaleSzie(70) }}
            >
                <View style={{
                    height: scaleSzie(190), backgroundColor: '#fff',
                    borderBottomLeftRadius: scaleSzie(15), borderBottomRightRadius: scaleSzie(15)
                }} >
                    <View style={{
                        flex: 1, paddingHorizontal: scaleSzie(20),
                        paddingVertical: scaleSzie(12)
                    }} >
                        <View style={{ flex: 1 }} >
                            <Text style={{ color: '#404040', fontSize: scaleSzie(12), marginBottom: scaleSzie(10) }} >
                                {`${localize('Category Type', language)}*`}
                        </Text>
                            <View style={{ width: scaleSzie(200), height: scaleSzie(30), }} >
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
                            <Text style={{ color: '#404040', fontSize: scaleSzie(12), marginBottom: scaleSzie(10), marginTop: scaleSzie(7) }} >
                                {`${localize('Category Name', language)}*`}
                            </Text>
                            <View style={{
                                height: scaleSzie(30), borderWidth: 1, borderColor: '#C5C5C5',
                                paddingLeft: scaleSzie(10)
                            }} >
                                <TextInput
                                    placeholder={localize('Gel Nails', language)}
                                    style={{ flex: 1, fontSize: scaleSzie(16) }}
                                    value={name}
                                    onChangeText={(value) => this.updateCategoryInfo('name', value)}
                                />
                            </View>
                        </View>
                    </View>
                    <View style={{
                        height: scaleSzie(45), alignItems: 'center'
                    }} >

                        <ButtonCustom
                            width={150}
                            height={35}
                            backgroundColor="#0764B0"
                            title={titleButton}
                            textColor="#fff"
                            onPress={this.checkInputCategory}
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

const mapStateToProps = state => ({
    language: state.dataLocal.language,
})

export default connectRedux(mapStateToProps, PopupEditAddCategories);




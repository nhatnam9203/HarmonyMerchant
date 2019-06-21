import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Alert
} from 'react-native';

import { ButtonCustom, PopupParent, Dropdown } from '@components';
import { scaleSzie } from '@utils';

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

    setCategoryFromParent = (category) => {
        // console.log('setCategoryFromParent : ', category);
        this.setState({
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
        if (categoryType === '' || name === '') {
            Alert.alert(`Please enter full info!`);
        } else {
            this.props.confimYes(this.state.category);
        }
    }

    render() {
        const { title, visible, titleButton, onRequestClose } = this.props;
        const { categoryType, name } = this.state.category
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
                                Category Type
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
                                        borderColor: '#6A6A6A',
                                        flex: 1
                                    }}
                                />
                            </View>
                            <Text style={{ color: '#404040', fontSize: scaleSzie(12), marginBottom: scaleSzie(10), marginTop: scaleSzie(7) }} >
                                Category Name
                            </Text>
                            <View style={{
                                height: scaleSzie(30), borderWidth: 1, borderColor: '#6A6A6A',
                                paddingLeft: scaleSzie(10)
                            }} >
                                <TextInput
                                    placeholder="Gel Nails"
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    footer: {
        height: scaleSzie(50),
        flexDirection: 'row',
    },
    buttonContainer: {
        flex: 1,
        alignItems: 'center'
    },
})

export default PopupEditAddCategories;


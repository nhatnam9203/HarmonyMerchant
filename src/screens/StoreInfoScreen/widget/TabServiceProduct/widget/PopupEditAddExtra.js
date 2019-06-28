import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Dimensions,
    ScrollView,
    Alert
} from 'react-native';
import { TextInputMask } from 'react-native-masked-text';

import { ButtonCustom, PopupParent, Dropdown } from '@components';
import { scaleSzie } from '@utils';

class PopupEditAddExtra extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            extraInfo: {
                name: "",
                description: "",
                duration: '',
                price: '',
                isDisable: 'Active'
            }
        }

        this.durationRef = React.createRef();
    }

    setStateDefaultFromParent = () => {
        this.setState({
            extraInfo: {
                name: "",
                description: "",
                duration: '',
                price: '',
                isDisable: 'Active'
            }
        })
    }

    setExtraFromParent = (extra) => {
        // console.log('setExtraFromParent : ', extra);
        this.setState({
            extraInfo: { ...extra, isDisable: extra.isDisabled === 0 ? 'Active' : 'Disable' }
        })
    }

    updateExtraInfo(key, value, keyParent = '') {
        const { extraInfo } = this.state;
        if (keyParent !== '') {
            const temptParent = extraInfo[keyParent];
            const temptChild = { ...temptParent, [key]: value };
            const temptUpdate = { ...extraInfo, [keyParent]: temptChild };
            this.setState({
                extraInfo: temptUpdate
            })
        } else {
            const temptUpdate = { ...extraInfo, [key]: value };
            this.setState({
                extraInfo: temptUpdate
            })
        }
    }

    doneAddExtra = () => {
        const { extraInfo } = this.state;
        const temptExtraInfo = {
            ...extraInfo, duration: this.durationRef.current.state.value,
            isDisable: extraInfo.isDisable === 'Active' ? 0 : 1
        };
        const arrayKey = Object.keys(temptExtraInfo);
        let keyError = "";
        for (let i = 0; i <= arrayKey.length - 1; i++) {
            if (temptExtraInfo[arrayKey[i]] === '') {
                keyError = arrayKey[i];
                break;
            }
        }

        if (keyError != "") {
            Alert.alert(`${strings[keyError]}`);
        } else {
            if (this.props.isEdit) {
                this.props.editExtra({ ...temptExtraInfo, isDisabled: temptExtraInfo.isDisable });
            } else {
                this.props.doneAddExtra({ ...temptExtraInfo, isDisabled: temptExtraInfo.isDisable });
            }

        }
    }

    render() {
        const { title, visible, onRequestClose, isEdit } = this.props;
        const { name, description, price, isDisable } = this.state.extraInfo;
        const temptTitleButton = isEdit ? 'Save' : 'Done';
        return (
            <PopupParent
                title={title}
                visible={visible}
                onRequestClose={() => onRequestClose()}
                style={{ justifyContent: 'flex-start', paddingTop: scaleSzie(20) }}
            >
                <View style={{
                    height: scaleSzie(400), backgroundColor: '#fff',
                    borderBottomLeftRadius: scaleSzie(15), borderBottomRightRadius: scaleSzie(15),
                    paddingHorizontal: scaleSzie(30)
                }} >
                    <View style={{ flex: 1, }} >
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                        >

                            {/* ------ Extra ---- */}
                            <Text style={{ color: '#404040', fontSize: scaleSzie(12), marginBottom: scaleSzie(10), marginTop: scaleSzie(20) }} >
                                Extra name
                            </Text>
                            <View style={{
                                height: scaleSzie(30), borderWidth: 1, borderColor: '#6A6A6A',
                                paddingLeft: scaleSzie(10),
                            }} >
                                <TextInput
                                    placeholder="Extra name"
                                    style={{ flex: 1, fontSize: scaleSzie(16) }}
                                    value={name}
                                    onChangeText={(value) => this.updateExtraInfo('name', value)}
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
                                    onChangeText={value => this.updateExtraInfo('description', value)}
                                />
                            </View>
                            <Text style={{ color: '#404040', fontSize: scaleSzie(12), marginBottom: scaleSzie(10), marginTop: scaleSzie(7) }} >
                                Duration
                            </Text>
                            <ItemTime
                                ref={this.durationRef}
                                title="Minutes"
                                value={this.state.extraInfo.duration}

                            />
                            <View style={{ height: scaleSzie(70), flexDirection: 'row' }} >
                                <View style={{ flex: 1, paddingRight: scaleSzie(50) }}  >
                                    <Text style={{ color: '#404040', fontSize: scaleSzie(12), marginBottom: scaleSzie(10), marginTop: scaleSzie(7) }} >
                                        Price
                                    </Text>
                                    <View style={{
                                        height: scaleSzie(30), paddingHorizontal: scaleSzie(5),
                                        borderWidth: 1, borderColor: '#6A6A6A', flexDirection: 'row'
                                    }} >
                                        <TextInputMask
                                            type="only-numbers"
                                            style={{ flex: 1, fontSize: scaleSzie(16) }}
                                            placeholder="$ 100"
                                            value={price}
                                            onChangeText={value => this.updateExtraInfo('price', value)}
                                        />
                                    </View>
                                </View>
                                {/* ------ */}
                                <View>
                                    <Text style={{ color: '#404040', fontSize: scaleSzie(12), marginBottom: scaleSzie(10), marginTop: scaleSzie(7) }} >
                                        Status
                                    </Text>
                                    <View style={{
                                        height: scaleSzie(30), width: scaleSzie(90),
                                        flexDirection: 'row'
                                    }} >
                                        <Dropdown
                                            label='Active'
                                            data={[{ value: 'Active' }, { value: 'Disable' }]}
                                            value={isDisable}
                                            onChangeText={(value) => this.updateExtraInfo('isDisable', value)}
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
                            onPress={this.doneAddExtra}
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

class ItemTime extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: this.props.value
        }
    }

    render() {
        const { title } = this.props;
        const { value } = this.state;
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
                        <TextInputMask
                            type="only-numbers"
                            placeholder='10'
                            style={{ flex: 1, fontSize: scaleSzie(16) }}
                            value={value}
                            onChangeText={(value) => this.setState({ value })}
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
}

const strings = {
    name: 'Mising info : Name service',
    description: 'Mising info : Description',
    duration: 'Mising info : Duration',
    price: 'Mising info : Price',
    status: 'Mising info :Status',
}

// const mapStateToProps = state => ({
//     categoriesByMerchant: state.category.categoriesByMerchant
// });
// export default connectRedux(mapStateToProps, PopupEditAddExtra);
export default PopupEditAddExtra



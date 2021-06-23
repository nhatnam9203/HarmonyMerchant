import React from 'react';
import {
    View,
    TextInput,
} from 'react-native';
import { TextInputMask } from 'react-native-masked-text';

import {
     Text,Dropdown
} from '@components';
import { scaleSize,ListCodeAreaPhone } from '@utils';

const ItemAdminInfo = ({ title, placeholder, value, onChangeText, secureTextEntry , type,onFocus,
    typeSocial,mark, maxLength,style,autoFocus}) => {
    return (
        <View style={[{
            flexDirection: 'row',
            height: scaleSize(36),
            paddingHorizontal: scaleSize(25),
            marginTop: scaleSize(25)
        }]} >
            <View style={{ width: scaleSize(150), justifyContent: 'center' }} >
                <Text style={[{
                    color: '#404040',
                    fontSize: scaleSize(14),
                    fontWeight: '600',

                },style]}  >
                    {`${title}`}
                </Text>
            </View>

            <View style={{ flex: 1, borderWidth: 1, borderColor: '#C5C5C5', paddingLeft: scaleSize(5) }} >
            {
                    type ? <TextInputMask
                    type={typeSocial ? typeSocial :"only-numbers"}
                    options={{
                        mask: mark ? mark : null
                    }}
                        style={{ flex: 1, fontSize: scaleSize(14), color: '#404040', }}
                        placeholder={placeholder}
                        value={value}
                        onChangeText={(value => onChangeText(value))}
                        secureTextEntry={secureTextEntry}
                        maxLength={maxLength ? maxLength : null}
                        onFocus={() => onFocus()}
                        autoFocus={autoFocus}
                    /> : <TextInput
                            style={{ flex: 1, fontSize: scaleSize(14), color: '#404040', }}
                            placeholder={placeholder}
                            value={value}
                            onChangeText={(value => onChangeText(value))}
                            secureTextEntry={secureTextEntry}
                            maxLength={maxLength ? maxLength : null}
                            onFocus={() => onFocus()}
                            autoFocus={autoFocus}
                        />
                }
            </View>
        </View>
    );
}

class ItemAdminCellPhone extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            codeAreaPhone:  '+1'
        }
    }

    setcodeAreaPhoneFromParent = async (code) =>{
        await this.setState({
            codeAreaPhone: code
        })
    }   

    render() {
        const { title, placeholder, value, onChangeText, secureTextEntry, maxLength,onFocus,style } = this.props;
        const {codeAreaPhone} = this.state;
        return (
            <View style={[{
                flexDirection: 'row',
                height: scaleSize(36),
                paddingHorizontal: scaleSize(25),
                marginTop: scaleSize(25)
            },style]} >
                <View style={{ width: scaleSize(150), justifyContent: 'center' }} >
                    <Text style={{
                        color: '#404040',
                        fontSize: scaleSize(14),
                        fontWeight: '600',

                    }}  >
                        {`${title}`}
                    </Text>
                </View>

                <View style={{
                    flex: 1, flexDirection: 'row'
                }} >
                    <View style={{ width: scaleSize(60), backgroundColor: 'red' }} >
                        <Dropdown
                            label={'+1'}
                            data={ListCodeAreaPhone}
                            value={codeAreaPhone}
                            onChangeText={(codeAreaPhone) => this.setState({codeAreaPhone})}
                            containerStyle={{
                                backgroundColor: '#fff',
                                borderWidth: 1,
                                borderColor: '#C5C5C5',
                                flex: 1
                            }}
                        />
                    </View>
                    <View style={{ width: scaleSize(8) }} />
                    <View style={{ flex: 1, borderWidth: 1, borderColor: '#C5C5C5', paddingHorizontal: scaleSize(10) }} >
                    <TextInputMask
                           type={'custom'}
                           options={{
                            mask: '999-999-9999'
                           }}
                            style={{ flex: 1, fontSize: scaleSize(14), color: '#404040', }}
                            placeholder={placeholder}
                            value={value}
                            onChangeText={(value => onChangeText(value))}
                            secureTextEntry={secureTextEntry}
                            maxLength={maxLength ? maxLength : null}
                            onFocus={() => onFocus()}
                            keyboardType="numeric"
                        />
                    </View>

                </View>
            </View>
        );
    }

}

module.exports = {
    ItemAdminInfo,
    ItemAdminCellPhone
}
import React from 'react';
import {
    View,
    TextInput,
} from 'react-native';
import { TextInputMask } from 'react-native-masked-text';

import {
     Text,Dropdown
} from '@components';
import { scaleSzie,ListCodeAreaPhone } from '@utils';

const ItemAdminInfo = ({ title, placeholder, value, onChangeText, secureTextEntry , type,onFocus,
    typeSocial,mark,
    maxLength}) => {
    return (
        <View style={{
            flexDirection: 'row',
            height: scaleSzie(36),
            paddingHorizontal: scaleSzie(25),
            marginTop: scaleSzie(25)
        }} >
            <View style={{ width: scaleSzie(150), justifyContent: 'center' }} >
                <Text style={{
                    color: '#404040',
                    fontSize: scaleSzie(14),
                    fontWeight: '600',

                }}  >
                    {`${title}`}
                </Text>
            </View>

            <View style={{ flex: 1, borderWidth: 1, borderColor: '#C5C5C5', paddingLeft: scaleSzie(5) }} >
            {
                    type ? <TextInputMask
                    type={typeSocial ? typeSocial :"only-numbers"}
                    options={{
                        mask: mark ? mark : null
                    }}
                        style={{ flex: 1, fontSize: scaleSzie(14), color: '#404040', }}
                        placeholder={placeholder}
                        value={value}
                        onChangeText={(value => onChangeText(value))}
                        secureTextEntry={secureTextEntry}
                        maxLength={maxLength ? maxLength : null}
                        onFocus={() => onFocus()}
                    /> : <TextInput
                            style={{ flex: 1, fontSize: scaleSzie(14), color: '#404040', }}
                            placeholder={placeholder}
                            value={value}
                            onChangeText={(value => onChangeText(value))}
                            secureTextEntry={secureTextEntry}
                            maxLength={maxLength ? maxLength : null}
                            onFocus={() => onFocus()}
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
        const { title, placeholder, value, onChangeText, secureTextEntry, maxLength,onFocus } = this.props;
        const {codeAreaPhone} = this.state;
        return (
            <View style={{
                flexDirection: 'row',
                height: scaleSzie(36),
                paddingHorizontal: scaleSzie(25),
                marginTop: scaleSzie(25)
            }} >
                <View style={{ width: scaleSzie(150), justifyContent: 'center' }} >
                    <Text style={{
                        color: '#404040',
                        fontSize: scaleSzie(14),
                        fontWeight: '600',

                    }}  >
                        {`${title}`}
                    </Text>
                </View>

                <View style={{
                    flex: 1, flexDirection: 'row'
                }} >
                    <View style={{ width: scaleSzie(60), backgroundColor: 'red' }} >
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
                    <View style={{ width: scaleSzie(8) }} />
                    <View style={{ flex: 1, borderWidth: 1, borderColor: '#C5C5C5', paddingHorizontal: scaleSzie(10) }} >
                    <TextInputMask
                           type={'custom'}
                           options={{
                            mask: '999-999-9999'
                           }}
                            style={{ flex: 1, fontSize: scaleSzie(14), color: '#404040', }}
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
import React from 'react';
import {
    View,
    TextInput,
    Image
} from 'react-native';

import Button from './Button';
import Text from './Text';
import { scaleSize } from '../utils';
import IMAGE from '../resources';

export default class InputQuestionBusiness extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            isCheck: false
        }
        this.inputRef = React.createRef();
    }

    onPress = async () => {
        await this.setState(prevState => ({
            isCheck: !prevState.isCheck
        }), () => {
            this.props.changeStatusCheck(this.state.isCheck);
        });
    }


    render() {
        const { question, subYes, value, onFocus,
            onChangeText, secureTextEntry } = this.props;
        const { isCheck } = this.state;
        const temptIconNo = isCheck ? IMAGE.checkBoxEmpty : IMAGE.checkBox;
        const temptIconYes = isCheck ? IMAGE.checkBox : IMAGE.checkBoxEmpty;

        return (
            <View style={[{ marginBottom: scaleSize(30) }]} >
                <Text style={{ color: '#404040', fontSize: scaleSize(14) }} >
                    {question}
                </Text>
                <View style={{
                    height: scaleSize(30),
                    marginTop: scaleSize(5), paddingLeft: scaleSize(8), flexDirection: 'row',
                }} >
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }} >
                        <Button onPress={this.onPress} >
                            <Image source={temptIconNo}
                                style={{ width: scaleSize(15), height: scaleSize(15) }}
                            />
                        </Button>
                        <Text style={{
                            color: "#404040", fontSize: scaleSize(14),
                            marginLeft: scaleSize(10), marginRight: scaleSize(15)
                        }} >
                            No
                </Text>
                        <Button onPress={this.onPress} >
                            <Image source={temptIconYes}
                                style={{ width: scaleSize(15), height: scaleSize(15) }}
                            />
                        </Button>
                        <Text style={{
                            color: "#404040", fontSize: scaleSize(14), marginLeft: scaleSize(10),
                            marginRight: scaleSize(8)
                        }} >
                            {`Yes (${subYes})`}
                        </Text>
                    </View>

                    <View style={{
                        width: scaleSize(320), borderColor: '#C5C5C5', borderWidth: 1,
                        paddingLeft: scaleSize(10)
                    }} >
                        <TextInput
                            ref={this.inputRef}
                            style={{ flex: 1, fontSize: scaleSize(16) }}
                            placeholder={''}
                            editable={isCheck}
                            value={value}
                            onChangeText={(value => onChangeText(value))}
                            secureTextEntry={secureTextEntry}
                            onFocus={() => onFocus && onFocus()}
                        />
                    </View>


                </View>
            </View>
        );
    }


}
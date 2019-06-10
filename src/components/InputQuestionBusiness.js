import React from 'react';
import {
    View,
    TextInput,
    Image
} from 'react-native';

import Button from './Button';
import Text from './Text';
import { scaleSzie } from '../utils';
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
        const { question, subYes, value,
            onChangeText, secureTextEntry } = this.props;
        const { isCheck } = this.state;
        const temptIconNo = isCheck ? IMAGE.checkBoxEmpty : IMAGE.checkBox;
        const temptIconYes = isCheck ? IMAGE.checkBox : IMAGE.checkBoxEmpty;

        return (
            <View style={[{ marginBottom: scaleSzie(30) }]} >
                <Text style={{ color: '#404040', fontSize: scaleSzie(14) }} >
                    {question}
                </Text>
                <View style={{
                    height: scaleSzie(30),
                    marginTop: scaleSzie(5), paddingLeft: scaleSzie(8), flexDirection: 'row',
                }} >
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }} >
                        <Button onPress={this.onPress} >
                            <Image source={temptIconNo}
                                style={{ width: scaleSzie(15), height: scaleSzie(15) }}
                            />
                        </Button>
                        <Text style={{
                            color: "#404040", fontSize: scaleSzie(14),
                            marginLeft: scaleSzie(10), marginRight: scaleSzie(15)
                        }} >
                            No
                </Text>
                        <Button onPress={this.onPress} >
                            <Image source={temptIconYes}
                                style={{ width: scaleSzie(15), height: scaleSzie(15) }}
                            />
                        </Button>
                        <Text style={{
                            color: "#404040", fontSize: scaleSzie(14), marginLeft: scaleSzie(10),
                            marginRight: scaleSzie(8)
                        }} >
                            {`Yes (${subYes})`}
                        </Text>
                    </View>

                    <View style={{
                        width: scaleSzie(320), borderColor: '#6A6A6A', borderWidth: 1,
                        paddingLeft: scaleSzie(10)
                    }} >
                        <TextInput
                            ref={this.inputRef}
                            style={{ flex: 1, fontSize: scaleSzie(16) }}
                            placeholder={''}
                            editable={isCheck}
                            value={value}
                            onChangeText={(value => onChangeText(value))}
                            secureTextEntry={secureTextEntry}
                        />
                    </View>


                </View>
            </View>
        );
    }


}
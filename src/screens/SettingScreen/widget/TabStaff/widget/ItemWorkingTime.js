import React from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet
} from 'react-native';

import IMAGE from '@resources';
import { Dropdown, Button } from '@components';
import { scaleSzie } from '@utils';

let data = [{
    value: 'Banana',
}, {
    value: 'Mango',
}, {
    value: 'Pear',
}
];

export default class ItemWorkingTime extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isCheck: false,
            timeStart: '',
            timeEnd: ''
        }
    }

    onPress = () => {
        this.setState((prevState, props) => ({
            isCheck: !prevState.isCheck
        }));
    }

    render() {
        const { title, timeStart, timeEnd } = this.props;
        const { isCheck } = this.state;
        const temptIconCheck = isCheck ? IMAGE.checkBox : IMAGE.checkBoxEmpty;
        return (
            <View style={{
                flexDirection: 'row',
                height: scaleSzie(36),
                paddingHorizontal:scaleSzie(25),
                marginTop: scaleSzie(14)
            }} >
                <Button onPress={this.onPress} style={{ width: scaleSzie(30), justifyContent: 'center' }} >
                    <Image source={temptIconCheck} style={{ width: scaleSzie(15), height: scaleSzie(15) }} />
                </Button>

                <View style={{ width: scaleSzie(120), justifyContent: 'center' }} >
                    <Text style={{
                        color: '#404040',
                        fontSize: scaleSzie(14),
                        fontWeight: '600',
                    }}  >
                        {`${title}`}
                    </Text>
                </View>

                <View style={{ width: scaleSzie(150) }} >
                    <Dropdown
                        label={'08:00 AM'}
                        data={data}
                        value={timeStart}
                        onChangeText={(value) => this.setState({ timeStart: value })}
                        containerStyle={{
                            backgroundColor: '#F1F1F1',
                            borderWidth: 1,
                            borderColor: '#6A6A6A',
                            flex: 1
                        }}
                    />
                </View>
                <View style={{ justifyContent: 'center', paddingHorizontal: scaleSzie(8) }} >
                    <View style={{
                        backgroundColor: '#404040',
                        width: scaleSzie(12),
                        height: 1
                    }}  >
                    </View>
                </View>
                <View style={{ width: scaleSzie(150) }} >
                    <Dropdown
                        label={'09:00 AM'}
                        data={data}
                        value={timeEnd}
                        onChangeText={(value) => this.setState({ timeEnd: value })}
                        containerStyle={{
                            backgroundColor: '#F1F1F1',
                            borderWidth: 1,
                            borderColor: '#6A6A6A',
                            flex: 1
                        }}
                    />
                </View>
            </View>
        );
    }

}
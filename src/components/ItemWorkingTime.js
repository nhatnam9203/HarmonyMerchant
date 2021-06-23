import React from 'react';
import {
    View,
    Image,
    Text,
} from 'react-native';

import IMAGE from '@resources';
import { Dropdown } from './react-native-material-dropdown-clone';
import Button from './Button';
import { ScaleSzie, WorkingTime } from '@utils';

export default class ItemWorkingTime extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isCheck: true,
            timeStart: '',
            timeEnd: ''
        }
    }

    setStateFromParent = async ({isCheck, timeStart, timeEnd}) => {
        await this.setState({
            isCheck,
            timeStart,
            timeEnd
        })
    }

    async componentDidMount() {
        const { dataInit } = this.props;
        await this.setState({
            isCheck: dataInit.isCheck,
            timeStart: dataInit.timeStart,
            timeEnd: dataInit.timeEnd
        })
    }

    onPress = () => {
        this.setState((prevState, props) => ({
            isCheck: !prevState.isCheck
        }));
    }

    render() {
        const { title, dataInit } = this.props;
        const { isCheck, timeStart, timeEnd } = this.state;
        const temptIconCheck = isCheck ? IMAGE.checkBox : IMAGE.checkBoxEmpty;
 
        return (
            <View style={{
                flexDirection: 'row',
                height: ScaleSzie(36),
                paddingHorizontal: ScaleSzie(25),
                marginTop: ScaleSzie(14)
            }} >
                <Button onPress={this.onPress} style={{ width: ScaleSzie(30), justifyContent: 'center' }} >
                    <Image source={temptIconCheck} style={{ width: ScaleSzie(15), height: ScaleSzie(15) }} />
                </Button>

                <View style={{ width: ScaleSzie(120), justifyContent: 'center' }} >
                    <Text style={{
                        color: '#404040',
                        fontSize: ScaleSzie(14),
                        fontWeight: '600',
                    }}  >
                        {`${title}`}
                    </Text>
                </View>

                <View style={{ width: ScaleSzie(150) }} >
                    <Dropdown
                        label={'08:00 AM'}
                        data={WorkingTime}
                        value={timeStart}
                        onChangeText={(value) => this.setState({ timeStart: value })}
                        containerStyle={{
                            backgroundColor: '#F1F1F1',
                            borderWidth: 1,
                            borderColor: '#C5C5C5',
                            flex: 1
                        }}
                    />
                </View>
                <View style={{ justifyContent: 'center', paddingHorizontal: ScaleSzie(8) }} >
                    <View style={{
                        backgroundColor: '#404040',
                        width: ScaleSzie(12),
                        height: 1
                    }}  >
                    </View>
                </View>
                <View style={{ width: ScaleSzie(150) }} >
                    <Dropdown
                        label={'09:00 AM'}
                        data={WorkingTime}
                        value={timeEnd}
                        onChangeText={(value) => this.setState({ timeEnd: value })}
                        containerStyle={{
                            backgroundColor: '#F1F1F1',
                            borderWidth: 1,
                            borderColor: '#C5C5C5',
                            flex: 1
                        }}
                    />
                </View>
            </View>
        );
    }

}

import React from 'react';
import {
    View,
    Image,
    TouchableOpacity
} from 'react-native';

import { scaleSzie } from '@utils';
import { Text } from '@components';
import IMAGE from '@resources';

class ItemAmount extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            quanlity: 1
        }
    }

    resetStateFromParent = () => {
        this.setState({
            quanlity: 1
        })
    }

    subQuanlity = () => {
        if (this.state.quanlity > 1) {
            this.setState(prevState => ({
                quanlity: prevState.quanlity - 1
            }))
        }
    }

    plusQuanlity = () => {
        this.setState(prevState => ({
            quanlity: prevState.quanlity + 1
        }))
    }

    render() {
        const { quanlity } = this.state;
        const { price } = this.props
        return (
            <View style={{
                height: scaleSzie(68),
                borderBottomWidth: 3, borderBottomColor: '#fff',
                backgroundColor: '#0764B0',
            }} >
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                    paddingTop: scaleSzie(10),
                }} >
                    <TouchableOpacity onPress={this.subQuanlity} >
                        <Image
                            source={IMAGE.subAmount}
                            style={{ width: scaleSzie(25), height: scaleSzie(25) }}
                        />
                    </TouchableOpacity>
                    <View style={{
                        width: scaleSzie(90), borderColor: '#fff',
                        borderWidth: 3, borderRadius: scaleSzie(8), height: scaleSzie(30),
                        justifyContent: 'center', alignItems: 'center'
                    }} >
                        <Text style={{ color: '#fff', fontSize: scaleSzie(16), fontWeight: 'bold' }} >
                            {quanlity}
                        </Text>
                    </View>
                    <TouchableOpacity onPress={this.plusQuanlity} >
                        <Image
                            source={IMAGE.plusAmount}
                            style={{ width: scaleSzie(25), height: scaleSzie(25) }}
                        />
                    </TouchableOpacity>
                </View>

                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                    <Text style={{ color: '#fff', fontSize: scaleSzie(12), fontWeight: "bold" }} >
                        {`$ ${price}`}
                    </Text>
                </View>
            </View>
        );
    }

}

export default ItemAmount;


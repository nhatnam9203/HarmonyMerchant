import React from 'react';
import {
    View,
    Image,
    TouchableOpacity
} from 'react-native';

import { ScaleSzie } from '@utils';
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
                height: ScaleSzie(68),
                borderBottomWidth: 3, borderBottomColor: '#fff',
                backgroundColor: '#0764B0',
            }} >
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                    paddingTop: ScaleSzie(10),
                }} >
                    <TouchableOpacity onPress={this.subQuanlity} >
                        <Image
                            source={IMAGE.subAmount}
                            style={{ width: ScaleSzie(25), height: ScaleSzie(25) }}
                        />
                    </TouchableOpacity>
                    <View style={{
                        width: ScaleSzie(90), borderColor: '#fff',
                        borderWidth: 3, borderRadius: ScaleSzie(8), height: ScaleSzie(30),
                        justifyContent: 'center', alignItems: 'center'
                    }} >
                        <Text style={{ color: '#fff', fontSize: ScaleSzie(16), fontWeight: 'bold' }} >
                            {quanlity}
                        </Text>
                    </View>
                    <TouchableOpacity onPress={this.plusQuanlity} >
                        <Image
                            source={IMAGE.plusAmount}
                            style={{ width: ScaleSzie(25), height: ScaleSzie(25) }}
                        />
                    </TouchableOpacity>
                </View>

                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                    <Text style={{ color: '#fff', fontSize: ScaleSzie(12), fontWeight: "bold" }} >
                        {`$ ${price}`}
                    </Text>
                </View>
            </View>
        );
    }

}

export default ItemAmount;


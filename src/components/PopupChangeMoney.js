import React from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet
} from 'react-native';

import ButtonCustom from './ButtonCustom';
import PopupParent from './PopupParent';
import { scaleSzie } from '../utils';

class PopupChangeMoney extends React.Component {

    constructor(props){
        super(props);
        this.state ={
            cashBack : '0.00'
        }
    }

    setStateFromParent =async (cashBack) =>{
        await this.setState({
            cashBack
        })
    }

    render() {
        const { title, visible, onRequestClose, confimOK } = this.props;
        const {cashBack} = this.state;
        return (
            <PopupParent
                title={title}
                visible={visible}
                onRequestClose={() => onRequestClose()}
            >
                <View style={{
                    height: scaleSzie(130), backgroundColor: '#fff',
                    borderBottomLeftRadius: scaleSzie(15), borderBottomRightRadius: scaleSzie(15)
                }} >
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                        <Text style={{ color: '#404040', fontSize: scaleSzie(18) }} >
                            {`Change : $ ${cashBack}`}
                        </Text>
                    </View>
                    <View style={{
                        height: scaleSzie(45), alignItems: 'center'
                    }} >
                        <ButtonCustom
                            width={'30%'}
                            height={35}
                            backgroundColor="#0764B0"
                            title="OK"
                            textColor="#fff"
                            onPress={() => confimOK()}
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

export default PopupChangeMoney;

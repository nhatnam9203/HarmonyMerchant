import React from 'react';
import {
    View,
    Image,
    Text,
    Platform,
    Keyboard
} from 'react-native';

import ButtonCustom from './ButtonCustom';
import Button from './Button';
import { ScaleSzie } from '../utils';
import IMAGE from '../resources';

export default class FooterTab extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            isShowFooter: true
        }
    }

    componentDidMount() {
        if (Platform.OS === "android") {
            this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
            this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);
        }
    }

    keyboardDidShow = async () => {
        await this.setState({
            isShowFooter: false
        })
    }

    keyboardDidHide = async () => {
        await this.setState({
            isShowFooter: true
        })
    }

    renderButtonAdd() {
        return (
            <View style={{
                height: ScaleSzie(45),
                paddingHorizontal: ScaleSzie(15), paddingVertical: ScaleSzie(4)
            }} >
                <Button onPress={() => this.props.addNew()} style={{
                    flex: 1, backgroundColor: '#4CD964',
                    borderWidth: 1, borderColor: '#707070', borderRadius: ScaleSzie(4),
                    justifyContent: 'center', alignItems: 'center', flexDirection: 'row'
                }} >
                    <Image source={IMAGE.addStaff} style={{ width: ScaleSzie(18), height: ScaleSzie(18) }} />
                    <Text style={{
                        color: '#fff', fontSize: ScaleSzie(18), fontWeight: 'bold',
                        marginLeft: ScaleSzie(8)
                    }} >
                        ADD NEW
                </Text>
                </Button>
            </View>
        );
    }

    renderFooter() {
        return (
            <View style={{ height: ScaleSzie(50), flexDirection: 'row', }} >
                <View style={{ flex: 1, alignItems: 'center' }} >
                    <ButtonCustom
                        width={ScaleSzie(250)}
                        height={40}
                        backgroundColor="#F1F1F1"
                        title="BACK"
                        textColor="#6A6A6A"
                        onPress={() =>this.props.backTab()}
                        style={{ borderWidth: 1, borderColor: '#C5C5C5' }}
                    />
                </View>
                <View style={{ flex: 1, alignItems: 'center' }} >
                    <ButtonCustom
                        width={ScaleSzie(250)}
                        height={40}
                        backgroundColor="#0764B0"
                        title="NEXT"
                        textColor="#fff"
                        onPress={()=>this.props.nextTab()}
                    />
                </View>
            </View>
        );
    }



    render() {
        const {isNotShowBtnAdd} = this.props;
        if(!this.state.isShowFooter){
            return null;
        }

        return (
            <View>
                {isNotShowBtnAdd ? <View /> : this.renderButtonAdd()}
                {this.renderFooter()}
            </View>
        );
    }

    componentWillUnmount() {
        if (Platform.OS === "android") {
            this.keyboardDidShowListener?.remove();
            this.keyboardDidHideListener?.remove();
        }
    }

}
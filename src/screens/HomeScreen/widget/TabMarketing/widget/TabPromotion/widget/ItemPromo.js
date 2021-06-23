import React from 'react';
import {
    View,
    Image,
    Dimensions
} from 'react-native';
import Collapsible from 'react-native-collapsible';

import { ScaleSzie } from '@utils';
import IMAGE from '@resources';
import { Button, Text } from '@components';

const { width } = Dimensions.get('window');

class ItemPromo extends React.Component {
    constructor(props) {
        super(props);
    }

    selectCheckBox = () => {
        this.props.checkSelectPromotion();
    }

    showContent =  () => {
        this.props.showContent();
    }

    render() {
        const { title, style, isSelected ,isShowContent} = this.props;
        const temptIconCheckBox = isSelected ? IMAGE.checkBox : IMAGE.checkBoxEmpty;
        return (
            <View style={[{ width: width, paddingHorizontal: ScaleSzie(15) }, style]} >
                <View style={{
                    paddingTop: ScaleSzie(10), backgroundColor: '#fff',
                    borderRadius: ScaleSzie(2)
                }} >
                    {/* ------- Header ------- */}
                    <View style={{
                        flexDirection: 'row',
                        paddingHorizontal: ScaleSzie(10),
                    }} >
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: "center" }} >
                            <Button onPress={this.selectCheckBox} style={{ marginRight: ScaleSzie(10) }} >
                                <Image
                                    source={temptIconCheckBox}
                                    style={{ width: ScaleSzie(20), height: ScaleSzie(20) }}
                                />
                            </Button>
                            <Text style={{ color: '#404040', fontSize: ScaleSzie(14),fontWeight:"bold" }} >
                                {title}
                            </Text>
                        </View>
                        <Button onPress={this.showContent} style={{
                            width: ScaleSzie(50), justifyContent: 'center',
                            alignItems: 'flex-end'
                        }} >{
                                !isShowContent ? <Image source={IMAGE.sub} style={{ width: ScaleSzie(18), height: ScaleSzie(5) }} />
                                    :
                                    <Image source={IMAGE.plus} style={{ width: ScaleSzie(18), height: ScaleSzie(18) }} />
                            }

                        </Button>
                    </View>
                    {/* ------- Line ---- */}
                    <View style={{ height: ScaleSzie(10), justifyContent: 'flex-end' }}  >
                        {
                            isShowContent ? <View style={{ height: 1, backgroundColor: '#A9A9A9' }} /> : <View />
                        }

                    </View>
                    {/* ------- Content ------- */}
                    <Collapsible collapsed={isShowContent}>
                        {this.props.children}
                    </Collapsible>
                </View>

            </View>
        );
    }

}

export default ItemPromo;


import React from 'react';
import {
    View,
    Image,
    Dimensions
} from 'react-native';
import Collapsible from 'react-native-collapsible';

import { scaleSize } from '@utils';
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
            <View style={[{ width: width, paddingHorizontal: scaleSize(15) }, style]} >
                <View style={{
                    paddingTop: scaleSize(10), backgroundColor: '#fff',
                    borderRadius: scaleSize(2)
                }} >
                    {/* ------- Header ------- */}
                    <View style={{
                        flexDirection: 'row',
                        paddingHorizontal: scaleSize(10),
                    }} >
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: "center" }} >
                            <Button onPress={this.selectCheckBox} style={{ marginRight: scaleSize(10) }} >
                                <Image
                                    source={temptIconCheckBox}
                                    style={{ width: scaleSize(20), height: scaleSize(20) }}
                                />
                            </Button>
                            <Text style={{ color: '#404040', fontSize: scaleSize(14),fontWeight:"bold" }} >
                                {title}
                            </Text>
                        </View>
                        <Button onPress={this.showContent} style={{
                            width: scaleSize(50), justifyContent: 'center',
                            alignItems: 'flex-end'
                        }} >{
                                !isShowContent ? <Image source={IMAGE.sub} style={{ width: scaleSize(18), height: scaleSize(5) }} />
                                    :
                                    <Image source={IMAGE.plus} style={{ width: scaleSize(18), height: scaleSize(18) }} />
                            }

                        </Button>
                    </View>
                    {/* ------- Line ---- */}
                    <View style={{ height: scaleSize(10), justifyContent: 'flex-end' }}  >
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


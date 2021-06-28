import React from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet
} from 'react-native';

import { Button } from '@components';
import { scaleSize } from '@utils';
import IMAGE from '@resources';

class ItemButton extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        const {title,onPress} = this.props;
        return (
            <Button onPress={() =>onPress() } style={{
                height: scaleSize(34), backgroundColor: '#F1F1F1',
                borderColor: '#C5C5C5', borderWidth: 1, borderRadius: 6,
                flexDirection: 'row',marginBottom:scaleSize(3)
            }} >
                <View style={{ flex: 1 ,justifyContent:'center',paddingLeft:scaleSize(10)}} >
                    <Text style={{ fontSize: scaleSize(14), color: '#0764B0', }} >
                   {title}
                    </Text>
                </View>
                <View style={{ justifyContent: 'center', paddingRight: scaleSize(12) }} >
                    <Image source={IMAGE.arrowRightButton} style={{ width: scaleSize(6), height: scaleSize(13) }} />
                </View>
            </Button>
        );
    }
}


export default ItemButton;


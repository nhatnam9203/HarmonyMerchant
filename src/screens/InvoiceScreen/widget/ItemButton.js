import React from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet
} from 'react-native';

import { Button } from '@components';
import { scaleSzie } from '@utils';
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
                height: scaleSzie(34), backgroundColor: '#F1F1F1',
                borderColor: '#C5C5C5', borderWidth: 1, borderRadius: 6,
                flexDirection: 'row',marginBottom:scaleSzie(3)
            }} >
                <View style={{ flex: 1 ,justifyContent:'center',paddingLeft:scaleSzie(10)}} >
                    <Text style={{ fontSize: scaleSzie(14), color: '#6A6A6A', }} >
                   {title}
                    </Text>
                </View>
                <View style={{ justifyContent: 'center', paddingRight: scaleSzie(12) }} >
                    <Image source={IMAGE.arrowRightButton} style={{ width: scaleSzie(6), height: scaleSzie(13) }} />
                </View>
            </Button>
        );
    }
}


export default ItemButton;


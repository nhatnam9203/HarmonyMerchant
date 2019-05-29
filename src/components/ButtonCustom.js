import React from 'react';

import Button from './Button';
import Text from './Text';
import { scaleSzie } from '../utils';

export default class ButtonCustom extends React.PureComponent {

    render() {
        const { width, backgroundColor, title, textColor } = this.props;
        return (
            <Button onPress={() => this.props.onPress()} style={{
                width,
                height: scaleSzie(60),
                backgroundColor,
                borderRadius: scaleSzie(6),
                justifyContent: 'center',
                alignItems: 'center'
            }} >
                <Text style={{color :textColor,fontWeight:'bold',fontSize :scaleSzie(18)}} >
                    {title}
                </Text>
            </Button>
        );
    }


}
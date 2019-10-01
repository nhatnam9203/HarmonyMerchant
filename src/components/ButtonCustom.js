import React from 'react';

import Button from './Button';
import Text from './Text';
import { scaleSzie } from '../utils';

export default class ButtonCustom extends React.PureComponent {

    render() {
        const { width, height,backgroundColor, title, textColor ,style,styleText,activeOpacity} = this.props;
        const temtpHeight = height ? height : 60;
        return (
            <Button onPress={() => this.props.onPress()} style={[{
                width,
                height: scaleSzie(temtpHeight),
                backgroundColor,
                borderRadius: scaleSzie(6),
                justifyContent: 'center',
                alignItems: 'center'
            },style]}
            activeOpacity={activeOpacity}
            >
                <Text style={[{color :textColor,fontWeight:'bold',fontSize :scaleSzie(18)},
            styleText]} >
                    {title}
                </Text>
            </Button>
        );
    }


}
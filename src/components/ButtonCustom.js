import React from 'react';

import Button from './Button';
import Text from './Text';
import { ScaleSzie } from '../utils';

export default class ButtonCustom extends React.PureComponent {

    render() {
        const { width, height,backgroundColor, title, textColor ,style,styleText,activeOpacity} = this.props;
        const temtpHeight = height ? height : 60;
        return (
            <Button onPress={() => this.props.onPress()} style={[{
                width,
                height: ScaleSzie(temtpHeight),
                backgroundColor,
                borderRadius: ScaleSzie(6),
                justifyContent: 'center',
                alignItems: 'center'
            },style]}
            activeOpacity={activeOpacity}
            >
                <Text style={[{color :textColor,fontWeight:'bold',fontSize :ScaleSzie(18)},
            styleText]} >
                    {title}
                </Text>
            </Button>
        );
    }


}
import React from 'react';
import { Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import Button from './Button';
import Text from './Text';
import { scaleSize } from '../utils';

export default class GradientButton extends React.PureComponent {

    render() {
        const { width, height, backgroundColor, title, textColor, style, styleText, activeOpacity,
            colors, onPress, icon,iconStyles
        } = this.props;
        const temtpHeight = height ? height : 60;
        return (
            <Button onPress={onPress} >
                <LinearGradient
                    colors={colors}
                    style={[{
                        width,
                        height: scaleSize(temtpHeight),
                        backgroundColor,
                        borderRadius: scaleSize(6),
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: "row"
                    }, style]}
                    activeOpacity={activeOpacity}
                >
                    {icon && <Image source={icon} style={[{width:scaleSize(20),height: scaleSize(20)},iconStyles]} />}
                    <Text style={[{ color: textColor, fontWeight: 'bold', fontSize: scaleSize(18) },
                        styleText]} >
                        {title}
                    </Text>
                </LinearGradient>
            </Button>
        );
    }


}
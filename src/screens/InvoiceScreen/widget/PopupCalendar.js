import React from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet,
    Platform
} from 'react-native';

import { Button, ModalCustom } from '@components';
import { scaleSzie } from '@utils';
import IMAGE from '@resources';

class PopupCalendar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        const { visible, onRequestClose } = this.props;
        return (
            <ModalCustom
                transparent={true}
                visible={visible}
                onRequestClose={() => onRequestClose()}
                style={{
                    justifyContent: 'flex-start', alignItems: 'flex-start',
                    backgroundColor: "transparent",
                    paddingTop: scaleSzie(155),
                    paddingLeft: scaleSzie(230)
                }}
            >
                <View style={styles.shadowP} >
                    <View style={{paddingLeft:scaleSzie(10)}} >
                        <View style={[styles.triangle]} />
                    </View>

                    <View style={styles.container} >

                    </View>
                </View>

            </ModalCustom>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: scaleSzie(535), height: scaleSzie(320), backgroundColor: '#fff',
        borderRadius: 8,
    },
    shadowP:{
        ...Platform.select({
            ios: {
                shadowColor: 'rgba(0, 0, 0,0.3)',
                shadowOffset: { width: 1, height: 0 },
                shadowOpacity: 1,

            },

            android: {
                elevation: 2,
            },
        })
    },
    triangle: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 20,
        borderRightWidth: 20,
        borderBottomWidth: 25,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: '#fff',
    }
})

export default PopupCalendar;


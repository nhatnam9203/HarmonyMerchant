import React from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet
} from 'react-native';

import { InputAuth, ButtonCustom, Button, DefaultTabBar } from '../../../../../components';
import { scaleSzie } from '../../../../../utils';

class EmptyStaff extends React.Component {

    renderFooter() {
        return (
            <View style={styles.footer} >
                <View style={styles.buttonContainer} >
                    <ButtonCustom
                        width={scaleSzie(250)}
                        height={40}
                        backgroundColor="#F1F1F1"
                        title="BACK"
                        textColor="#6A6A6A"
                        onPress={this.nextTab}
                        style={{ borderWidth: 1, borderColor: '#C5C5C5' }}
                    />
                </View>
                <View style={styles.buttonContainer} >
                    <ButtonCustom
                        width={scaleSzie(250)}
                        height={40}
                        backgroundColor="#F1F1F1"
                        title="SKIP"
                        textColor="#6A6A6A"
                        onPress={this.nextTab}
                        style={{ borderWidth: 1, borderColor: '#C5C5C5' }}
                    />
                </View>
            </View>
        );
    }

    renderBody() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                <Text style={{ fontSize: scaleSzie(40), color: '#A6A8AB', fontWeight: '500',
            marginBottom:scaleSzie(35)
            }} >
                    THIS LIST IS EMPTY
                </Text>
                <ButtonCustom
                    width={scaleSzie(300)}
                    height={55}
                    backgroundColor="#0764B0"
                    title="ADD"
                    textColor="#fff"
                    onPress={() => this.props.addStaff()}
                    style={{ borderWidth: 1, borderColor: '#C5C5C5' }}
                />
            </View>
        );
    }

    render() {
        return (
            <View style={styles.container} >
                {this.renderBody()}
                {this.renderFooter()}
            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    footer: {
        height: scaleSzie(50),
        flexDirection: 'row',
    },
    buttonContainer: {
        flex: 1,
        alignItems: 'center'
    },
})

export default EmptyStaff;


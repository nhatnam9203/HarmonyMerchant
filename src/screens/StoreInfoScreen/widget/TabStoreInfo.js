import React from 'react';
import {
    View,
    ScrollView,
    StyleSheet
} from 'react-native';

import { InputAuth, ButtonCustom, Button, DefaultTabBar } from '../../../components';
import { scaleSzie } from '../../../utils';

class TabStoreInfo extends React.Component {

    renderBody() {
        return (
            <View style={styles.body} >
                <ScrollView>

                </ScrollView>
            </View>
        );
    }

    nextTab = () => {

    }

    renderFooter() {
        return (
            <View style={styles.footer} >
                <View style={styles.buttonContainer} >
                    <ButtonCustom
                        width={scaleSzie(250)}
                        height={40}
                        backgroundColor="#0764B0"
                        title="NEXT"
                        textColor="#fff"
                        onPress={this.nextTab}
                    />
                </View>
                <View style={styles.buttonContainer} >
                    <ButtonCustom
                        width={scaleSzie(250)}
                        height={40}
                        backgroundColor="#0764B0"
                        title="NEXT"
                        textColor="#fff"
                        onPress={this.nextTab}
                    />
                </View>
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
    body: {
        flex: 1
    },
    footer: {
        height: scaleSzie(50),
        flexDirection: 'row',
        // alignItems:'center'
    },
    buttonContainer: {
        flex: 1,
        alignItems:'center'
    }

})

export default TabStoreInfo;

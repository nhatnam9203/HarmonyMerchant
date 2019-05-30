import React from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
} from 'react-native';

import { ButtonCustom, } from '../../../components';
import { scaleSzie } from '../../../utils';


class TabAdminInfo extends React.Component {

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
                <ButtonCustom
                    width={scaleSzie(220)}
                    height={40}
                    backgroundColor="#0764B0"
                    title="NEXT"
                    textColor="#fff"
                    onPress={this.nextTab}
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
    body: {
        flex: 1
    },
    footer: {
        height: scaleSzie(60),
        backgroundColor: 'red'
    }
})

export default TabAdminInfo;

import React from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    TextInput,
    Image
} from 'react-native';

import { ButtonCustom, Text, Dropdown, Button } from '@components';
import { scaleSize, localize, WorkingTime, getNameLanguage } from '@utils';
import IMAGE from '@resources';
import styles from './style';

class Layout extends React.Component {

    render() {
        const {language} = this.props;

        return (
            <View style={styles.container} >
                <View style={styles.containerAbout} >
                    <View style={{ flex: 1 }} >
                        <Text style={styles.textTitle} >

                            {localize('Contact information', language)}
                        </Text>
                        {/* ----------- */}
                        <Text style={styles.textCopy} >

                            {localize('Hotline', language)}
                        </Text>
                        {/* ----------- */}
                        <Text style={styles.textPhone} >
                        800-531-3126
                        </Text>
                        <Text style={styles.textPhone} >
                        813-534-0055 text
                        </Text>
                        <Text style={styles.textPhone} >
                        888-316-8164 fax
                        </Text>
                         {/* ----------- */}
                        <Button onPress={this.callPhone} style={{
                            width: scaleSize(45), height: scaleSize(45),
                        }} >
                            <Image source={IMAGE.phoneContact}
                                style={{ width: scaleSize(45), height: scaleSize(45) }}
                            />
                        </Button>
                        {/* ----------- */}
                        <Text style={[styles.textCopy, { marginVertical: scaleSize(10) }]} >

                            {localize('Email', language)}
                        </Text>
                        {/* ----------- */}
                        <Text style={[styles.textPhone,{marginTop:scaleSize(5),marginBottom:scaleSize(15)}]} >
                        team@harmonypayment.com
                        </Text>
                         {/* ----------- */}
                         <Button onPress={this.sendEmail} style={{
                            width: scaleSize(45), height: scaleSize(45),
                        }} >
                            <Image source={IMAGE.emailContact}
                                style={{ width: scaleSize(45), height: scaleSize(45) }}
                            />
                        </Button>
                    </View>
                </View>
            </View>

        );
    }
}



export default Layout;


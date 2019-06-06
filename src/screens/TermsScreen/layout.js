import React from 'react';
import {
    View,
    Image,
    ScrollView
} from 'react-native';

import { Text, HeaderLogoTop, ButtonCustom, Button } from '../../components';
import { scaleSzie } from '../../utils';
import styles from './style';
import Configs from '../../configs';
import IMAGE from '../../resources';

export default class Layout extends React.Component {

    render() {
        const {isAgree} = this.state;
        const temptIconCheck = isAgree ? IMAGE.checkBox : IMAGE.checkBoxEmpty;
        const temptBackgroundButton = isAgree ? '#0764B0' : '#F1F1F1';
        const temptColorTextButton = isAgree ? '#fff' : '#6A6A6A';
        return (
            <View style={styles.container} >
              <HeaderLogoTop />
                <View style={{ flex: 1, alignItems: 'center' }} >
                    <Text style={styles.textTitle} >
                        Terms of Service
                    </Text>
                    <View style={styles.termContainer} >
                        <View style={{ flex: 1, }} >
                            <ScrollView
                            >
                                <Text style={[styles.contentTerms, { fontWeight: "bold" }]}>
                                    Disclaimer
                            </Text>
                                <Text style={styles.contentTerms}>
                                    The European Commission maintains this website to enhance public access to
                                    information about its initiatives and European Union policies in general. Our
                                    goal is to keep this information timely and accurate. If errors are brought to
                                    our attention, we will try to correct them.
                                </Text>
                                <Text style={styles.contentTerms}>
                                    However the Commission accepts no responsibility or liability whatsoever with
                                    regard to the information on this site.
                            </Text>
                                <Text style={[styles.contentTerms, { fontWeight: "bold" }]}>
                                    This information is:
                            </Text>
                                <Text style={styles.contentTerms}>
                                    - Of a general nature only and is not intended to address the specific
                            </Text>
                                <Text style={styles.contentTerms}>
                                    circumstances of any particular individual or entity;
                            </Text>
                                <Text style={styles.contentTerms}>
                                    - not necessarily comprehensive, complete, accurate or up to date;
                            </Text>
                                <Text style={[styles.contentTerms, { marginBottom: 50 }]}>
                                    - sometimes linked to external sites over which the Commission services have
                                    no control and for which the Commission assumes no responsibility;
                            </Text>
                            </ScrollView>
                        </View>
                        
                    </View>
                    <View style={styles.checkboxContainer} >
                            <Button onPress={this.agreeTerm} style={{ width: scaleSzie(30), justifyContent: 'center'}} >
                                <Image source={temptIconCheck} style={{ width: scaleSzie(20), height: scaleSzie(20) }} />
                            </Button>
                        <View style={{justifyContent:'center'}} >
                            <Text style={{color:'#0764B0',fontSize:scaleSzie(16)}} >
                            I have read the terms of service
                            </Text>
                            </View>
                        </View>
                    <View style={styles.buttonContainer} >
                        <ButtonCustom
                            width={scaleSzie(250)}
                            height={60}
                            backgroundColor={temptBackgroundButton}
                            title="ACCEPT"
                            style={{
                                borderColor:'#C5C5C5',
                                borderWidth:1
                            }}
                            textColor={temptColorTextButton}
                            onPress={this.nextTab}
                        />
                    </View>
                </View>
            </View>


        );
    }
}

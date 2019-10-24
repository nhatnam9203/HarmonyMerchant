import React from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    TextInput,
    Image
} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import YouTube from 'react-native-youtube';

import { ButtonCustom, Text, Dropdown, Button } from '@components';
import { scaleSzie, localize, WorkingTime, getNameLanguage } from '@utils';
import IMAGE from '@resources';
import styles from './style';

class Layout extends React.Component {

    render() {
        return (
            <View style={styles.container} >
                <View style={{width:scaleSzie(240)}} >
                    <YouTube
                        videoId="eQq5knMITLk"
                        play={false}
                        fullscreen={true}
                        loop
                        onReady={e => this.setState({ isReady: true })}
                        onChangeState={e => this.setState({ status: e.state })}
                        onChangeQuality={e => this.setState({ quality: e.quality })}
                        onError={e => this.setState({ error: e.error })}
                        style={{ width:scaleSzie(240),height:scaleSzie(180)}}
                    />
                    <View style={{paddingRight:scaleSzie(10),marginTop:scaleSzie(10)}} >
                        <Text>
                        HarmonyPayment - Mobile Payment App With POS Systems
                        </Text>
                    </View>
                </View>

            </View>

        );
    }
}



export default Layout;


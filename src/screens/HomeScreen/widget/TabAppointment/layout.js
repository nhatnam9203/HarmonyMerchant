import React from 'react';
import {
    View,
} from 'react-native';
import { WebView } from 'react-native-webview';

import styles from './style';

const url = 'https://nhatnam9203.github.io/calendar2/?token=';

class Layout extends React.Component {

    render() {
        const{token} =this.props;
        return (
            <View style={styles.container} >
                <WebView source={{ uri: `${url}${token}` }}
                    onLoadStart={this.onLoadStartWebview}
                    onLoadEnd={this.onLoadEndWebview}
                />
            </View>
        );
    }

}

export default Layout;


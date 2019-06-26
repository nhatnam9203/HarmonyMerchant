import React from 'react';
import {
    View,
} from 'react-native';
import { WebView } from 'react-native-webview';

import styles from './style';

class Layout extends React.Component {

    render() {
        return (
            <View style={styles.container} >
                <WebView source={{ uri: 'https://facebook.github.io/react-native/' }}
                onLoadStart={this.onLoadStartWebview}
                    onLoadEnd={this.onLoadEndWebview}
                />
            </View>
        );
    }

}

export default Layout;


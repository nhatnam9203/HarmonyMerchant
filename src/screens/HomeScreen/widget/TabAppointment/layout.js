import React from 'react';
import {
    View,
} from 'react-native';
import { WebView } from 'react-native-webview';

import styles from './style';

const url = 'https://nhatnam9203.github.io/calendar2/?token=';
const storeId = 1;
const token1 = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imhhcm1vbnlAZ21haWwuY29tIiwibWVyY2hhbnRJZCI6IjMiLCJTdG9yZUlkIjoiMiIsImp0aSI6ImVhNDU4NTgyLTU1OTUtNDQ1Ni04M2FiLTBmYjI5NjljMWZkMSIsImV4cCI6MTU2MTUzODUyMiwiaXNzIjoiVGVzdC5jb20iLCJhdWQiOiJUZXN0LmNvbSJ9.8EKjyTZPnpS2oggLNtWdYLE-5IRr1JEf5dMN3jwFyig';

class Layout extends React.Component {

    render() {
        const{token} =this.props;
        return (
            <View style={styles.container} >
                <WebView source={{ uri: `${url}${token}&storeid=${storeId}` }}
                    onLoadStart={this.onLoadStartWebview}
                    onLoadEnd={this.onLoadEndWebview}
                />
            </View>
        );
    }

}

export default Layout;


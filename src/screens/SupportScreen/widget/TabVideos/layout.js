import React from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    TextInput,
    Image,
    FlatList
} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import YouTube from 'react-native-youtube';

import { ButtonCustom, Text, Dropdown, Button } from '@components';
import { scaleSzie, localize, YOUTUBE_DATA } from '@utils';
import IMAGE from '@resources';
import styles from './style';


class Layout extends React.Component {

    render() {
        return (
            <View style={styles.container} >
                <FlatList
                    data={YOUTUBE_DATA}
                    renderItem={({ item, index }) => <YouTubeItem
                        data={item}
                        showFullScreeen={this.showFullScreeen}
                    />}
                    keyExtractor={(item, index) => `${item.videoId}_${index}`}
                    numColumns={3}
                    columnWrapperStyle={{
                        justifyContent: 'space-between',
                        paddingHorizontal: scaleSzie(20),
                        marginTop: scaleSzie(20)
                    }}
                />

            </View>

        );
    }
}


class YouTubeItem extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isReady: false,
            status: '',
            quality: '',
            error: ''
        }
    }

    onReady = (e) =>{
        console.log('onReady : ',e);
        // this.setState({ isReady: true });
    }

    onChangeState = (e) =>{
        console.log('onChangeState : ',e);
        // this.setState({ status: e.state })
    }

    onChangeQuality = (e) =>{
        console.log('onChangeQuality : ',e);
        // this.setState({ quality: e.quality })
    }

    onError = (e) =>{
        console.log('onError : ',e);
        // this.setState({ error: e.error })
    }

    showFullScreeen =() =>{
        const { data} = this.props;
        this.props.showFullScreeen(data.videoId);
    }

    render() {
        const { data} = this.props
        return (
            <View style={{ width: scaleSzie(180) }} >
                <View style={{ width: scaleSzie(180), height: scaleSzie(120) }} >
                    <YouTube
                        videoId={data.videoId}
                        play={false}
                        fullscreen={true}
                        loop
                        onReady={this.onReady}
                        onChangeState={this.onChangeState }
                        onChangeQuality={this.onChangeQuality}
                        onError={this.onError}
                        style={{ width: scaleSzie(180), height: scaleSzie(120) }}
                    />
                    <Button onPress={this.showFullScreeen} style={{
                        width: scaleSzie(30), height: scaleSzie(20),
                        position: 'absolute', bottom: 0, right: 0
                    }} >

                    </Button>
                </View>
                <View style={{ paddingRight: scaleSzie(10), marginTop: scaleSzie(10) }} >
                    <Text style={{ color: '#404040', fontSize: scaleSzie(12) }} >
                        {data.description}
                    </Text>
                </View>
            </View>
        )
    }

}


export default Layout;

